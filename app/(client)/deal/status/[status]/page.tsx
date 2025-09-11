"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import ProductCard from "@/components/ProductCard";
import NoProductAvailable from "@/components/NoProductAvailable";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";

export default function StatusPage() {
  const { status } = useParams(); // "hot", "new", "sale"
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!status) return;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = `*[_type == "product" && status == $status] | order(name asc){
          ...,
          "categories": categories[]->title
        }`;
        const response = await client.fetch(query, { status });
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products by status:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [status]);

  return (
    <Container className="flex flex-col lg:px-0">
      <div className="text-center">
        <Title className="text-lg font-bold">
          {status?.toString().toUpperCase()} Products
        </Title>
        <p className="text-sm font-medium">
          Showing products with status: {status}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading products...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-5">
          {products.map((product) => (
            <AnimatePresence key={product._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCard product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        <NoProductAvailable />
      )}
    </Container>
  );
}
