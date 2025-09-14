"use client";

import { AlignLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import { client } from "@/sanity/lib/client";
import type { Category } from "@/sanity.types";

const CATEGORY_QUERY = `*[_type == "category"]{
  _id,
  title,
  slug,
  image
} | order(title asc)`;

const MobileMenu: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await client.fetch(CATEGORY_QUERY);
        if (mounted) setCategories(data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCategories();
    return () => { mounted = false; };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);

  return (
    <>
      <motion.button
        onClick={toggleSidebar}
        whileHover={{
          scale: 1.15,                        // subtle grow
          boxShadow: "0 0 12px rgba(255,255,255,0.35)", // soft glow ring
          transition: { type: "spring", stiffness: 300, damping: 15 },
        }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full focus:outline-none
                   bg-transparent text-black hover:drop-shadow-md
                   hover:text-nuetral-500 transition-colors duration-300"
      >
        <AlignLeft className="w-8 h-8 sm:w-10 sm:h-10" />
      </motion.button>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories ?? undefined}
      />
    </>
  );
};

export default MobileMenu;
