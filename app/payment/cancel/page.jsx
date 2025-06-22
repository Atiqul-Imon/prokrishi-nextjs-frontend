"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { handlePaymentCancel } from "../../utils/api";
import Link from "next/link";

export default function PaymentCancel() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing payment cancellation...");

  useEffect(() => {
    const processPaymentCancellation = async () => {
      try {
        // Get payment data from URL parameters
        const paymentData = {
          tran_id: searchParams.get("tran_id"),
        };

        if (!paymentData.tran_id) {
          setStatus("cancelled");
          setMessage("Payment was cancelled");
          return;
        }

        // Send payment cancellation data to backend
        await handlePaymentCancel(paymentData);

        setStatus("cancelled");
        setMessage("Payment was cancelled successfully.");
      } catch (error) {
        console.error("Payment cancellation processing error:", error);
        setStatus("cancelled");
        setMessage("Payment was cancelled.");
      }
    };

    processPaymentCancellation();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === "processing" && (
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          )}

          {status === "cancelled" && (
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
                <svg
                  className="h-8 w-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {status === "processing" && "Processing Cancellation"}
            {status === "cancelled" && "Payment Cancelled"}
          </h2>

          <p className="text-gray-600 mb-6">{message}</p>

          {status === "cancelled" && searchParams.get("tran_id") && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                Transaction ID: {searchParams.get("tran_id")}
              </p>
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
