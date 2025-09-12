"use client";
import React, { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";

import Container from "@/components/Container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export default function ProductClient({ product }: { product: any }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // ✅ always pick from variants (schema guarantees at least one)
  const rawVariant = product.variants[selectedVariantIndex];
  const selectedVariant = {
    id: rawVariant._key ?? rawVariant.id ?? String(selectedVariantIndex),
    color: rawVariant.colorName ?? rawVariant.color ?? rawVariant.name,
    stock: rawVariant.stock ?? 0,
    images: rawVariant.images ?? [],
  };

  // ✅ images for ImageView
  const images =
    selectedVariant.images?.length > 0
      ? selectedVariant.images
      : product.images ?? [];

  // ✅ unique cart key
  const itemKey = `${product._id}-${selectedVariant.id}`;

  return (
    <div className="bg-tech_white py-10">
      <Container>
        <div className="flex flex-col md:flex-row gap-10">
          {/* Product Images (main gallery) */}
          {images.length > 0 && (
            <ImageView images={images} isStock={selectedVariant.stock} />
          )}

          {/* Info */}
          <div className="w-full md:w-3/5 flex flex-col gap-5">
            <div className="space-y-1">
              <p
                className={`w-24 text-center text-xs py-1 font-semibold rounded-lg ${
                  selectedVariant.stock > 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {selectedVariant.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>
              <p className="text-2xl font-bold">{product?.name}</p>
            </div>

            {/* Price */}
            <PriceView
              price={product?.price}
              discount={product?.discount}
              className="text-lg font-bold"
            />

            {/* Delivery Time */}
            <p className="text-sm text-gray-600">Delivery Time: 3-5 Working Days</p>

            {/* Colors */}
            {product?.variants?.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold">Colors:</p>
                  {product.variants.map((v: any, idx: number) => (
                    <button
                      key={v._key ?? idx}
                      className={`px-3 py-1 rounded border ${
                        idx === selectedVariantIndex
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => setSelectedVariantIndex(idx)}
                    >
                      {v.colorName ?? v.color ?? `Option ${idx + 1}`}
                    </button>
                  ))}
                </div>

              {/* Variant image previews under colors */}
<div className="flex gap-2 mt-2">
  {product.variants.map((v: any, idx: number) => {
    const preview = v.images?.[0];
    if (!preview) return null;

    return (
      <button
        key={v._key ?? idx}
        onClick={() => setSelectedVariantIndex(idx)}
        className={`w-16 h-16 border rounded overflow-hidden ${
          idx === selectedVariantIndex ? "ring-2 ring-tech_orange" : ""
        }`}
      >
        <Image
          src={urlFor(preview).url()}
          alt={v.colorName ?? v.color ?? `Variant ${idx + 1}`}
          width={64}
          height={64}
          className="object-contain w-full h-full"
        />
      </button>
    );
  })}
</div>

              </div>
            )}

            {/* Add to Cart + Buy Now */}
            <div className="flex items-center gap-3 w-1/2">
              <AddToCartButton
                key={itemKey}
                product={product}
                variant={selectedVariant}
              />
              <button className="w-36 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition">
                BUY NOW
              </button>
            </div>

         
          </div>
        </div>
      </Container>
    </div>
  );
}
