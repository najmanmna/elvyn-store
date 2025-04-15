"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2 } from "lucide-react";
import Container from "./Container";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import Title from "./Title";

const ProductGrid = () => {
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(false);
  const query = `*[_type == "product"] | order(name asc)[0...20]{
  ...,"categories": categories[]->title
}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query);
        setProducts(await response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="flex flex-col lg:px-0">
      <div className="text-center">
        <Title className="text-lg font-bold">Featured Products</Title>
        <p className="text-sm font-medium">Check & Get Your Desired Product!</p>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Product is loading...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-5">
          <>
            {products?.map((product) => (
              <AnimatePresence key={product?._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard key={product?._id} product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </>
        </div>
      ) : (
        <NoProductAvailable />
      )}
    </Container>
  );
};

export default ProductGrid;
