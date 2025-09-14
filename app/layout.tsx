import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

import "./globals.css";

// Import Google Font (Poppins) with multiple weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s - Elvyn",
    default: "Elvyn",
  },
  description: "Elvyn Online Store",
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased bg-tech_bg_color`}>
        {children}

        {/* Toaster */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: "#000000", color: "#fff" },
          }}
        />

        {/* Sanity Live */}
        <SanityLive />

        {/* Floating WhatsApp Button */}
        <Link
          href="https://wa.me/1234567890" // Replace with your WhatsApp number
          target="_blank"
          className="
            fixed bottom-6 right-6 w-16 h-16 rounded-full bg-black
            flex items-center justify-center text-white shadow-lg
            hover:bg-green-600 hover:scale-110 transition-all duration-300
            z-50
          "
        >
          {/* WhatsApp SVG icon */}
          <img
            src="/whatsapp.svg"
            alt="WhatsApp Business"
            className="w-8 h-8"
          />
        </Link>
      </body>
    </html>
  );
};

export default RootLayout;
