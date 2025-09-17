"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import toast from "react-hot-toast";
import Container from "@/components/Container";
import { DISTRICTS } from "@/constants/SrilankaDistricts";

// 🔹 Districts + Cities (simplified)
// const DISTRICTS: Record<string, string[]> = {
//   Colombo: ["Colombo 01", "Colombo 02", "Colombo 03", "Dehiwala", "Moratuwa"],
//   Gampaha: ["Negombo", "Gampaha", "Minuwangoda", "Ja-Ela"],
//   Kandy: ["Kandy", "Peradeniya", "Katugastota"],
// };

const SHIPPING_QUERY = `*[_type == "settings"][0]{
  deliveryCharges {
    colombo,
    suburbs,
    others
  }
}`;
const colomboCityAreas = [
  "Colombo 01 - Fort",
  "Colombo 02 - Slave Island",
  "Colombo 03 - Kollupitiya",
  "Colombo 04 - Bambalapitiya",
  "Colombo 05 - Havelock Town",
  "Colombo 06 - Wellawatte",
  "Colombo 07 - Cinnamon Gardens",
  "Colombo 08 - Borella",
  "Colombo 09 - Dematagoda",
  "Colombo 10 - Maradana",
  "Colombo 11 - Pettah",
  "Colombo 12 - Hulftsdorp",
  "Colombo 13 - Kotahena",
  "Colombo 14 - Grandpass",
  "Colombo 15 - Modara",
];

const colomboSuburbs = [
  "Sri Jayawardenepura Kotte",
  "Dehiwala",
  "Mount Lavinia",
  "Moratuwa",
  "Kaduwela",
  "Maharagama",
  "Kesbewa",
  "Homagama",
  "Kolonnawa",
  "Rajagiriya",
  "Nugegoda",
  "Pannipitiya",
  "Boralesgamuwa",
  "Malabe",
  "Kottawa",
  "Pelawatta",
  "Ratmalana",
  "Kohuwala",
  "Battaramulla",
  "Thalawathugoda",
  "Nawinna",
  "Piliyandala",
  "Angoda",
  "Athurugiriya",
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  // ✅ add state at top
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const placingRef = useRef(false); // 🚀 instant flag

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    district: "",
    city: "",
    phone: "",
    email: "",
    notes: "",
    payment: "COD",
  });
  // 🔹 Fetch shipping cost from Sanity

  const [deliveryCharges, setDeliveryCharges] = useState<{
    colombo: number;
    suburbs: number;
    others: number;
  } | null>(null);

  const [shippingCost, setShippingCost] = useState<number>(0);

  useEffect(() => {
    async function fetchShipping() {
      try {
        const data = await client.fetch(SHIPPING_QUERY);
        setDeliveryCharges(data?.deliveryCharges ?? null);
      } catch (err) {
        console.error("Failed to fetch shipping:", err);
      }
    }
    fetchShipping();
  }, []);

  useEffect(() => {
    if (!deliveryCharges || !form.district || !form.city) return;

    let fee = deliveryCharges.others; // default

    if (form.district === "Colombo") {
      if (colomboCityAreas.includes(form.city)) {
        fee = deliveryCharges.colombo; // city limits
      } else if (colomboSuburbs.includes(form.city)) {
        fee = deliveryCharges.suburbs; // suburbs
      } else {
        fee = deliveryCharges.others; // fallback if unknown
      }
    }

    setShippingCost(fee);
  }, [form.district, form.city, deliveryCharges]);

  // 🔹 Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const subtotal = items.reduce(
    (t, it) => t + (it.product.price ?? 0) * it.quantity,
    0
  );

  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Checkout payload:", {
      form,
      items,
      total,
      shippingCost,
    });

    if (placingRef.current) return; // block instantly
    placingRef.current = true;
    setIsPlacingOrder(true);

    try {
      const payload = {
        form,
        total,
        shippingCost,
        items: items.map((i) => ({
          product: { _id: i.product._id, price: i.product.price },
          variantKey: i.variant._key, // ✅ important for stock update
          variant: {
            _key: i.variant._key,
            color: i.variant.color,
            stock: i.variant.stock,
            images: i.variant.images,
          },
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          // 🔹 Stock conflict
          toast.error(data.error || "Some items are out of stock.");
        } else {
          toast.error(data.error || "Checkout failed.");
        }

        placingRef.current = false;
        setIsPlacingOrder(false);
        return;
      }
      window.scrollTo(0, 0);

      // ✅ success
      toast.success("Order placed successfully!");
      sessionStorage.setItem("orderPlaced", "true");
      router.push(
        `/success?orderNumber=${data.orderId}&payment=${form.payment}&total=${total}`
      );
    } catch (err) {
      console.error("❌ Checkout error:", err);
      toast.error("Failed to place order.");
      placingRef.current = false;
      setIsPlacingOrder(false);
    }
  };

  return (
    <Container className="py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT: Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <Label>Address *</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
            </div>

            {/* District */}
            <div>
              <Label htmlFor="district">District *</Label>
              <select
                id="district"
                className="w-full border rounded-md p-2"
                value={form.district}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    district: e.target.value,
                    city: "", // reset city when district changes
                  }))
                }
                required
              >
                <option value="">Select District</option>
                {Object.keys(DISTRICTS).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <Label htmlFor="city">Town / City *</Label>
              <select
                id="city"
                className="w-full border rounded-md p-2"
                value={form.city}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                disabled={!form.district}
                required
              >
                <option value="">Select City</option>
                {form.district &&
                  DISTRICTS[form.district]?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <Label>Phone *</Label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email (optional)</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Notes */}
            <div>
              <Label>Order Notes (optional)</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue="COD"
              onValueChange={(v) => setForm({ ...form, payment: v })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COD" id="cod" />
                <Label htmlFor="cod">Cash on Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BANK" id="bank" />
                <Label htmlFor="bank">Bank Transfer</Label>
              </div>
            </RadioGroup>

            {/* 🔹 Show bank details if BANK selected */}
            {form.payment === "BANK" && (
              <div className="mt-4 p-3 rounded-md border bg-gray-50 text-sm text-gray-700">
                <p className="font-medium mb-2">You’ll get bank details after order placement.</p>

                

                <p className="mt-2 text-xs text-gray-600 italic">
                  ⚠️ Please mention your <strong>name</strong> or{" "}
                  <strong>Order Number </strong>
                  as the payment reference when doing the transfer.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ✅ Privacy + Terms */}
        <Card>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Your personal data will only be used to process your order,
              support your experience throughout this website, and for other
              purposes described in our{" "}
              <a
                href="/privacy-policy"
                className="text-blue-600 underline hover:text-blue-800"
                target="_blank"
              >
                Privacy Policy
              </a>
              .
            </p>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" required className="h-4 w-4" />
              <Label htmlFor="terms" className="text-sm">
                I agree to the website{" "}
                <a
                  href="/terms"
                  className="text-blue-600 underline hover:text-blue-800"
                  target="_blank"
                >
                  Terms of Service
                </a>
                .
              </Label>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={isPlacingOrder} // prevent double clicks
          className="w-full font-semibold tracking-wide mx-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlacingOrder ? "Placing Order..." : "Confirm Order"}
        </Button>
      </form>

      {/* RIGHT: Order Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Your Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map(({ product, variant, quantity, itemKey }) => {
              // 👇 pick variant image first, else fall back to product image
              const imageSource = variant?.images?.[0] ?? product?.images?.[0];
              const imageUrl = imageSource
                ? urlFor(imageSource).url()
                : "/fallback.png";

              return (
                <div
                  key={itemKey}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={imageUrl}
                      alt={product?.name || "Product image"}
                      width={50}
                      height={50}
                      className="rounded-md border"
                    />
                    <div>
                      <p className="text-sm font-medium">{product?.name}</p>
                      <p className="text-xs text-gray-500">x {quantity}</p>
                    </div>
                  </div>
                  <PriceFormatter amount={(product.price ?? 0) * quantity} />
                </div>
              );
            })}

            <div className="flex justify-between">
              <span>Subtotal</span>
              <PriceFormatter amount={subtotal} />
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "FREE" : `Rs. ${shippingCost}`}</span>
            </div>

            <div className="text-xs text-gray-500">
              Estimated Delivery: 3-5 Working Days
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <PriceFormatter amount={total} />
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
