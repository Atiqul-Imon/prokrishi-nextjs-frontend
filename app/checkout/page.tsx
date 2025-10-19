"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  ShoppingCart,
  Shield,
} from "lucide-react";
import AddressForm from "../account/AddressForm";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { placeOrder, addAddress, createPaymentSession } from "../utils/api";
import CheckoutProgress from "@/components/CheckoutProgress";
import toast from "react-hot-toast";
import { Address } from "@/types/models";

export default function CheckoutPage() {
  const {
    cart,
    cartTotal,
    cartCount,
    loading: cartLoading,
    clearCart,
  } = useCart();
  const {
    user,
    loading: authLoading,
    error: authError,
    refreshUser,
  } = useAuth();
  const router = useRouter();

  const [checkoutStep, setCheckoutStep] = useState("shipping");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");

  const addresses = user?.addresses || [];

  // Payment methods
  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: "💵",
      color: "border-green-500 bg-green-50",
      textColor: "text-green-700",
    },
    {
      id: "sslcommerz",
      name: "Online Payment",
      description:
        "Pay securely with cards, mobile banking, or internet banking",
      icon: "💳",
      color: "border-blue-500 bg-blue-50",
      textColor: "text-blue-700",
    },
  ];

  // Pre-select the first address if available
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    if (selectedAddress) {
      setCheckoutStep("payment");
    } else {
      setCheckoutStep("shipping");
    }
  }, [selectedAddress]);

  const handleAddressSave = async (addressData: Address) => {
    const toastId = toast.loading("Adding new address...");
    try {
      const response = await addAddress(addressData);
      if (refreshUser) {
        await refreshUser();
      }
      setOpenAddressForm(false);
      // Get the newly added address from the user's addresses
      const newlyAddedAddress = response.user?.addresses?.[response.user.addresses.length - 1];
      if (newlyAddedAddress) {
        setSelectedAddress(newlyAddedAddress);
      }
      toast.success("Address added successfully!", { id: toastId });
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to add address.", { id: toastId });
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select a shipping address.");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Placing your order...");

    const orderData = {
      orderItems: cart.map((item) => ({
        product: item.id || item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        address: selectedAddress.address,
        district: selectedAddress.district,
        upazila: selectedAddress.upazila,
        postalCode: selectedAddress.postalCode,
      },
      paymentMethod:
        selectedPaymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
      totalPrice: cartTotal,
      totalAmount: cartTotal,
    };

    try {
      const newOrder = await placeOrder(orderData);
      toast.dismiss(toastId);

      if (selectedPaymentMethod === "sslcommerz") {
        // Create payment session for online payment
        const orderId = newOrder._id || newOrder.order?._id || newOrder.data?._id;
        const paymentResult = await createPaymentSession({
          orderId: orderId!,
          paymentMethod: "SSL Commerz",
        });

        if (paymentResult.success) {
          // Redirect to SSL Commerz payment page
          window.location.href = paymentResult.paymentUrl;
        } else {
          toast.error("Failed to create payment session. Please try again.");
        }
      } else {
        // Cash on Delivery - proceed to success page
        toast.success("Order placed successfully!");
        clearCart();
        const orderId = newOrder._id || newOrder.order?._id || newOrder.data?._id;
        router.push(`/order/success?orderId=${orderId}`);
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Failed to create order:", error);
      const errorMessage =
        error.response?.data?.message ||
        "There was an issue placing your order.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = authLoading || cartLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  if (!user && !loading) {
    router.push("/login?redirect=/checkout");
    return null;
  }

  if (cart.length === 0 && !cartLoading) {
    return (
      <div className="text-center min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-6" />
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          Looks like you haven't added anything to your cart yet. Start
          exploring our products to find something you like!
        </p>
        <Link
          href="/products"
          className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-transform duration-300 ease-in-out hover:scale-105 shadow-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <CheckoutProgress currentStep={checkoutStep} />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Left Side: Address & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
                Shipping Address
              </h2>
              {openAddressForm ? (
                <div>
                <AddressForm
                  initial={null}
                  onClose={() => setOpenAddressForm(false)}
                  onSave={handleAddressSave}
                    />
                </div>
              ) : (
                <div>
                    <div className="space-y-4">
                      {addresses.length > 0 ? (
                        addresses.map((addr) => (
                          <div
                            key={addr._id}
                            onClick={() => setSelectedAddress(addr)}
                            className={`p-5 border rounded-xl cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                              selectedAddress?._id === addr._id
                                ? "border-primary-500 bg-primary-50 ring-2 ring-primary-400 shadow-md"
                                : "border-gray-200 hover:border-primary-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <MapPin
                                  className={`w-6 h-6 ${selectedAddress?._id === addr._id ? "text-primary-600" : "text-gray-400"}`}
                                />
                                <div className="font-semibold text-gray-800">
                                  {addr.addressType || "Saved Address"}
                                </div>
                              </div>
                              {selectedAddress?._id === addr._id && (
                                <CheckCircle className="w-6 h-6 text-primary-600" />
                              )}
                            </div>
                            <p className="text-gray-600 mt-2 pl-9">
                              {addr.address}, {addr.upazila}, {addr.district} -{" "}
                              {addr.postalCode}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg bg-gray-50">
                          <p className="text-gray-600 font-medium">
                            No saved addresses found.
                          </p>
                          <p className="text-gray-500 text-sm mt-2">
                            Please add an address to proceed.
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setOpenAddressForm(true)}
                      className="mt-6 flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors group"
                    >
                      <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                      <span>Add New Address</span>
                    </button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
                Payment Method
              </h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                      selectedPaymentMethod === method.id
                        ? `${method.color} ring-2 ring-blue-400 shadow-md`
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{method.icon}</div>
                        <div>
                          <h3
                            className={`font-semibold ${selectedPaymentMethod === method.id ? method.textColor : "text-gray-800"}`}
                          >
                            {method.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      {selectedPaymentMethod === method.id && (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedPaymentMethod === "sslcommerz" && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        Secure Payment
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your payment information is encrypted and secure. We use
                        SSL Commerz, a trusted payment gateway in Bangladesh.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-gray-600"
                  >
                    <span className="font-medium text-gray-800">
                      {item.name}{" "}
                      <span className="text-sm text-gray-500">
                        x {item.quantity}
                      </span>
                    </span>
                    <span className="font-semibold">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t-2 border-dashed pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">৳{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 mt-3 border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>৳{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handlePlaceOrder}
                  disabled={
                    cart.length === 0 ||
                    !selectedAddress ||
                    !selectedPaymentMethod ||
                    isSubmitting
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-green-500/50 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <span>Processing...</span>
                    </>
                  ) : selectedPaymentMethod === "cod" ? (
                    "Place Order (Cash on Delivery)"
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </div>

              {selectedPaymentMethod === "cod" && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                  You will pay when you receive your order.
                </p>
              )}

              {selectedPaymentMethod === "sslcommerz" && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                  You will be redirected to a secure payment page.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
