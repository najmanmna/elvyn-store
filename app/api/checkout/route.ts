import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { form, items, total } = body;

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
      !total
    ) {
      return NextResponse.json(
        { error: "Missing required checkout fields" },
        { status: 400 }
      );
    }

    // ✅ Generate orderId
    const orderId = uuidv4();

    // ✅ Example: build order object (can save to DB / Sanity later)
    const order = {
      orderId,
      form,
      items,
      total,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    console.log("🛒 New Order Received:", order);

    return NextResponse.json(
      { message: "Order placed successfully!", orderId, payment: form.payment },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Checkout API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
