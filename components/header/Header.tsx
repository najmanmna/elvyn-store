import React from "react";
import Container from "../Container";
import Logo from "../Logo";

import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import Offers from "./Offers";
import Deal from "./Deal";
import Account from "./Account";
const Header = async () => {
  return (
    <header className="sticky top-0 z-50 py-5 bg-tech_dark text-tech_white/80 backdrop-blur-md">
      <Container className="flex items-center justify-between gap-5">
        <div className="flex items-center justify-start gap-2.5 md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <div className="flex items-center gap-5 lg:flex-1">
          <SearchBar />
          <Offers />
          <Deal />
          <Account />
        </div>
      </Container>
    </header>
  );
};

export default Header;
