// src/app/cart/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { urlFor } from "@/sanity/lib/image";
import useCartStore from "@/store";
import { ArrowLeft, ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import EmptyCart from "@/components/EmptyCart";
import { client } from "@/sanity/lib/client";
import { Address, ADDRESS_QUERYResult } from "@/sanity.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Container from "@/components/Container";

const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const deleteCartProduct = useCartStore((s) => s.deleteCartProduct);
  const resetCart = useCartStore((s) => s.resetCart);
  const updateItemVariant = useCartStore((s) => s.updateItemVariant); // ✅ make sure this exists in your store

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<ADDRESS_QUERYResult | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // 🔹 refresh stock on mount
  useEffect(() => {
    const refreshStock = async () => {
      if (!items.length) return;

      try {
        const productIds = items.map((i) => i.product._id);
        const query = `*[_type=="product" && _id in $ids]{
          _id,
          variants[]{ colorName, stock }
        }`;
        const freshProducts = await client.fetch(query, { ids: productIds });

        items.forEach((item) => {
          const fresh = freshProducts.find(
            (p: any) => p._id === item.product._id
          );
          if (!fresh) return;

          const matchedVariant = fresh.variants?.find(
            (v: any) =>
              v._key === item.variant?.id || v.colorName === item.variant?.color
          );

          if (matchedVariant) {
            updateItemVariant(item.itemKey, {
              ...item.variant,
              stock: matchedVariant.stock,
            });
          }
        });
      } catch (err) {
        console.error("Failed to refresh stock:", err);
      }
    };

    refreshStock();
  }, [items, updateItemVariant]);

  // 🔹 fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const query = `*[_type=="address"] | order(publishedAt desc)`;
        const data = await client.fetch(query);
        setAddresses(data);
        const defaultAddress = data.find((a) => a.default);
        if (defaultAddress) setSelectedAddress(defaultAddress);
        else if (data.length > 0) setSelectedAddress(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleResetCart = () => {
    if (confirm("Are you sure to reset your Cart?")) {
      resetCart();
      toast.success("Your cart reset successfully!");
    }
  };

  const handleDelete = (itemKey: string) => {
    deleteCartProduct(itemKey);
    toast.success("Product deleted successfully!");
  };

  const total = items.reduce(
    (t, it) => t + (it.product.price ?? 0) * it.quantity,
    0
  );
  const subtotal = items.reduce((t, it) => {
    const price = it.product.price ?? 0;
    const discount = ((it.product.discount ?? 0) * price) / 100;
    const discounted = price - discount;
    return t + discounted * it.quantity;
  }, 0);

  return (
    <div className="pb-20 md:pb-10">
      <Container className="bg-tech_white mt-5 pb-5 rounded-md">
        {items?.length ? (
          <>
            <div className="flex items-center gap-2 py-5">
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
              <h1 className="text-xl md:text-2xl font-semibold">
                Shopping Cart
              </h1>
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg border mb-6">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-3 px-4 text-left">Image</th>
                    <th className="py-3 px-4 text-left">Product Name</th>
                    <th className="py-3 px-4 text-left">Color</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(({ product, variant, itemKey, quantity }) => {
                    const thumbnail =
                      variant?.images?.[0] ?? product.images?.[0];
                    const model = variant?.color ?? "-";

                    return (
                      <tr key={itemKey} className="border-b">
                        <td className="py-4 px-4">
                          {thumbnail && (
                            <Link href={`/product/${product?.slug?.current}`}>
                              <Image
                                src={urlFor(thumbnail).url()}
                                alt={product?.name || "Product image"}
                                width={80}
                                height={80}
                                className="border rounded-md object-cover"
                              />
                            </Link>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            href={`/product/${product?.slug?.current}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {product?.name}
                          </Link>
                        </td>
                        <td className="py-4 px-4 capitalize">{model}</td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center">
                            <QuantityButtons
                              product={product}
                              variant={variant}
                              itemKey={itemKey}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <PriceFormatter amount={product?.price as number} />
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          <PriceFormatter
                            amount={(product?.price as number) * quantity}
                          />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleDelete(itemKey)}
                            className="text-red-500 hover:text-red-700 hover:cursor-pointer hoverEffect"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-4">
              {items.map(({ product, variant, itemKey, quantity }) => {
                const thumbnail = variant?.images?.[0] ?? product.images?.[0];
                const model = variant?.color ?? "-";

                return (
                  <Card key={itemKey} className="overflow-hidden">
                    <div className="flex p-3 border-b">
                      {thumbnail && (
                        <Link
                          href={`/product/${product?.slug?.current}`}
                          className="mr-3"
                        >
                          <Image
                            src={urlFor(thumbnail).url()}
                            alt={product?.name || "Product image"}
                            width={80}
                            height={80}
                            className="border rounded-md object-cover"
                          />
                        </Link>
                      )}
                      <div className="flex-1">
                        <Link
                          href={`/product/${product?.slug?.current}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {product?.name}
                        </Link>
                        <p className="text-sm text-gray-500 capitalize">
                          Color: {model}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(itemKey)}
                        className="text-red-500"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="p-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Unit Price:</p>
                        <PriceFormatter
                          amount={product?.price as number}
                          className="font-medium"
                        />
                      </div>

                      <QuantityButtons
                        product={product}
                        variant={variant}
                        itemKey={itemKey}
                        displayMode="default"
                      />

                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total:</p>
                        <PriceFormatter
                          amount={(product?.price as number) * quantity}
                          className="font-bold"
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Link href="/" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                  <Button
                    onClick={handleResetCart}
                    variant="destructive"
                    className="flex-1"
                  >
                    Reset Cart
                  </Button>
                </div>
              </div>

              <div>
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <PriceFormatter amount={subtotal} />
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <PriceFormatter amount={subtotal - total} />
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <PriceFormatter
                        amount={total}
                        className="text-lg font-bold text-black"
                      />
                    </div>

                    {addresses && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Delivery Address</h3>
                        <RadioGroup
                          defaultValue={addresses
                            .find((a) => a.default)
                            ?._id.toString()}
                          className="space-y-2"
                        >
                          {addresses.map((address) => (
                            <div
                              key={address._id}
                              onClick={() => setSelectedAddress(address)}
                              className={`flex items-center space-x-2 cursor-pointer ${
                                selectedAddress?._id === address._id
                                  ? "text-tech_orange"
                                  : ""
                              }`}
                            >
                              <RadioGroupItem
                                value={address._id.toString()}
                                id={`address-${address._id}`}
                              />
                              <Label
                                htmlFor={`address-${address._id}`}
                                className="grid gap-0.5 flex-1 text-sm"
                              >
                                <span className="font-semibold">
                                  {address.name}
                                </span>
                                <span className="text-xs text-muted-foreground line-clamp-2">
                                  {address.address}, {address.city}{" "}
                                  {address.state} {address.zip}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>

                        <Button
                          variant="outline"
                          className="w-full mt-3 text-xs"
                          size="sm"
                        >
                          Add New Address
                        </Button>
                      </div>
                    )}

                    <Button
                      onClick={() =>
                        toast.success("Cart needs to be initialized!")
                      }
                      disabled={loading}
                      className="w-full rounded-md font-semibold tracking-wide mt-4"
                      size="lg"
                    >
                      {loading ? "Processing..." : "Confirm Order"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <EmptyCart />
        )}
      </Container>
    </div>
  );
};

export default CartPage;
