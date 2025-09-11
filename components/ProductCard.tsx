import { Product } from "@/sanity.types";
import React, { useState } from "react";
import PriceView from "./PriceView";
import Link from "next/link";
import Title from "./Title";
import { image } from "@/sanity/image";

const ProductCard = ({ product }: { product: Product }) => {
  // ✅ Collect first image from each variant
  const variantImages =
    product?.variants?.map((v) => v?.images?.[0]).filter(Boolean) || [];

  // ✅ Calculate total stock across all variants
  const totalStock =
    product?.variants?.reduce((acc, v) => acc + (v?.stock || 0), 0) || 0;

  // ✅ Track hover state
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bg-tech_white rounded-md group overflow-hidden text-sm relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image */}
      <div className="relative w-full">
        <Link href={`/product/${product?.slug?.current}`}>
          {variantImages.length > 0 && (
            <img
              src={
                hovered && variantImages[1]
                  ? image(variantImages[1]).size(800, 900).url()
                  : image(variantImages[0]).size(800, 900).url()
              }
              alt={product?.name || "productImage"}
              loading="lazy"
              className={`w-full h-auto max-h-80 object-contain bg-tech_white transition-all duration-500
                ${totalStock > 0 ? "group-hover:scale-105" : "opacity-50"}`}
            />
          )}
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col items-center text-center gap-1">
        <Title className="text-base font-normal line-clamp-2">
          {product?.name}
        </Title>

        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />

        <p
          className={`text-sm ${
            totalStock === 0
              ? "text-red-600 font-semibold"
              : "text-tech_orange/80 font-medium"
          }`}
        >
          {totalStock === 0 ? "OUT OF STOCK" : ""}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
