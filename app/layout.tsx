import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "react-hot-toast";

import "./globals.css";

// Import Google Font (Poppins) with multiple weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // adjust weights as needed
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s - Elvyn",
    default: "Elvyn",
  },
  description: "Elvyn online store, Your one stop shop for all your needs",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased bg-tech_bg_color`}>
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
  );
};

export default RootLayout;
