"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";

const OrderSuccessPage = () => {
  return (
    <div className="bg-gray-50 min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-2xl w-full text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Thank you for your order!
        </h1>
        <p className="text-gray-600 mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-gray-600 mb-8">
          You will receive a confirmation email shortly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/account?tab=orders"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <ShoppingBag size={20} />
            View My Orders
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
