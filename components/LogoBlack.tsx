import { logo_black } from "@/images";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  className?: string;
}

const Logo = ({ className }: Props) => {
  return (
    <Link href={"/"} className="w-40">
      <Image src={logo_black} alt="logo" className={cn("w-40", className)} />
    </Link>
  );
};

export default Logo;
