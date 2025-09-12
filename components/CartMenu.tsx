"use client";

import React from "react";

import Link from "next/link";
import useCartStore from "@/store";
import { BsHandbag } from "react-icons/bs";


const CartMenu = () => {
  const { items } = useCartStore();
  const cartCount = items.length;


  return (
    <div className="relative z-50">
      <Link href="/cart">
        <div className=" text-black p-3   hoverEffect relative">
          <BsHandbag size={26} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-tech_dark text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default CartMenu;
