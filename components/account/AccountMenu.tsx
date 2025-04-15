"use client";
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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

const accountsMenu = [
  { title: "Orders", icon: <IoBookmarks />, href: "/account/orders" },
  { title: "Cart", icon: <FaShoppingCart />, href: "/cart" },
  {
    title: "Edit Profile",
    icon: <FaUser />,
    href: "/account/edit",
  },
  { title: "Addresses", icon: <IoMdBookmarks />, href: "/account/addresses" },
  { title: "Wish List", icon: <FaRegHeart />, href: "/wishlist" },
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

const AccountMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/account/account") return null;

  const currentPage = accountsMenu.find((item) => item.href === pathname);

  const handleSelectChange = (value: string) => {
    router.push(value);
  };

  return (
    <div className="border-b pb-2">
      {/* Mobile and Medium screens - Select */}
      <div className="lg:hidden">
        <Select defaultValue={pathname} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full hover:cursor-pointer">
            <SelectValue placeholder="Select menu item">
              {currentPage && (
                <div className="flex items-center gap-2">
                  <span className="text-tech_orange text-lg">
                    {currentPage.icon}
                  </span>
                  <span className="text-sm font-semibold text-tech_orange">
                    {currentPage.title}
                  </span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {accountsMenu.map((item, index) => (
              <SelectItem
                key={index}
                value={item.href}
                className="hover:cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-lg",
                      item.href === pathname
                        ? "text-tech_orange"
                        : "text-tech_dark/50"
                    )}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      item.href === pathname ? "text-tech_orange" : ""
                    )}
                  >
                    {item.title}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Large screens - Original menu */}
      <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-5">
        {accountsMenu?.map((item, index) => (
          <Link
            key={index}
            href={item?.href}
            className="flex items-center gap-2 group"
          >
            <span
              className={cn(
                "text-lg hoverEffect",
                item.href === pathname
                  ? "text-tech_orange"
                  : "text-tech_dark/50 group-hover:text-tech_orange"
              )}
            >
              {item?.icon}
            </span>
            <span
              className={cn(
                "text-sm font-semibold hoverEffect",
                item.href === pathname
                  ? "text-tech_orange"
                  : "group-hover:text-tech_orange"
              )}
            >
              {item?.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountMenu;
