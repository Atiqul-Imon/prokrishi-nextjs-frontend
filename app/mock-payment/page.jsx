"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { mockPaymentSuccess, mockPaymentFail } from "../utils/api";
import toast from "react-hot-toast";

export default function MockPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const tran_id = searchParams.get("tran_id");
  const amount = searchParams.get("amount");
  const orderId = searchParams.get("orderId");

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "bkash",
      name: "bKash",
      icon: "📱",
      description: "Mobile Banking",
    },
    {
      id: "nagad",
      name: "Nagad",
      icon: "📱",
      description: "Digital Financial Service",
    },
    {
      id: "rocket",
      name: "Rocket (DBBL)",
      icon: "📱",
      description: "Mobile Banking",
    },
  ];

  const handlePayment = async (success = true) => {
    if (!tran_id) {
      toast.error("Invalid transaction data");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading(
      success ? "Processing payment..." : "Processing payment failure...",
    );

    try {
      if (success) {
        await mockPaymentSuccess({ tran_id, orderId });
        toast.success("Payment successful!", { id: toastId });
        router.push(
          `/payment/success?tran_id=${tran_id}&amount=${amount}&status=success`,
        );
      } else {
        await mockPaymentFail({
          tran_id,
          orderId,
          error: "Insufficient funds",
        });
        toast.error("Payment failed!", { id: toastId });
        router.push(
          `/payment/fail?tran_id=${tran_id}&error=Insufficient funds`,
        );
      }
    } catch (error) {
      toast.error("An error occurred", { id: toastId });
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const simulatePayment = () => {
    // Simulate a real payment process
    setIsProcessing(true);

    setTimeout(() => {
      // Randomly succeed or fail (80% success rate for testing)
      const shouldSucceed = Math.random() > 0.2;
      handlePayment(shouldSucceed);
    }, 2000);
  };

  if (!tran_id || !amount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Payment Data
          </h2>
          <p className="text-gray-600">Missing transaction information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Secure Payment Gateway
            </h1>
          </div>
          <p className="text-gray-600">
            This is a mock payment system for testing purposes
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Payment Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm">{tran_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-xl text-green-600">
                  ৳{parseFloat(amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Currency:</span>
                <span>BDT (Bangladeshi Taka)</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Select Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {method.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          {selectedMethod === "card" && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Card Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={simulatePayment}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Pay ৳{parseFloat(amount).toFixed(2)}
                  </>
                )}
              </button>

              <button
                onClick={() => handlePayment(false)}
                disabled={isProcessing}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Simulate Failure
              </button>

              <button
                onClick={() =>
                  router.push(`/payment/cancel?tran_id=${tran_id}`)
                }
                disabled={isProcessing}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                Cancel Payment
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Secure Payment
                </span>
              </div>
              <p className="text-xs text-blue-700">
                This is a mock payment system for testing. No real payments will
                be processed. Your payment information is encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
