"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFail() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h2>

          <p className="text-gray-600 mb-6">
            Your payment was not successful. Please try again or contact support if the problem persists.
          </p>

          <div className="space-y-3">
            <Link
              href="/checkout"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 inline-block"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200 inline-block"
            >
              Continue Shopping
            </Link>

            <Link
              href="/account"
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200 inline-block"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
