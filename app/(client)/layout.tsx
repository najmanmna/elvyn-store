import Header from "@/components/header/Header";
import Footer from "@/components/common/Footer";
import "../globals.css";
import CartMenu from "@/components/CartMenu";
import LinkBadge from "@/components/common/LinkBadge";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <LinkBadge />
      {children}
      <CartMenu />
      <Footer />
    </>
  );
}
