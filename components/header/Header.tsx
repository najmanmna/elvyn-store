import React from "react";
import Container from "../Container";
import Logo from "../LogoBlack";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import CartMenu from "../CartMenu";

const Header = async () => {
  return (
    <header className="sticky top-0 z-50 bg-tech_bg_color text-tech_black backdrop-blur-md shadow-md">
      <div className="relative flex items-center justify-between py-6 px-2 sm:px-10 sm:mr-2">
        {/* Left - Menu */}
        <div className="flex items-center">
          <MobileMenu />
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 top-13.5 transform -translate-x-1/2 -translate-y-1/2">
          <Logo />
        </div>

        {/* Right - Cart only (Search hidden on mobile) */}
        <div className="flex items-center sm:gap-4">
          <div className="hidden md:block">
            <SearchBar />
          </div>
          <CartMenu />
        </div>
      </div>

      {/* Mobile Search below header */}
      <div className="block md:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
