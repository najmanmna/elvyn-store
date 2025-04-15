import React from "react";
import { Button } from "./ui/button";
import { HiMinus, HiPlus } from "react-icons/hi2";
import toast from "react-hot-toast";
import useCartStore from "@/store";
import { Product } from "@/sanity.types";
import { twMerge } from "tailwind-merge";

interface Props {
  product: Product;
  className?: string;
  borderStyle?: string;
}

const QuantityButtons = ({ product, className, borderStyle }: Props) => {
  const { addItem, removeItem, getItemCount } = useCartStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  const handleRemoveProduct = () => {
    removeItem(product?._id);
    if (itemCount > 1) {
      toast.success("Quantity Decreased successfully!");
    } else {
      toast.success(`${product?.name?.substring(0, 12)} removed successfully!`);
    }
  };

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success("Quantity Increased successfully!");
    } else {
      toast.error("Can not add more than available stock");
    }
  };
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
        className="w-6 h-6 border-0 hover:bg-tech_orange/20 hover:cursor-pointer"
        onClick={handleRemoveProduct}
        disabled={itemCount === 0 || isOutOfStock}
      >
        <HiMinus />
      </Button>
      <span className="font-semibold text-sm w-6 text-center text-tech_dark">
        {itemCount}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="w-6 h-6 border-0 hover:bg-tech_orange/20 hover:cursor-pointer"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        <HiPlus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
