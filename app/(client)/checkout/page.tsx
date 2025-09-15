"use client";

import { useEffect, useState } from "react";
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

// 🔹 Districts + Cities (simplified)
const DISTRICTS: Record<string, string[]> = {
  Colombo: ["Colombo 01", "Colombo 02", "Colombo 03", "Dehiwala", "Moratuwa"],
  Gampaha: ["Negombo", "Gampaha", "Minuwangoda", "Ja-Ela"],
  Kandy: ["Kandy", "Peradeniya", "Katugastota"],
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const resetCart = useCartStore((s) => s.resetCart);

  const [shippingCost, setShippingCost] = useState<string | number>("FREE");
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
  useEffect(() => {
    async function fetchShipping() {
      try {
        const query = `*[_type=="settings"][0]{shipping}`;
        const data = await client.fetch(query);
        setShippingCost(data?.shipping ?? "FREE");
      } catch (err) {
        console.error("Failed to fetch shipping:", err);
      }
    }
    fetchShipping();
  }, []);

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
  const shippingFee =
    typeof shippingCost === "string" && shippingCost.toLowerCase() === "free"
      ? 0
      : Number(shippingCost || 0);
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.address ||
      !form.district ||
      !form.city ||
      !form.phone
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, items, total }),
      });

      if (!res.ok) throw new Error("Checkout failed");

      const data = await res.json();

      toast.success("Order placed successfully!");
      router.push(
        `/success?orderNumber=${data.orderId}&payment=${form.payment}`
      );
    //   setTimeout(() => resetCart(), 200);
      // Redirect with order number + payment
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order.");
    }
  };

  return (
    <div className="container mx-auto py-10 grid md:grid-cols-2 gap-8">
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
              <Label>District *</Label>
              <select
                className="w-full border rounded-md p-2"
                value={form.district}
                onChange={(e) =>
                  setForm({ ...form, district: e.target.value, city: "" })
                }
                required
              >
                <option value="">Select District</option>
                {Object.keys(DISTRICTS).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <Label>Town / City *</Label>
              <select
                className="w-full border rounded-md p-2"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                disabled={!form.district}
                required
              >
                <option value="">Select City</option>
                {form.district &&
                  DISTRICTS[form.district]?.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
          className="w-full rounded-md font-semibold tracking-wide mt-4"
        >
          Confirm Order
        </Button>
      </form>

      {/* RIGHT: Order Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Your Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map(({ product, variant, quantity, itemKey }) => (
              <div
                key={itemKey}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={urlFor(
                      variant?.images?.[0] ?? product.images?.[0]
                    ).url()}
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
            ))}

            <div className="flex justify-between">
              <span>Subtotal</span>
              <PriceFormatter amount={subtotal} />
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {typeof shippingCost === "string"
                  ? shippingCost
                  : `Rs. ${shippingCost}`}
              </span>
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
    </div>
  );
}
