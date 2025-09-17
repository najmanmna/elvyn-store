import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    // ✅ Token check
    if (!process.env.SANITY_API_TOKEN) {
      console.error("❌ Missing SANITY_API_TOKEN");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { form, items, total, shippingCost } = body;

    // ✅ Validate required fields
    if (
      !form?.firstName ||
      !form?.lastName ||
      !form?.address ||
      !form?.district ||
      !form?.city ||
      !form?.phone ||
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof total !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing required checkout fields" },
        { status: 400 }
      );
    }

    // ✅ Generate readable orderId
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // ✅ Prevent duplicates within 30s (optional)
    const existing = await backendClient.fetch(
      `*[_type == "order" && phone == $phone && total == $total && orderDate > $recent][0]`,
      {
        phone: form.phone,
        total,
        recent: new Date(Date.now() - 1000 * 30).toISOString(),
      }
    );

    if (existing) {
      return NextResponse.json(
        { error: "Duplicate order detected. Please wait a moment." },
        { status: 429 }
      );
    }

    // ✅ Fetch latest product data from Sanity
    const productIds = items.map((it: any) => it.product._id);
    const freshProducts = await backendClient.fetch(
      `*[_type=="product" && _id in $ids]{
        _id,
        _rev,
        name,
        variants[]{_key, stock}
      }`,
      { ids: productIds }
    );

    // ✅ Check stock against cart
    for (const it of items) {
      const fresh = freshProducts.find((p: any) => p._id === it.product._id);
      if (!fresh) {
        return NextResponse.json(
          { error: `Product not found: ${it.product?._id}` },
          { status: 404 }
        );
      }

      const variant = fresh.variants?.find((v: any) => v._key === it.variant?._key);
      if (!variant) {
        return NextResponse.json(
          { error: `Variant not found for ${fresh.name}` },
          { status: 400 }
        );
      }

      if (variant.stock < it.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${fresh.name} (${it.variant?.color || ""}). Only ${variant.stock} left.`,
          },
          { status: 409 }
        );
      }

      // ✅ attach latest _rev to cart item (for ifRevisionId)
      it.product._rev = fresh._rev;
    }

    // ✅ Build order object
    const order = {
      _type: "order",
      orderNumber: orderId,
      status: "pending",
      orderDate: new Date().toISOString(),

      customerName: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      email: form.email || "",

      address: {
        district: form.district,
        city: form.city,
        line1: form.address,
        notes: form.notes || "",
      },

      paymentMethod: form.payment || "COD",

      items: items.map((it: any) => ({
        _type: "orderItem",
        _key: uuidv4(),
        product: { _type: "reference", _ref: it.product._id },
        variant:
          typeof it.variant === "string" ? it.variant : it.variant?.color || "",

        quantity: it.quantity,
        price: it.product.price ?? 0,
      })),

      subtotal: items.reduce(
        (acc: number, it: any) =>
          acc + (it.product.price ?? 0) * it.quantity,
        0
      ),
      shippingCost: shippingCost ?? 0,
      total,
    };

    // ✅ Use transaction: create order + reduce stock atomically
    const tx = backendClient.transaction();

    // Create order doc
    tx.create(order);

    // Reduce stock for each product (with revision check)
    items.forEach((it: any) => {
      if (it.product?._id && it.variant?._key && typeof it.quantity === "number") {
        tx.patch(it.product._id, (p) =>
          p
            .inc({
              [`variants[_key=="${it.variant._key}"].stock`]: -it.quantity,
            })
            .ifRevisionId(it.product._rev) // ✅ optimistic concurrency check
        );
      }
    });

    // ✅ Commit transaction and check result
    const result = await tx.commit();

    if (!result || !result.results?.length) {
      console.error("❌ Transaction failed:", result);
      return NextResponse.json(
        { error: "Order could not be processed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Order placed successfully!",
        orderId,
        payment: form.payment,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Checkout API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
