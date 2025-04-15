import { Gift } from "lucide-react";
import Link from "next/link";
import React from "react";

const Offers = () => {
  return (
    <Link
      href={"/shop"}
      className="hidden lg:flex items-center gap-2.5 justify-end group"
    >
      <Gift className="text-tech_orange w-6 h-6 group-hover:text-tech_white hoverEffect" />
      <div className="flex flex-col">
        <h4 className="text-base font-bold text-tech_white">Shop</h4>
        <p className="text-xs whitespace-nowrap">Latest Offers</p>
      </div>
    </Link>
  );
};

export default Offers;
