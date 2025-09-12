"use client";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import useCartStore from "@/store";
import QuantityButtons from "./QuantityButtons";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import type { SanityImage } from "@/types/sanity-helpers";

interface VariantShape {
  id: string;
  color?: string;
  stock?: number;
  images?: SanityImage[];
}
interface Props {
  product: Product;
  className?: string;
  variant?: VariantShape;
  displayMode?: "default" | "overlay";
}

const AddToCartButton = ({
  product,
  className,
  variant,
  displayMode = "default",
}: Props) => {
  const { addItem, getItemCount } = useCartStore();

  const itemKey = variant ? `${product._id}-${variant.id}` : product._id;
  const itemCount = getItemCount(itemKey);
  const stockAvailable = variant?.stock ?? (product as any)?.stock ?? 0;
  const isOutOfStock = stockAvailable === 0;

  const handleAddToCart = () => {
    if (stockAvailable > itemCount) {
      // pass full variant so cart has images & stock as well
      addItem(
        product,
        variant
          ? {
              id: variant.id,
              color: variant.color,
              images: variant.images,
              stock: variant.stock, // ✅ add this line
            }
          : undefined
      );

      toast.success(
        `${product?.name?.substring(0, 40)}${product?.name && product.name.length > 40 ? "..." : ""} ${variant?.color ? `(${variant.color})` : ""} added!`
      );
    } else {
      toast.error("Cannot add more than available stock");
    }
  };

  const textColor =
    displayMode === "overlay" ? "text-white" : "text-tech_dark/80";
  const amountColor =
    displayMode === "overlay" ? "text-white" : "text-tech_dark";

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className={cn("text-sm w-full", textColor)}>
          <div className="flex items-center justify-between">
            <span className="text-xs">Quantity</span>
            {/* pass itemKey so QuantityButtons knows which cart item to modify */}
            <QuantityButtons
              itemKey={itemKey}
              product={product}
              variant={variant}
              displayMode={displayMode}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product.price * itemCount : 0}
              className={amountColor}
            />
          </div>
        </div>
      ) : (
        <button
          className={cn(
            "w-full py-2 px-4 bg-tech_orange text-white text-center rounded hover:bg-tech_orange/90 transition-colors flex items-center justify-center",
            className
          )}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
