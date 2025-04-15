import React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "react-hot-toast";

import "./globals.css";
const trebuchet = localFont({
  src: "../fonts/Trebuc.ttf",
  variable: "--font-trebuchet",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s - Shoptech online store",
    default: "Shoptech online store",
  },
  description: "Shoptech online store, Your one stop shop for all your needs",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${trebuchet.variable} antialiased bg-tech_bg_color`}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#000000",
                color: "#fff",
              },
            }}
          />
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
