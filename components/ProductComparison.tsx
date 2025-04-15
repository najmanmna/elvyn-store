"use client";
import { Loader2, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";

const ProductComparison = () => {
  const [productOne, setProductOne] = useState<Product | null>(null);
  const [productTwo, setProductTwo] = useState<Product | null>(null);
  const [searchOne, setSearchOne] = useState("");
  const [searchTwo, setSearchTwo] = useState("");
  const [productsOne, setProductsOne] = useState<Product[]>([]);
  const [productsTwo, setProductsTwo] = useState<Product[]>([]);
  const [loadingOne, setLoadingOne] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(false);
  const [showResultsOne, setShowResultsOne] = useState(false);
  const [showResultsTwo, setShowResultsTwo] = useState(false);
  const searchRefOne = useRef<HTMLDivElement>(null);
  const searchRefTwo = useRef<HTMLDivElement>(null);

  // Fetch products for first input
  const fetchProductsOne = useCallback(async () => {
    if (!searchOne) {
      setProductsOne([]);
      return;
    }

    setLoadingOne(true);
    try {
      const query = `*[_type == "product" && name match $search] | order(name asc)[0...10]`;
      const params = { search: `${searchOne}*` };
      const response = await client.fetch(query, params);
      setProductsOne(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingOne(false);
    }
  }, [searchOne]);

  // Fetch products for second input
  const fetchProductsTwo = useCallback(async () => {
    if (!searchTwo) {
      setProductsTwo([]);
      return;
    }

    setLoadingTwo(true);
    try {
      const query = `*[_type == "product" && name match $search] | order(name asc)[0...10]`;
      const params = { search: `${searchTwo}*` };
      const response = await client.fetch(query, params);
      setProductsTwo(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingTwo(false);
    }
  }, [searchTwo]);

  // Debounce input changes for first search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProductsOne();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchOne, fetchProductsOne]);

  // Debounce input changes for second search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProductsTwo();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTwo, fetchProductsTwo]);

  // Close results when clicking outside for first input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRefOne.current &&
        !searchRefOne.current.contains(event.target as Node)
      ) {
        setShowResultsOne(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close results when clicking outside for second input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRefTwo.current &&
        !searchRefTwo.current.contains(event.target as Node)
      ) {
        setShowResultsTwo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle product selection for first input
  const handleSelectProductOne = (product: Product) => {
    setProductOne(product);
    setSearchOne(product.name as string);
    setShowResultsOne(false);
  };

  // Handle product selection for second input
  const handleSelectProductTwo = (product: Product) => {
    setProductTwo(product);
    setSearchTwo(product.name as string);
    setShowResultsTwo(false);
  };

  // Handle comparison button click
  const handleCompare = () => {
    if (!productOne || !productTwo) {
      alert("Please select two products to compare");
      return;
    }

    // Navigate to comparison page with selected products
    window.location.href = `/compare?product1=${productOne.slug?.current}&product2=${productTwo.slug?.current}`;
  };

  return (
    <div className="bg-yellow-100 rounded-md p-4 flex flex-col justify-center items-center md:h-1/2">
      <div className="text-center">
        <h3 className="text-base font-semibold">Compare Products</h3>
        <p className="text-sm">Choose Two Products to Compare</p>
      </div>
      <div className="space-y-2 w-full mt-2">
        {/* First product search */}
        <div ref={searchRefOne} className="relative w-full">
          <div className="w-full bg-white px-3 py-1.5 rounded-md flex items-center justify-between">
            <input
              placeholder="Search and Select Product"
              className="flex-1 outline-0 text-sm mr-2"
              value={searchOne}
              onChange={(e) => setSearchOne(e.target.value)}
              onFocus={() => setShowResultsOne(true)}
            />
            {searchOne ? (
              <X
                size={16}
                className="cursor-pointer text-gray-500 hover:text-tech_orange"
                onClick={() => {
                  setSearchOne("");
                  setProductOne(null);
                }}
              />
            ) : (
              <Search size={18} />
            )}
          </div>

          {/* Search results dropdown for first product */}
          {showResultsOne && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-48 overflow-y-auto border border-gray-200">
              {loadingOne ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2
                    size={16}
                    className="animate-spin text-tech_orange"
                  />
                  <span className="ml-2 text-sm">Searching...</span>
                </div>
              ) : productsOne.length > 0 ? (
                <div>
                  {productsOne.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProductOne(product)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <p className="text-sm font-medium line-clamp-1">
                        {product.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : searchOne ? (
                <div className="p-3 text-sm text-gray-500">
                  No products found
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Second product search */}
        <div ref={searchRefTwo} className="relative w-full">
          <div className="w-full bg-white px-3 py-1.5 rounded-md flex items-center justify-between">
            <input
              placeholder="Search and Select Product"
              className="flex-1 outline-0 text-sm mr-2"
              value={searchTwo}
              onChange={(e) => setSearchTwo(e.target.value)}
              onFocus={() => setShowResultsTwo(true)}
            />
            {searchTwo ? (
              <X
                size={16}
                className="cursor-pointer text-gray-500 hover:text-tech_orange"
                onClick={() => {
                  setSearchTwo("");
                  setProductTwo(null);
                }}
              />
            ) : (
              <Search size={18} />
            )}
          </div>

          {/* Search results dropdown for second product */}
          {showResultsTwo && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-48 overflow-y-auto border border-gray-200">
              {loadingTwo ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2
                    size={16}
                    className="animate-spin text-tech_orange"
                  />
                  <span className="ml-2 text-sm">Searching...</span>
                </div>
              ) : productsTwo.length > 0 ? (
                <div>
                  {productsTwo.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProductTwo(product)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <p className="text-sm font-medium line-clamp-1">
                        {product.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : searchTwo ? (
                <div className="p-3 text-sm text-gray-500">
                  No products found
                </div>
              ) : null}
            </div>
          )}
        </div>

        <button
          onClick={handleCompare}
          disabled={!productOne || !productTwo}
          className={`border rounded-sm w-full text-sm font-semibold py-1.5 transition-colors ${
            productOne && productTwo
              ? "bg-transparent border-tech_blue hover:bg-tech_blue hover:text-tech_white"
              : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          View Comparison
        </button>
      </div>
    </div>
  );
};

export default ProductComparison;
