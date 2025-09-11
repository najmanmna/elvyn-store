"use client";
import React, { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import { CornerDownLeft, Truck } from "lucide-react";
import Container from "@/components/Container";

export default function ProductClient({ product }: { product: any }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const rawVariant = product?.variants?.[selectedVariantIndex];
  const selectedVariant = rawVariant
    ? {
        id: rawVariant._key ?? rawVariant.id ?? String(selectedVariantIndex),
        color: rawVariant.colorName ?? rawVariant.color ?? rawVariant.name,
        stock: rawVariant.stock ?? 0,
        images: rawVariant.images ?? [],
      }
    : undefined;

  // image list fallback: variant images first, then product.images
  const images = selectedVariant?.images?.length ? selectedVariant.images : product?.images ?? [];

  // itemKey used for forcing remount and uniqueness in cart
  const itemKey = selectedVariant ? `${product._id}-${selectedVariant.id}` : product._id;

  return (
    <div className="bg-tech_white py-10">
      <Container>
        <div className="flex flex-col md:flex-row gap-10">
          {/* Product Images (variant first, fallback to product images) */}
          {images?.length > 0 && (
            <ImageView images={images} isStock={selectedVariant?.stock ?? product?.stock} />
          )}

          {/* Info */}
          <div className="w-full md:w-3/5 flex flex-col gap-5">
            <div className="space-y-1">
              <p
                className={`w-24 text-center text-xs py-1 font-semibold rounded-lg ${
                  (selectedVariant?.stock ?? product?.stock ?? 0) > 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {(selectedVariant?.stock ?? product?.stock ?? 0) > 0 ? "In Stock" : "Out of Stock"}
              </p>
              <p className="text-2xl font-bold">{product?.name}</p>
            </div>

            <PriceView price={product?.price} discount={product?.discount} className="text-lg font-bold" />

            {/* Colors */}
            {product?.variants?.length > 0 && (
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold">Colors:</p>
                {product.variants.map((v: any, idx: number) => (
                  <button
                    key={v._key ?? idx}
                    className={`px-3 py-1 rounded border ${
                      idx === selectedVariantIndex ? "bg-black text-white" : "bg-white text-black"
                    }`}
                    onClick={() => setSelectedVariantIndex(idx)}
                  >
                    {v.colorName ?? v.color ?? `Option ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* key=itemKey forces remount when variant changes so add-to-cart UI updates */}
              <AddToCartButton key={itemKey} product={product} variant={selectedVariant} />
              <button className="w-36 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition">
                BUY NOW
              </button>
            </div>

            {/* Delivery Info */}
            <div className="flex flex-col gap-2">
              <div className="border border-gray-200 p-3 flex items-center gap-3">
                <Truck size={30} className="text-tech_orange" />
                <div>
                  <p className="text-base font-semibold text-black">Free Delivery</p>
                  <p className="text-sm text-gray-500 underline underline-offset-2">
                    Enter your Postal code for Delivery Availability.
                  </p>
                </div>
              </div>
              <div className="border border-gray-200 p-3 flex items-center gap-3">
                <CornerDownLeft size={30} className="text-tech_orange" />
                <div>
                  <p className="text-base font-semibold text-black">Return Delivery</p>
                  <p className="text-sm text-gray-500">
                    Free 30 days Delivery Returns. <span className="underline">Details</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
