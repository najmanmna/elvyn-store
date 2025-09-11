"use client";
import { Loader2, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { client } from "@/sanity/lib/client";
import { Input } from "../ui/input";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFeaturedProducts = async () => {
    try {
      const query = `*[_type == "product" && isFeatured == true] | order(name asc)`;
      const response = await client.fetch(query);
      setFeaturedProduct(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!search) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const query = `*[_type == "product" && name match $search] | order(name asc)`;
      const params = { search: `${search}*` };
      const response = await client.fetch(query, params);
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [search, fetchProducts]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearch && inputRef.current) inputRef.current.focus();
  }, [showSearch]);

  return (
    <div ref={searchRef} className="relative">
      {/* Desktop icon toggle */}
      <div className="hidden lg:block relative w-40 h-10 lg:w-[340px]">
        {!showSearch && (
          <button
            type="button"
            onClick={() => {
              setShowSearch(true);
              setShowResults(true);
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center"
          >
            <Search className="w-6 h-6 text-black hover:text-gray" />
          </button>
        )}
        {showSearch && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="absolute inset-0 flex items-center"
          >
            <Input
              ref={inputRef}
              placeholder="Search..."
              className="flex-1 h-10 rounded-md focus-visible:ring-0 focus-visible:border-tech_orange bg-tech_white text-tech_dark pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowResults(true)}
            />
            <button
              type="button"
              onClick={() => {
                setShowResults(false);
                setShowSearch(false);
                setSearch("");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-tech_black hover:text-tech_orange cursor-pointer" />
            </button>
          </form>
        )}
      </div>

      {/* Mobile: always show full width input below header */}
      <div className="block lg:hidden mt-2">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center w-full"
        >
          <Input
            ref={inputRef}
            placeholder="Search..."
            className="flex-1 h-10 rounded-md focus-visible:ring-0 focus-visible:border-tech_orange bg-tech_white text-tech_dark pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowResults(true)}
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setShowResults(false);
                setSearch("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-tech_black hover:text-tech_orange cursor-pointer" />
            </button>
          )}
        </form>
      </div>

      {/* Results dropdown */}
      {showResults && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-tech_white rounded-md shadow-lg z-50 max-h-[70vh] overflow-y-auto border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center px-6 gap-2 py-4">
              <Loader2 className="w-5 h-5 animate-spin text-tech_orange" />
              <span className="font-medium text-gray-600">Searching...</span>
            </div>
          ) : products?.length > 0 ? (
            <div className="py-2">
              {products.map((product) => (
                <Link
                  key={product?._id}
                  href={`/product/${product?.slug?.current}`}
                  onClick={() => {
                    setShowResults(false);
                    setSearch("");
                  }}
                  className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                >
                  {product?.images && (
                    <div className="w-12 h-12 bg-gray-50 rounded overflow-hidden">
                      <Image
                        width={48}
                        height={48}
                        src={urlFor(product?.images[0]).url()}
                        alt="product"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                      {product.name}
                    </h3>
                    {product.price && (
                      <p className="text-sm font-semibold text-tech_orange mt-0.5">
                        ${product.price}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3">
              {search ? (
                <p className="text-sm font-medium text-gray-700">
                  No results for "<span className="text-tech_orange">{search}</span>"
                </p>
              ) : (
                <p className="text-sm font-medium text-gray-700">Popular Products</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
