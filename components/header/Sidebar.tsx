import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { motion } from "motion/react";
import Logo from "../LogoWhite";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";

import { Category } from "@/sanity.types";
import { statuses } from "@/constants";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: Category[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, categories }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-primary/50 shadow-xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform ease-in-out duration-300`}
      ref={sidebarRef}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="min-w-72 max-w-96 bg-tech_black z-50 h-screen p-10 border-r border-r-tech_white flex flex-col gap-6"
      >
        {/* Logo + Close */}
        <div className="flex items-center justify-between">
          <Logo />
          <button
            onClick={onClose}
            className="hover:text-tech_white hoverEffect"
          >
            <X />
          </button>
        </div>

        {/* Categories */}
        {categories && categories.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xl uppercase tracking-wide text-gray-200 mb-2">
              <span>Categories</span>
              <span className="text-3xl font-bold">→</span>
            </div>
            <div className="flex flex-col gap-2 pl-6">
              {categories.map((cat) => (
                <Link
                  onClick={onClose}
                  key={cat._id}
                  href={`/category/${cat.slug?.current}`}
                  className={`hover:text-white transition text-gray-300 ${
                    pathname === `/category/${cat.slug?.current}` &&
                    "text-tech_orange"
                  }`}
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Statuses */}
        <div>
    
          <div className="flex flex-col gap-2 text-xl">
            {statuses.map((status) => (
              <Link
                onClick={onClose}
                key={status.value}
                href={`/deal/status/${status.value}`}
                className={`hover:text-white transition text-gray-300 ${
                  pathname === `/deal/status/${status.value}` && "text-tech_orange"
                }`}
              >
                {status.title}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
