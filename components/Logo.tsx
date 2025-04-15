import { logo } from "@/images";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  className?: string;
}

const Logo = ({ className }: Props) => {
  return (
    <Link href={"/"} className="w-42">
      <Image src={logo} alt="logo" className={cn("w-full", className)} />
    </Link>
  );
};

export default Logo;
