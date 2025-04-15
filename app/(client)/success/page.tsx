"use client";

import useCartStore from "@/store";
import {
  Check,
  Home,
  Package,
  ShoppingBag,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";

const SuccessPage = () => {
  const [orders, setOrders] = useState<MY_ORDERS_QUERYResult>([]);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const clearCart = useCartStore((state) => state.resetCart);
  const { user } = useUser();
  const userId = user?.id;

  const query =
    defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderDate desc){
    ...,
    products[]{
      ...,
      product->
    }
  }`);

  useEffect(() => {
    if (orderNumber) {
      clearCart();
    }
  }, [orderNumber, clearCart]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (!userId) {
        console.log("User ID not found. Cannot fetch orders.");
        setIsLoading(false);
        return;
      }

      try {
        const ordersData = await client.fetch(query, { userId });
        setOrders(ordersData);
        console.log("Fetched orders:", ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, query]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
        >
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-tech_orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Check className="text-white w-10 h-10" />
            </motion.div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Thank you for your purchase. We&apos;re processing your order and
              will ship it soon.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 border border-gray-100">
            <h2 className="font-semibold text-lg mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-tech_orange" />
              Order Details
            </h2>

            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{orderNumber}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">Credit Card</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-tech_orange" />
              Recent Orders
            </h3>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block w-6 h-6 border-2 border-tech_orange border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-sm text-gray-500">
                  Loading your orders...
                </p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-3">
                {(showAllOrders ? orders : orders.slice(0, 3)).map((order) => (
                  <div
                    key={order?._id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-tech_orange transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium text-sm">
                        {order?._id?.substring(0, 8)}...
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.orderDate
                          ? dayjs(order.orderDate).format("MMM D, YYYY")
                          : "Processing"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium px-2 py-1 bg-gray-200 rounded-full mr-2">
                        ${order.totalPrice?.toFixed(2) || "0.00"}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        {order.status || "Processing"}
                      </span>
                    </div>
                  </div>
                ))}

                {orders.length > 3 && (
                  <button
                    onClick={() => setShowAllOrders(!showAllOrders)}
                    className="w-full mt-3 text-tech_orange text-sm font-medium hover:text-tech_orange/80 flex items-center justify-center py-2 border border-gray-100 rounded-lg hover:border-tech_orange/50 transition-all duration-200"
                  >
                    {showAllOrders ? "Show Less" : "View All Orders"}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-500">No previous orders found.</p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-center justify-center px-4 py-3 font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            <Link
              href="/account/orders"
              className="flex items-center justify-center px-4 py-3 font-medium bg-tech_orange text-white rounded-lg hover:bg-tech_orange/90 transition-all duration-300 shadow-md"
            >
              <Package className="w-4 h-4 mr-2" />
              My Orders
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center px-4 py-3 font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
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
