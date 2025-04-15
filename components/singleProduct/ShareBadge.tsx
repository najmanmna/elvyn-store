"use client";
import { Product } from "@/sanity.types";
import { FaPinterest } from "react-icons/fa";
import { MdAddToPhotos } from "react-icons/md";
import { RiMessengerFill, RiWhatsappFill } from "react-icons/ri";

const ShareBadge = ({ product }: { product?: Product }) => {
  const handleCompare = () => {
    if (!product?.slug) {
      alert("Please select two products to compare");
      return;
    }

    // Navigate to comparison page with selected products
    window.location.href = `/compare?product1=${product.slug?.current}`;
  };
  return (
    <div className="border border-tech_dark/10 py-3 px-6 mb-5 rounded-full flex items-center justify-between shadow-sm shadow-tech_dark_color/10">
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-semibold">Share: </p>
        <div className="flex items-center gap-1 text-base">
          <RiMessengerFill />
          <FaPinterest />
          <RiWhatsappFill />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleCompare}
          className="flex items-center gap-1.5 hover:text-tech_orange hoverEffect"
        >
          <MdAddToPhotos />{" "}
          <p className="font-semibold text-sm">Add to compare</p>
        </button>
      </div>
    </div>
  );
};

export default ShareBadge;
