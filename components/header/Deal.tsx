import { Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

const Deal = () => {
  return (
    <Link
      href={"/deal"}
      className="hidden lg:flex items-center gap-2.5 justify-end group"
    >
      <Zap className="text-tech_orange w-6 h-6 animate-pulse group-hover:text-tech_white hoverEffect" />
      <div className="flex flex-col">
        <h4 className="text-base font-bold text-tech_white">TV Deal</h4>
        <p className="text-xs whitespace-nowrap">Special Deals</p>
      </div>
    </Link>
  );
};

export default Deal;
