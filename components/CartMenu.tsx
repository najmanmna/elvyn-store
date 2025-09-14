"use client";

import React from "react";

import Link from "next/link";
import useCartStore from "@/store";
import { BsHandbag } from "react-icons/bs";
import { motion } from "framer-motion";

const CartMenu = () => {
  const { items } = useCartStore();
  const cartCount = items.length;

  return (
    <motion.div
      className="relative z-50"
      whileHover={{
        scale: 1.15, // subtle grow
        boxShadow: "0 0 12px rgba(255,255,255,0.35)", // soft glow ring
      }}
    >
      <Link href="/cart">
        <div className=" text-black p-3   hoverEffect relative">
          <BsHandbag size={29} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-tech_dark text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default CartMenu;
