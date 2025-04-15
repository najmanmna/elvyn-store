"use client";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import useCartStore from "@/store";
import QuantityButtons from "./QuantityButtons";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useCartStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success(
        `${product?.name?.substring(0, 12)}... added successfully!`
      );
    } else {
      toast.error("Can not add more than available stock");
    }
  };
  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-tech_dark/80">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product.price * itemCount : 0}
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
