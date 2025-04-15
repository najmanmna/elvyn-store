"use client";

import useCartStore from "@/store";
import { useState } from "react";
import PriceFormatter from "./PriceFormatter";
import { Button } from "./ui/button";
import AddToCartButton from "./AddToCartButton";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Container from "./Container";
import { Heart, X } from "lucide-react";
import toast from "react-hot-toast";
import Title from "./Title";

const WishlistProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useCartStore();

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
  };

  const handleResetFavorite = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all products from wishlist?"
    );
    if (confirmed) {
      resetFavorite();
      toast.success("All products removed from wishlist");
    }
  };

  return (
    <Container className="bg-tech_white m-5 rounded-md py-5">
      <div className="mb-2">
        <Title>My Wishlist</Title>
      </div>
      {favoriteProduct.length > 0 ? (
        <>
          {/* Desktop and Tablet View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b">
                <tr className="bg-amazonLight/10 rounded-md">
                  <th className="p-2 text-left bg-tech_bg_color border-r-2 border-r-tech_white">
                    Image
                  </th>
                  <th className="p-2 text-left hidden md:table-cell bg-tech_bg_color border-r-2 border-r-tech_white">
                    Category
                  </th>
                  <th className="p-2 text-left hidden md:table-cell bg-tech_bg_color border-r-2 border-r-tech_white">
                    Type
                  </th>
                  <th className="p-2 text-left hidden md:table-cell bg-tech_bg_color border-r-2 border-r-tech_white">
                    Status
                  </th>
                  <th className="p-2 text-left bg-tech_bg_color border-r-2 border-r-tech_white">
                    Price
                  </th>
                  <th className="p-2 text-center md:text-left bg-tech_bg_color border-r-2 border-r-tech_white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {favoriteProduct
                  ?.slice(0, visibleProducts)
                  .map((product: Product) => (
                    <tr key={product._id} className="border-b">
                      <td className="py-4 flex items-center gap-2">
                        <X
                          onClick={() => {
                            removeFromFavorite(product._id);
                            toast.success("Product removed from wishlist");
                          }}
                          size={18}
                          className="hover:text-tech_orange hoverEffect cursor-pointer"
                        />
                        {product?.images && (
                          <Link
                            href={{
                              pathname: `/product/${product?.slug?.current}`,
                              query: { id: product?._id },
                            }}
                            className="border rounded-md group hidden sm:inline-flex"
                          >
                            <Image
                              src={urlFor(product.images[0]).url()}
                              alt="productImage"
                              width={80}
                              height={80}
                              className={`rounded-md group-hover:scale-105 hoverEffect h-20 w-20 object-contain ${product?.stock === 0 ? "opacity-50" : ""}`}
                            />
                          </Link>
                        )}
                        <p className="line-clamp-1">{product?.name}</p>
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {product?.categories && (
                          <p className="uppercase line-clamp-1 text-xs font-medium">
                            {product.categories.map((cat) => cat).join(", ")}
                          </p>
                        )}
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {product?.variant}
                      </td>

                      <td
                        className={`p-2 w-24 ${
                          (product?.stock as number) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-medium text-sm hidden md:table-cell`}
                      >
                        {(product?.stock as number) > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </td>
                      <td className="p-2">
                        <PriceFormatter amount={product?.price} />
                      </td>
                      <td className="p-2">
                        <AddToCartButton product={product} className="w-full" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="sm:hidden space-y-4">
            {favoriteProduct
              ?.slice(0, visibleProducts)
              .map((product: Product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-sm p-4 border"
                >
                  <div className="flex justify-between items-start mb-3">
                    <Link
                      href={{
                        pathname: `/product/${product?.slug?.current}`,
                        query: { id: product?._id },
                      }}
                      className="flex-1"
                    >
                      <h3 className="font-medium line-clamp-2">
                        {product?.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => {
                        removeFromFavorite(product._id);
                        toast.success("Product removed from wishlist");
                      }}
                      className="ml-2"
                    >
                      <X
                        size={18}
                        className="text-gray-500 hover:text-tech_orange hoverEffect"
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {product?.images && (
                      <Link
                        href={{
                          pathname: `/product/${product?.slug?.current}`,
                          query: { id: product?._id },
                        }}
                        className="border rounded-md flex-shrink-0"
                      >
                        <Image
                          src={urlFor(product.images[0]).url()}
                          alt="productImage"
                          width={70}
                          height={70}
                          className={`rounded-md h-[70px] w-[70px] object-contain ${
                            product?.stock === 0 ? "opacity-50" : ""
                          }`}
                        />
                      </Link>
                    )}
                    <div className="flex-1">
                      {product?.categories && (
                        <p className="uppercase text-xs text-gray-500 mb-1">
                          {product.categories.map((cat) => cat).join(", ")}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mb-1">
                        Type:{" "}
                        <span className="capitalize">
                          {product?.variant || "N/A"}
                        </span>
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          (product?.stock as number) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {(product?.stock as number) > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <div className="font-medium">
                      <PriceFormatter amount={product?.price} />
                    </div>
                    <AddToCartButton product={product} className="w-auto" />
                  </div>
                </div>
              ))}
          </div>

          {/* Load More/Less Buttons */}
          <div className="mt-8 flex flex-wrap  gap-4">
            {visibleProducts < favoriteProduct.length && (
              <Button onClick={loadMore} variant="outline" size="sm">
                Load More
              </Button>
            )}
            {visibleProducts > 10 && (
              <Button
                onClick={() => setVisibleProducts(10)}
                variant="outline"
                size="sm"
              >
                Load Less
              </Button>
            )}
            {favoriteProduct.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFavorite}
                className="border-tech_orange/50 text-tech_dark_color hover:text-tech_orange hover:border-tech_orange hover:bg-tech_orange/10"
              >
                Reset Wishlist
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20" />
            <Heart
              className="h-12 w-12 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-muted-foreground">
              Items added to your wishlist will appear here
            </p>
          </div>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishlistProducts;
