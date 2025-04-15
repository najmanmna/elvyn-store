import React from "react";
import Link from "next/link";
import { IoBookmarks } from "react-icons/io5";
import {
  FaClipboardList,
  FaRegHeart,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import { IoMdBookmarks } from "react-icons/io";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import { MdStars } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";

const accountsMenu = [
  { title: "Orders", icon: <IoBookmarks />, href: "/account/orders" },
  { title: "Cart", icon: <FaShoppingCart />, href: "/cart" },
  {
    title: "Edit Profile",
    icon: <FaUser />,
    href: "/account/edit",
  },
  { title: "Addresses", icon: <IoMdBookmarks />, href: "/account/addresses" },
  { title: "Wish List", icon: <FaRegHeart />, href: "/account/wishlist" },
  {
    title: "Your Transactions",
    icon: <PiCurrencyDollarSimpleFill />,
    href: "/account/transactions",
  },
  { title: "Tech Points", icon: <MdStars />, href: "/account/points" },
  { title: "Quote", icon: <FaClipboardList />, href: "/account/quote" },
  { title: "Add +", icon: <FaCirclePlus />, href: "/account/add" },
  { title: "Add +", icon: <FaCirclePlus />, href: "/account/add" },
];

const AccountPage = () => {
  return (
    <div className="bg-tech_white">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {accountsMenu?.map((item, index) => (
          <Link
            href={item?.href}
            key={index}
            className="border flex flex-col gap-1 items-center justify-center p-4 md:p-10 shadow-md rounded-md hover:border-tech_blue hoverEffect"
          >
            <span className="p-3 text-lg bg-tech_blue/10 inline-block rounded-full text-tech_blue">
              {item?.icon}
            </span>
            <p className="text-xs md:text-sm font-semibold">{item?.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountPage;
