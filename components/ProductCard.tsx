import { Product } from "@/sanity.types";
import React from "react";
import PriceView from "./PriceView";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import Title from "./Title";
import { image } from "@/sanity/image";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="text-sm rounded-md group bg-tech_white">
      <div className="relative group overflow-hidden">
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <img
              src={image(product.images[0]).size(900, 780).url()}
              className={`w-full h-64 object-contain bg-tech_white rounded-md overflow-hidden transition-transform duration-500 
                ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
              alt="productImage"
              loading="lazy"
            />
          </Link>
        )}
        {(product?.discount as number) > 0 && (
          <p className="absolute top-2 left-0 z-10 text-xs border border-l-0 bg-tech_purpel text-tech_white font-semibold border-tech_dark_color/50 rounded-r-full px-2 ">
            Save: $
            {Math.round(
              (product.price as number) * ((product.discount as number) / 100)
            )}{" "}
            {`(-${product.discount}%)`}
          </p>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-tech_dark/60">
            {product.categories.map((cat) => cat).join(", ")}
          </p>
        )}
        <Title className="text-base font-semibold line-clamp-2 h-12">
          {product?.name}
        </Title>

        <div className="flex items-center gap-2.5">
          <p className="font-medium">In Stock</p>
          <p
            className={`${product?.stock === 0 ? "text-red-600" : "text-tech_orange/80 font-semibold"}`}
          >
            {(product?.stock as number) > 0 ? product?.stock : "unavailable"}
          </p>
        </div>

        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />
        <AddToCartButton product={product} className="w-36 rounded-full" />
      </div>
    </div>
  );
};

export default ProductCard;
