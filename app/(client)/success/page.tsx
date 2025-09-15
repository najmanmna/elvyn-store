"use client";
import useCartStore from "@/store";
import { Check, Home, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const paymentMethod = searchParams.get("payment") || "Cash on Delivery";
  const resetCart = useCartStore((state) => state.resetCart);

  useEffect(() => {
    resetCart();
  }, [resetCart]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Check className="text-white w-10 h-10" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Thank you for your purchase. We’re processing your order and will
            ship it soon.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mt-8 border border-gray-100 text-left">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{orderNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">Domestic Courier – Rs. 240</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-medium">3–5 working days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <Link
              href="/"
              className="flex items-center justify-center px-4 py-3 font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center px-4 py-3 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;
