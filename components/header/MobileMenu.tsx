"use client";

import { AlignLeft } from "lucide-react";
import { useState, useEffect } from "react";
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
    return () => {
      mounted = false;
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);

  return (
    <>
      <button onClick={toggleSidebar}>
        <AlignLeft className="w-8 h-8 hover:text-tech_orange hoverEffect" />
      </button>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories ?? undefined}
      />
    </>
  );
};

export default MobileMenu;
