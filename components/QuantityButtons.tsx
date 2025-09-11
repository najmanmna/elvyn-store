"use client";
import React from "react";
import { Button } from "./ui/button";
import { HiMinus, HiPlus } from "react-icons/hi2";
import toast from "react-hot-toast";
import useCartStore from "@/store";
import { Product } from "@/sanity.types";
import { twMerge } from "tailwind-merge";

interface Props {
  product: Product;
  itemKey: string; // 🔑 unique identifier passed from AddToCartButton / CartPage
  className?: string;
  borderStyle?: string;
  variant?: { id: string; color?: string; stock?: number; images?: any[] }; // ✅ normalized
  displayMode?: "default" | "overlay";
}


const QuantityButtons = ({
  product,
  itemKey,
  className,
  borderStyle,
  variant,
  displayMode = "default",
}: Props) => {
  const { addItem, removeItem, getItemCount } = useCartStore();

  const itemCount = getItemCount(itemKey);
  const stockAvailable = variant ? variant.stock ?? 0 : product.stock ?? 0;
  const isOutOfStock = stockAvailable === 0;

  const handleRemoveProduct = () => {
    removeItem(itemKey);
    if (itemCount > 1) {
      toast.success("Quantity decreased successfully!");
    } else {
      toast.success(
        `${product?.name?.substring(0, 12)}${
          product?.name && product.name.length > 12 ? "..." : ""
        } ${variant?.color ? `(${variant.color})` : ""} removed!`
      );
    }
  };

  const handleAddToCart = () => {
    if (stockAvailable > itemCount) {
      addItem(
        product,
        variant ? { id: variant.id, color: variant.color } : undefined
      );
      toast.success("Quantity increased successfully!");
    } else {
      toast.error("Cannot add more than available stock");
    }
  };

  // 🎨 styling based on displayMode
  const buttonClasses =
    displayMode === "overlay"
      ? "w-6 h-6 border-0 bg-black text-white hover:bg-black/80 hover:cursor-pointer"
      : "w-6 h-6 border-0 hover:bg-tech_orange/20 hover:cursor-pointer";

  const countClasses =
    displayMode === "overlay"
      ? "font-semibold text-sm w-6 text-center text-white"
      : "font-semibold text-sm w-6 text-center text-tech_dark";

  return (
    <div
      className={twMerge(
        "flex items-center gap-1 pb-1 text-base",
        borderStyle,
        className
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className={buttonClasses}
        onClick={handleRemoveProduct}
        disabled={itemCount === 0 || isOutOfStock}
      >
        <HiMinus />
      </Button>
      <span className={countClasses}>{itemCount}</span>
      <Button
        variant="outline"
        size="icon"
        className={buttonClasses}
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        <HiPlus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
