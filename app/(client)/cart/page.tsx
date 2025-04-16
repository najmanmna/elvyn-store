"use client";
import React, { useEffect, useState } from "react";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { urlFor } from "@/sanity/lib/image";
import useCartStore from "@/store";
import { useUser } from "@clerk/nextjs";
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
import { Input } from "@/components/ui/input";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useCartStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useCartStore((state) => state.getGroupedItems());
  const { user } = useUser();
  const [addresses, setAddresses] = useState<ADDRESS_QUERYResult | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [voucherCode, setVoucherCode] = useState("");

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type=="address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.log("Addresses fetching error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleResetCart = () => {
    const confirmed = window.confirm("Are you sure to reset your Cart?");
    if (confirmed) {
      resetCart();
      toast.success("Your cart reset successfully!");
    }
  };

  const handleCheckout = async () => {
    toast.success("Cart need to be initialized!");
  };

  const handleDeleteProduct = (id: string) => {
    deleteCartProduct(id);
    toast.success("Product deleted successfully!");
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    toast.success("Coupon applied successfully!");
    // Implement coupon logic here
  };

  const applyVoucher = () => {
    if (!voucherCode.trim()) {
      toast.error("Please enter a voucher code");
      return;
    }
    toast.success("Voucher applied successfully!");
    // Implement voucher logic here
  };

  return (
    <div className="pb-20 md:pb-10">
      <Container className="bg-tech_white mt-5 pb-5 rounded-md">
        {groupedItems?.length ? (
          <>
            <div className="flex items-center gap-2 py-5">
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
              <h1 className="text-xl md:text-2xl font-semibold">
                Shopping Cart
              </h1>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg border mb-6">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-3 px-4 text-left">Image</th>
                    <th className="py-3 px-4 text-left">Product Name</th>
                    <th className="py-3 px-4 text-left">Model</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedItems?.map(({ product }) => {
                    const itemCount = getItemCount(product?._id);
                    return (
                      <tr key={product?._id} className="border-b">
                        <td className="py-4 px-4">
                          {product?.images && (
                            <Link href={`/product/${product?.slug?.current}`}>
                              <Image
                                src={urlFor(product.images[0]).url()}
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
                        <td className="py-4 px-4 capitalize">
                          {product?.variant}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center">
                            <QuantityButtons product={product} />
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <PriceFormatter amount={product?.price as number} />
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          <PriceFormatter
                            amount={(product?.price as number) * itemCount}
                          />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleDeleteProduct(product?._id)}
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {groupedItems?.map(({ product }) => {
                const itemCount = getItemCount(product?._id);
                return (
                  <Card key={product?._id} className="overflow-hidden">
                    <div className="flex p-3 border-b">
                      {product?.images && (
                        <Link
                          href={`/product/${product?.slug?.current}`}
                          className="mr-3"
                        >
                          <Image
                            src={urlFor(product.images[0]).url()}
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
                          Model: {product?.variant}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(product?._id)}
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
                      <QuantityButtons product={product} />
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total:</p>
                        <PriceFormatter
                          amount={(product?.price as number) * itemCount}
                          className="font-bold"
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
              {/* Coupon & Voucher Section */}
              <div className="md:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Apply Coupon Code</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button onClick={applyCoupon}>Apply Coupon</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Apply Voucher</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter voucher code"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                      />
                      <Button onClick={applyVoucher}>Apply Voucher</Button>
                    </div>
                  </CardContent>
                </Card>

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

              {/* Order Summary */}
              <div>
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <PriceFormatter amount={getSubTotalPrice()} />
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <PriceFormatter
                        amount={getSubTotalPrice() - getTotalPrice()}
                      />
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <PriceFormatter
                        amount={getTotalPrice()}
                        className="text-lg font-bold text-black"
                      />
                    </div>

                    {addresses && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Delivery Address</h3>
                        <RadioGroup
                          defaultValue={addresses
                            .find((addr) => addr.default)
                            ?._id.toString()}
                          className="space-y-2"
                        >
                          {addresses.map((address) => (
                            <div
                              onClick={() => setSelectedAddress(address)}
                              key={address._id}
                              className={`flex items-center space-x-2 cursor-pointer ${
                                selectedAddress?._id === address?._id &&
                                "text-tech_orange"
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
                                  {address.address}, {address.city},{" "}
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
                      onClick={handleCheckout}
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
