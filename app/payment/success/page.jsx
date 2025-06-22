"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handlePaymentSuccess } from "../../utils/api";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get payment data from URL parameters
        const paymentData = {
          tran_id: searchParams.get("tran_id"),
          val_id: searchParams.get("val_id"),
          amount: searchParams.get("amount"),
          store_amount: searchParams.get("store_amount"),
          currency: searchParams.get("currency"),
          status: searchParams.get("status"),
        };

        if (!paymentData.tran_id) {
          setStatus("error");
          setMessage("Invalid payment data");
          return;
        }

        // Send payment data to backend for verification
        const result = await handlePaymentSuccess(paymentData);

        if (result.success) {
          setStatus("success");
          setMessage("Payment successful! Your order has been confirmed.");
        } else {
          setStatus("error");
          setMessage("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        console.error("Payment processing error:", error);
        setStatus("error");
        setMessage("An error occurred while processing your payment.");
      }
    };

    processPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === "processing" && (
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          )}

          {status === "success" && (
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
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
            {status === "processing" && "Processing Payment"}
            {status === "success" && "Payment Successful!"}
            {status === "error" && "Payment Failed"}
          </h2>

          <p className="text-gray-600 mb-6">{message}</p>

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                Transaction ID: {searchParams.get("tran_id")}
              </p>
              <p className="text-sm text-green-800">
                Amount: ৳{searchParams.get("amount")}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 inline-block"
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
