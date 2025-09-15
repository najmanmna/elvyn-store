"use client";
import Link from "next/link";
import { useEffect, useMemo } from "react";

export default function WhatsAppButton({
  product,
}: {
  product?: { name?: string; slug?: string };
}) {
  useEffect(() => {
    console.log("👉 WhatsAppButton product:", product);
  }, [product]);

  const phone = "94775507940";

  // ✅ Only build message when product is defined
  const message = useMemo(() => {
    if (product?.name && product?.slug) {
      return `Hi, I'm interested in your product: ${product.name}\nCheck it here: ${window.location.origin}/product/${product.slug}`;
    }
    return "Hi, I want to know more about your store.";
  }, [product]);

  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(
    message
  )}`;

  // ✅ Avoid rendering until we have product info (so no flash of wrong message)
  if (!product) return null;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      className="fixed bottom-2 sm:bottom-6 right-6 w-16 h-16 rounded-full bg-black
                 flex items-center justify-center text-white shadow-lg
                 hover:bg-green-600 hover:scale-110 transition-all duration-300 z-50"
    >
      <img src="/whatsapp.svg" alt="WhatsApp" className="w-8 h-8" />
    </Link>
  );
}
