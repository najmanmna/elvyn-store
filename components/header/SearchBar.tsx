"use client";
import { Loader2, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { client } from "@/sanity/lib/client";
import { Input } from "../ui/input";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

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

  // Fetch products from Sanity based on search input
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

  // Debounce input changes to reduce API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300); // Delay of 300ms

    return () => clearTimeout(debounceTimer); // Cleanup the timer
  }, [search, fetchProducts]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus the mobile input when search bar is shown
  useEffect(() => {
    if (showSearch && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [showSearch]);

  const toggleMobileSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      // Reset search when opening
      setSearch("");
      // Show results immediately when opening search
      setShowResults(true);
    }
  };

  return (
    <div ref={searchRef} className="relative lg:w-full">
      {/* Desktop search */}
      <button onClick={toggleMobileSearch} className="lg:hidden mt-1.5">
        {showSearch ? (
          <X className="w-5 h-5 text-white hover:text-tech_orange hoverEffect" />
        ) : (
          <Search className="w-5 h-5 text-white hover:text-tech_orange hoverEffect" />
        )}
      </button>
      <form
        className="relative hidden lg:flex items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          placeholder="Search..."
          className="flex-1 rounded-md py-5 focus-visible:ring-0 focus-visible:border-tech_orange bg-tech_white text-tech_dark placeholder:font-semibold placeholder:tracking-wide pr-16"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
        {search ? (
          <X
            onClick={() => setSearch("")}
            className="w-5 h-5 absolute right-3 top-2.5 text-tech_black hover:text-tech_orange hoverEffect cursor-pointer"
          />
        ) : (
          <Search className="absolute right-3 top-3 w-5 h-5 text-tech_black" />
        )}
      </form>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed lg:hidden left-0 top-16 w-full px-1 py-1 md:px-5 md:py-2 bg-tech_white"
          >
            <div className="bg-tech_bg_color p-4 shadow-lg rounded-md">
              <div className="relative flex items-center">
                <Input
                  ref={mobileInputRef}
                  placeholder="Search products..."
                  className="w-full pr-16 py-5 rounded-md focus-visible:ring-0 focus-visible:border-tech_orange bg-tech_white text-tech_dark placeholder:font-semibold"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setShowResults(true)}
                />
                {search ? (
                  <X
                    onClick={() => setSearch("")}
                    className="absolute right-4 w-5 h-5 text-tech_black hover:text-tech_orange hoverEffect cursor-pointer"
                  />
                ) : (
                  <Search className="absolute right-4 w-5 h-5 text-tech_black" />
                )}
              </div>

              {/* Mobile search results - directly below the search input */}
              {showResults && (
                <div className="mt-2 bg-tech_white rounded-md shadow-lg overflow-y-auto border border-gray-200 max-h-[50vh]">
                  {loading ? (
                    <div className="flex items-center justify-center px-6 gap-2 py-4 text-center">
                      <Loader2 className="w-5 h-5 animate-spin text-tech_orange" />
                      <span className="font-medium text-gray-600">
                        Searching...
                      </span>
                    </div>
                  ) : products?.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-700">
                          Search Results ({products.length})
                        </p>
                      </div>
                      {products.map((product: Product) => (
                        <div
                          key={product?._id}
                          onClick={() => {
                            setShowResults(false);
                            setSearch("");
                            setShowSearch(false);
                          }}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 px-4 py-3 cursor-pointer"
                        >
                          <Link
                            href={`/product/${product?.slug?.current}`}
                            className="flex items-center gap-3"
                          >
                            {product?.images && (
                              <div className="w-12 h-12 bg-gray-50 rounded flex-shrink-0 overflow-hidden">
                                <Image
                                  width={48}
                                  height={48}
                                  src={urlFor(product?.images[0]).url()}
                                  alt={"productImage"}
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
                        </div>
                      ))}
                      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                        <Link
                          href={`/shop?search=${search}`}
                          onClick={() => {
                            setShowResults(false);
                            setShowSearch(false);
                          }}
                          className="text-sm text-tech_orange font-medium hover:underline"
                        >
                          View all results
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        {!search ? (
                          <p className="text-sm font-medium text-gray-700">
                            Popular Products
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-gray-700">
                            No results for &quot;
                            <span className="text-tech_orange">{search}</span>
                            &quot;
                          </p>
                        )}
                      </div>

                      {/* Featured products section */}
                      <div>
                        {featuredProduct?.length > 0 &&
                          featuredProduct?.map((item: Product) => (
                            <div
                              key={item?._id}
                              className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                            >
                              <button
                                onClick={() => {
                                  setSearch(item?.name as string);
                                  setShowResults(true);
                                }}
                                className="flex items-center gap-3 w-full text-left px-4 py-3 hover:cursor-pointer"
                              >
                                <Search className="text-tech_black w-5 h-5" />
                                <div>
                                  <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                                    {item?.name}
                                  </h3>
                                </div>
                              </button>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop search results dropdown */}
      {showResults && !showSearch && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-tech_white rounded-md shadow-lg z-50 max-h-[70vh] overflow-y-auto border border-gray-200 lg:block hidden">
          {loading ? (
            <div className="flex items-center justify-center px-6 gap-2 py-4 text-center">
              <Loader2 className="w-5 h-5 animate-spin text-tech_orange" />
              <span className="font-medium text-gray-600">Searching...</span>
            </div>
          ) : products?.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-700">
                  Search Results ({products.length})
                </p>
              </div>
              {products.map((product: Product) => (
                <div
                  key={product?._id}
                  onClick={() => {
                    setShowResults(false);
                    setSearch("");
                  }}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 px-4 py-3"
                >
                  <Link
                    href={`/product/${product?.slug?.current}`}
                    className="flex items-center gap-3"
                  >
                    {product?.images && (
                      <div className="w-12 h-12 bg-gray-50 rounded flex-shrink-0 overflow-hidden">
                        <Image
                          width={48}
                          height={48}
                          src={urlFor(product?.images[0]).url()}
                          alt={"productImage"}
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
                </div>
              ))}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <Link
                  href={`/shop?search=${search}`}
                  onClick={() => {
                    setShowResults(false);
                  }}
                  className="text-sm text-tech_orange font-medium hover:underline"
                >
                  View all results
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                {!search ? (
                  <p className="text-sm font-medium text-gray-700">
                    Popular Products
                  </p>
                ) : (
                  <p className="text-sm font-medium text-gray-700">
                    No results for &quot;
                    <span className="text-tech_orange">{search}</span>&quot;
                  </p>
                )}
              </div>

              {/* Featured products section */}
              <div>
                {featuredProduct?.length > 0 &&
                  featuredProduct?.map((item: Product) => (
                    <div
                      key={item?._id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                      <button
                        onClick={() => {
                          setSearch(item?.name as string);
                          setShowResults(true);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:cursor-pointer"
                      >
                        <Search className="text-tech_black w-5 h-5" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                            {item?.name}
                          </h3>
                        </div>
                      </button>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
