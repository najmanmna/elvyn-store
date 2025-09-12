"use client";
import React from "react";
import { Button } from "./ui/button";
import { HiMinus, HiPlus } from "react-icons/hi2";
import toast from "react-hot-toast";
import useCartStore from "@/store";
import type { Product } from "@/sanity.types";
import type { SanityImage } from "@/types/sanity-helpers";
import { twMerge } from "tailwind-merge";

interface VariantShape {
  id: string;
  color?: string;
  stock?: number;
  images?: SanityImage[];
}

interface Props {
  product: Product;
  itemKey?: string;
  className?: string;
  borderStyle?: string;
  variant: VariantShape; // 🔹 Required (schema enforces variant exists)
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
  // hydration flag
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    const unsub = useCartStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    setHydrated(useCartStore.persist.hasHydrated?.() ?? false);
    return () => unsub?.();
  }, []);

  // ✅ always compute key with variant
  const computedItemKey = itemKey ?? `${product._id}-${variant.id}`;

  // subscribe to cart state
  const cartItem = useCartStore((s) =>
    s.items.find((i) => i.itemKey === computedItemKey)
  );
  const itemCount = cartItem ? cartItem.quantity : 0;

  // actions
  const addItem = useCartStore((s) => s.addItem);
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);

  // ✅ stock always comes from variant
  const stockAvailable = variant.stock ?? 0;
  const isOutOfStock = stockAvailable <= 0;
  const canIncrease = itemCount < stockAvailable;

  const handleRemove = () => {
    if (itemCount <= 0) return;

    decreaseQuantity(computedItemKey);

    if (itemCount > 1) {
      toast.success("Quantity decreased successfully!");
    } else {
      toast.success(
        `${product?.name?.substring(0, 12)}${
          product?.name && product.name.length > 12 ? "..." : ""
        } (${variant?.color ?? "default"}) removed!`
      );
    }
  };

  const handleAdd = () => {
    if (!canIncrease) {
      toast.error("Cannot add more than available stock");
      return;
    }

    if (itemCount === 0) {
      // add fresh item with full variant
      addItem(product, {
        id: variant.id,
        color: variant.color,
        stock: variant.stock,
        images: variant.images,
      });
    } else {
      increaseQuantity(computedItemKey);
    }

    toast.success("Quantity increased successfully!");
  };

  // styles
  const buttonClasses =
    displayMode === "overlay"
      ? "w-6 h-6 border-0 bg-black text-white hover:bg-black/80 hover:cursor-pointer"
      : "w-6 h-6 border-0 hover:bg-tech_orange/20 hover:cursor-pointer";

  const countClasses =
    displayMode === "overlay"
      ? "font-semibold text-sm w-6 text-center text-white"
      : "font-semibold text-sm w-6 text-center text-tech_dark";

  if (!hydrated) {
    return <span className={countClasses}>0</span>;
  }

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
        className={twMerge(buttonClasses, "z-50 relative pointer-events-auto")}
        onClick={handleRemove}
        disabled={itemCount === 0 || isOutOfStock}
      >
        <HiMinus />
      </Button>

      <span className={countClasses}>{itemCount}</span>

      <Button
        variant="outline"
        size="icon"
        className={twMerge(buttonClasses, "z-50 relative pointer-events-auto")}
        onClick={handleAdd}
        disabled={isOutOfStock || !canIncrease}
      >
        <HiPlus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
