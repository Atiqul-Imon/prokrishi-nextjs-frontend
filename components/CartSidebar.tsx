"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MapPin,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { placeOrder, addAddress } from "@/app/utils/api";
import InlineAddressForm from "./InlineAddressForm";
import { Address } from "@/types/models";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import Image from "next/image";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    cart,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address">("cart");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { messages, success, error, removeMessage } = useInlineMessage();
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const addresses = user?.addresses || [];

  // Pre-select the first address if available
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress && checkoutStep !== "cart") {
      const defaultAddress = addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress, checkoutStep]);

  // Reset checkout step when cart is empty
  useEffect(() => {
    if (cart.length === 0 && checkoutStep !== "cart") {
      setCheckoutStep("cart");
    }
  }, [cart.length, checkoutStep]);

  const handleAddressSave = async (addressData: Address) => {
    setLoadingMessage("Adding new address...");
    try {
      const response = await addAddress(addressData);
      if (refreshUser) {
        await refreshUser();
      }
      setOpenAddressForm(false);
      const newlyAddedAddress = response.user?.addresses?.[response.user.addresses.length - 1];
      if (newlyAddedAddress) {
        setSelectedAddress(newlyAddedAddress);
      }
      setLoadingMessage(null);
      success("Address added successfully!", 3000);
    } catch (err) {
      const errMsg = err as Error;
      setLoadingMessage(null);
      error(errMsg.message || "Failed to add address.", 5000);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      error("Your cart is empty.", 5000);
      return;
    }

    if (!selectedAddress) {
      error("Please provide a shipping address.", 5000);
      return;
    }

    setIsSubmitting(true);
    setLoadingMessage("Placing your order...");

    let shippingAddressData = {
      address: selectedAddress.address || "",
      district: selectedAddress.district || "",
      upazila: selectedAddress.upazila || "",
      postalCode: selectedAddress.postalCode || "",
    };

    const orderData: any = {
      orderItems: cart.map((item) => ({
        product: item.id || item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: shippingAddressData,
      paymentMethod: "Cash on Delivery",
      totalPrice: cartTotal,
      totalAmount: cartTotal,
    };

    // For guest orders, extract name and phone from address
    if (!user && selectedAddress) {
      orderData.guestInfo = {
        name: selectedAddress.name || "",
        email: "",
        phone: selectedAddress.phone || "",
      };
    }

    try {
      const newOrder = await placeOrder(orderData);
      setLoadingMessage(null);
      success("Order placed successfully!", 3000);
      clearCart();
      const orderId = newOrder._id || newOrder.order?._id || newOrder.data?._id;
      onClose();
      router.push(`/order/success?orderId=${orderId}`);
    } catch (err) {
      setLoadingMessage(null);
      console.error("Failed to create order:", err);
      const errorMessage =
        (err as any).response?.data?.message ||
        "There was an issue placing your order.";
      error(errorMessage, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] lg:w-[520px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 bg-white sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {checkoutStep === "cart" 
                  ? (cartCount > 0 ? `${cartCount} ITEM${cartCount > 1 ? "S" : ""}` : "CART")
                  : "Shipping Address"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="px-4 pt-2 space-y-2 flex-shrink-0">
          {loadingMessage && (
            <InlineMessage type="info" message={loadingMessage} />
          )}
          {messages.map((msg) => (
            <InlineMessage
              key={msg.id}
              type={msg.type}
              message={msg.message}
              onClose={() => removeMessage(msg.id)}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {checkoutStep === "cart" && (
            <div className="p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Add some products to get started!
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.id || item._id}
                        className="flex gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.image || "/img/placeholder.png"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-green-600 font-bold text-sm mb-2">
                            ৳{item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id || item._id, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center border-2 border-gray-300 rounded hover:border-green-500 hover:bg-green-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id || item._id, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center border-2 border-gray-300 rounded hover:border-green-500 hover:bg-green-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id || item._id)}
                              className="ml-auto p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t-2 border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Subtotal</span>
                      <span className="font-semibold">৳{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Shipping</span>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 mt-3 pt-3 border-t-2 border-gray-200">
                      <span>Total</span>
                      <span>৳{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Proceed to Checkout Button - Sticky */}
                  <div className="sticky bottom-0 bg-white pt-4 border-t-2 border-gray-200 -mx-4 px-4 pb-4">
                    <button
                      onClick={() => setCheckoutStep("address")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-lg font-bold text-lg transition-colors shadow-lg"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {checkoutStep === "address" && (
            <div className="p-4 space-y-4 pb-6">
              <div className="flex items-center justify-between mb-2 sticky top-0 bg-white z-10 pb-2">
                <button
                  onClick={() => {
                    setOpenAddressForm(false);
                    setCheckoutStep("cart");
                  }}
                  className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2 text-sm"
                >
                  ← Back to Cart
                </button>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Shipping Address
                </h3>
                {openAddressForm ? (
                  <InlineAddressForm
                    initial={null}
                    onClose={() => setOpenAddressForm(false)}
                    onSave={handleAddressSave}
                  />
                ) : (
                  <div>
                    {user ? (
                      <>
                        <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
                          {addresses.length > 0 ? (
                            addresses.map((addr) => (
                              <div
                                key={addr._id}
                                onClick={() => setSelectedAddress(addr)}
                                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                  selectedAddress?._id === addr._id
                                    ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                                    : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900">
                                      {addr.addressType || "Saved Address"}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                      {addr.address}, {addr.upazila}, {addr.district} - {addr.postalCode}
                                    </p>
                                  </div>
                                  {selectedAddress?._id === addr._id && (
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                              <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">
                                No saved addresses. Please add one.
                              </p>
                            </div>
                          )}
                        </div>
                        {!openAddressForm && (
                          <button
                            onClick={() => setOpenAddressForm(true)}
                            className="w-full text-green-600 hover:text-green-700 font-semibold text-sm py-2.5 border-2 border-dashed border-green-300 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add New Address
                          </button>
                        )}
                      </>
                    ) : (
                      <InlineAddressForm
                        initial={null}
                        onClose={() => {}}
                        onSave={async (addressData) => {
                          setSelectedAddress(addressData as Address);
                          success("Address saved!", 3000);
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Place Order Button - Sticky at bottom */}
              <div className="sticky bottom-0 bg-white pt-4 border-t-2 border-gray-200 -mx-4 px-4 pb-4">
                <button
                  onClick={handlePlaceOrder}
                  disabled={openAddressForm || !selectedAddress || isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-lg font-bold text-lg transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    "Place Order (Cash on Delivery)"
                  )}
                </button>
                {!selectedAddress && !openAddressForm && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Please provide a shipping address to continue
                  </p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

