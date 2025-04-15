"use client";

import React, { useState } from "react";
import { ShoppingCart, Heart, BarChart2, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "@/store";

const CartMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, favoriteProduct } = useCartStore();

  const cartCount = items.length;
  const wishlistCount = favoriteProduct.length;

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2 mb-2"
          >
            <Link href="/cart" onClick={handleClick}>
              <div className="bg-tech_dark text-white p-3 rounded-full relative shadow-lg hover:bg-tech_orange hoverEffect">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-tech_orange text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <Link href="/wishlist" onClick={handleClick}>
              <div className="bg-tech_dark text-white p-3 rounded-full relative shadow-lg hover:bg-tech_orange hoverEffect">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-tech_orange text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            <Link href="/compare" onClick={handleClick}>
              <div className="bg-tech_dark text-white p-3 rounded-full shadow-lg hover:bg-tech_orange hoverEffect">
                <BarChart2 size={20} />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-tech_orange text-white p-3 rounded-full shadow-lg hover:bg-tech_dark hoverEffect group"
      >
        {isOpen ? (
          <X size={20} />
        ) : (
          <>
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-tech_dark text-white text-xs w-5 h-5 flex items-center justify-center rounded-full group-hover:bg-tech_orange hoverEffect">
                {cartCount}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default CartMenu;
