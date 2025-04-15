"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search, X, ChevronLeft, ShoppingCart } from "lucide-react";
import Container from "@/components/Container";
import Title from "@/components/Title";
import PriceFormatter from "@/components/PriceFormatter";
import toast from "react-hot-toast";
import useCartStore from "@/store";
import ProductBrand from "@/components/ProductBrand";

const ComparePage = () => {
  const { addItem } = useCartStore();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<(Product | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [loading, setLoading] = useState(true);

  // Search states for each column
  const [searches, setSearches] = useState<string[]>(["", "", "", ""]);
  const [searchResults, setSearchResults] = useState<Product[][]>([
    [],
    [],
    [],
    [],
  ]);
  const [loadingSearches, setLoadingSearches] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [showResults, setShowResults] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const searchRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Fetch products based on URL params
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const product1Slug = searchParams.get("product1");
        const product2Slug = searchParams.get("product2");

        const newProducts = [...products];

        if (product1Slug) {
          const query = `*[_type == "product" && slug.current == $slug][0]`;
          const product1 = await client.fetch(query, { slug: product1Slug });
          newProducts[0] = product1;
          setSearches((prev) => {
            const newSearches = [...prev];
            newSearches[0] = product1?.name || "";
            return newSearches;
          });
        }

        if (product2Slug) {
          const query = `*[_type == "product" && slug.current == $slug][0]`;
          const product2 = await client.fetch(query, { slug: product2Slug });
          newProducts[1] = product2;
          setSearches((prev) => {
            const newSearches = [...prev];
            newSearches[1] = product2?.name || "";
            return newSearches;
          });
        }

        setProducts(newProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Handle search for each column
  const handleSearch = useCallback(
    async (index: number, searchTerm: string) => {
      if (!searchTerm) {
        setSearchResults((prev) => {
          const newResults = [...prev];
          newResults[index] = [];
          return newResults;
        });
        return;
      }

      setLoadingSearches((prev) => {
        const newLoading = [...prev];
        newLoading[index] = true;
        return newLoading;
      });

      try {
        const query = `*[_type == "product" && name match $search] | order(name asc)[0...10]`;
        const params = { search: `${searchTerm}*` };
        const response = await client.fetch(query, params);

        setSearchResults((prev) => {
          const newResults = [...prev];
          newResults[index] = response;
          return newResults;
        });
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setLoadingSearches((prev) => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
      }
    },
    []
  );

  // Debounce search
  useEffect(() => {
    const debounceTimers = searches.map((search, index) => {
      return setTimeout(() => {
        handleSearch(index, search);
      }, 300);
    });

    return () => {
      debounceTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [searches, handleSearch]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      searchRefs.forEach((ref, index) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setShowResults((prev) => {
            const newShow = [...prev];
            newShow[index] = false;
            return newShow;
          });
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle product selection
  const handleSelectProduct = (index: number, product: Product) => {
    setProducts((prev) => {
      const newProducts = [...prev];
      newProducts[index] = product;
      return newProducts;
    });

    setSearches((prev) => {
      const newSearches = [...prev];
      newSearches[index] = product.name as string;
      return newSearches;
    });

    setShowResults((prev) => {
      const newShow = [...prev];
      newShow[index] = false;
      return newShow;
    });

    // Update URL with new product slugs
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (index === 0) params.set("product1", product.slug?.current || "");
    if (index === 1) params.set("product2", product.slug?.current || "");
    if (index === 2) params.set("product3", product.slug?.current || "");
    if (index === 3) params.set("product4", product.slug?.current || "");

    window.history.pushState({}, "", `${url.pathname}?${params.toString()}`);
  };

  // Clear product from a column
  const clearProduct = (index: number) => {
    setProducts((prev) => {
      const newProducts = [...prev];
      newProducts[index] = null;
      return newProducts;
    });

    setSearches((prev) => {
      const newSearches = [...prev];
      newSearches[index] = "";
      return newSearches;
    });

    // Update URL by removing the product
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (index === 0) params.delete("product1");
    if (index === 1) params.delete("product2");
    if (index === 2) params.delete("product3");
    if (index === 3) params.delete("product4");

    window.history.pushState({}, "", `${url.pathname}?${params.toString()}`);
  };

  // Add to cart handler
  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-tech_orange" />
        <span className="ml-2">Loading comparison...</span>
      </div>
    );
  }

  return (
    <div className="bg-tech_bg_color py-8">
      <Container>
        <div className="flex flex-col gap-1 mb-6">
          <Link
            href="/"
            className="flex items-center text-tech_blue hover:text-tech_orange transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="ml-1">Back to Home</span>
          </Link>
          <Title className="ml-4 text-xl md:text-2xl">Product Comparison</Title>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Product comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {/* Search inputs */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">Product</td>
                  {[0, 1, 2, 3].map((index) => (
                    <td key={`search-${index}`} className="p-4 border-l">
                      <div ref={searchRefs[index]} className="relative">
                        <div className="w-full bg-gray-50 px-3 py-2 rounded-md flex items-center justify-between">
                          <input
                            placeholder="Search product"
                            className="flex-1 outline-0 text-sm bg-transparent mr-2"
                            value={searches[index]}
                            onChange={(e) => {
                              setSearches((prev) => {
                                const newSearches = [...prev];
                                newSearches[index] = e.target.value;
                                return newSearches;
                              });
                            }}
                            onFocus={() => {
                              setShowResults((prev) => {
                                const newShow = [...prev];
                                newShow[index] = true;
                                return newShow;
                              });
                            }}
                          />
                          {searches[index] ? (
                            <X
                              size={16}
                              className="cursor-pointer text-gray-500 hover:text-tech_orange"
                              onClick={() => clearProduct(index)}
                            />
                          ) : (
                            <Search size={18} className="text-gray-400" />
                          )}
                        </div>

                        {/* Search results dropdown */}
                        {showResults[index] && (
                          <div className="absolute z-10 left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto border border-gray-200">
                            {loadingSearches[index] ? (
                              <div className="flex items-center justify-center p-2">
                                <Loader2
                                  size={16}
                                  className="animate-spin text-tech_orange"
                                />
                                <span className="ml-2 text-sm">
                                  Searching...
                                </span>
                              </div>
                            ) : searchResults[index].length > 0 ? (
                              <div>
                                {searchResults[index].map((product) => (
                                  <div
                                    key={product._id}
                                    onClick={() =>
                                      handleSelectProduct(index, product)
                                    }
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  >
                                    <p className="text-sm font-medium line-clamp-1">
                                      {product.name}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : searches[index] ? (
                              <div className="p-3 text-sm text-gray-500">
                                No products found
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Product images */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">Image</td>
                  {products.map((product, index) => (
                    <td
                      key={`img-${index}`}
                      className="p-4 text-center border-l"
                    >
                      {product?.images ? (
                        <Link href={`/product/${product.slug?.current}`}>
                          <div className="relative h-40 w-40 mx-auto">
                            <Image
                              src={urlFor(product.images[0]).url()}
                              alt={product.name || "Product image"}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </Link>
                      ) : (
                        <div className="h-40 w-40 mx-auto bg-gray-100 flex items-center justify-center text-gray-400">
                          No product selected
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Product name */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">Name</td>
                  {products.map((product, index) => (
                    <td key={`name-${index}`} className="p-4 border-l">
                      {product ? (
                        <Link
                          href={`/product/${product.slug?.current}`}
                          className="font-medium text-tech_blue hover:text-tech_orange"
                        >
                          {product.name}
                        </Link>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Price */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">Price</td>
                  {products.map((product, index) => (
                    <td key={`price-${index}`} className="p-4 border-l">
                      {product ? (
                        <div className="font-semibold text-tech_orange">
                          <PriceFormatter amount={product?.price} />
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Brand */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">Brand</td>
                  {products.map((product, index) => (
                    <td key={`brand-${index}`} className="p-4 border-l">
                      {product?.brand ? (
                        <ProductBrand slug={product?.slug?.current} />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Availability */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">Availability</td>
                  {products.map((product, index) => (
                    <td key={`stock-${index}`} className="p-4 border-l">
                      {product ? (
                        <span
                          className={
                            product.stock ? "text-green-600" : "text-red-600"
                          }
                        >
                          {product.stock ? "In Stock" : "Out of Stock"}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Description */}
                <tr className="border-b">
                  <td className="p-4 bg-gray-50 font-medium">Description</td>
                  {products.map((product, index) => (
                    <td key={`desc-${index}`} className="p-4 border-l">
                      {product?.description ? (
                        <p className="text-sm">{product.description}</p>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-4 bg-gray-50 font-medium">Actions</td>
                  {products.map((product, index) => (
                    <td key={`action-${index}`} className="p-4 border-l">
                      {product ? (
                        <div className="space-y-2">
                          <Link
                            href={`/product/${product.slug?.current}`}
                            className="block w-full py-2 px-4 bg-tech_blue text-white text-center rounded hover:bg-tech_blue/90 transition-colors"
                          >
                            View Details
                          </Link>
                          <button
                            className="w-full py-2 px-4 bg-tech_orange text-white text-center rounded hover:bg-tech_orange/90 transition-colors flex items-center justify-center"
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.stock}
                          >
                            <ShoppingCart size={16} className="mr-2" />
                            Add to Cart
                          </button>
                          <button
                            className="w-full py-2 px-4 border border-tech_orange text-tech_orange rounded hover:bg-tech_orange hover:text-white transition-colors"
                            onClick={() => clearProduct(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ComparePage;
