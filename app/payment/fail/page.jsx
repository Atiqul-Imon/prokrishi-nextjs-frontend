"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handlePaymentFail } from "../../utils/api";
import { XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentFail() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing payment failure...");

  useEffect(() => {
    const processPaymentFailure = async () => {
      try {
        // Get payment data from URL parameters
        const paymentData = {
          tran_id: searchParams.get("tran_id"),
          error: searchParams.get("error"),
        };

        if (!paymentData.tran_id) {
          setStatus("error");
          setMessage("Invalid payment data");
          return;
        }

        // Send payment failure data to backend
        await handlePaymentFail(paymentData);

        setStatus("error");
        setMessage("Payment failed. Please try again or contact support.");
      } catch (error) {
        console.error("Payment failure processing error:", error);
        setStatus("error");
        setMessage("An error occurred while processing your payment failure.");
      }
    };

    processPaymentFailure();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === "processing" && (
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          )}

          {status === "error" && (
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {status === "processing" && "Processing Payment Failure"}
            {status === "error" && "Payment Failed"}
          </h2>

          <p className="text-gray-600 mb-6">{message}</p>

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                Transaction ID: {searchParams.get("tran_id")}
              </p>
              {searchParams.get("error") && (
                <p className="text-sm text-red-800">
                  Error: {searchParams.get("error")}
                </p>
              )}
            </div>
          )}

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
