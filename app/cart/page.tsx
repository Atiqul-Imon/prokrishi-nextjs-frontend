"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  ArrowRight,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatAmount } from "@/app/utils/numberFormat";

function CartPage() {
  const {
    cart,
    cartTotal,
    cartCount,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const router = useRouter();
  const { messages, error, removeMessage } = useInlineMessage();
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  function handleCheckout() {
    if (cart.length === 0) {
      error("Your cart is empty", 5000);
      return;
    }
    router.push("/checkout");
  }

  function handleQuantityChange(id, newQuantity) {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  }

  function handleClearCart() {
    if (cart.length === 0) {
      error("Cart is already empty", 3000);
      return;
    }
    setShowClearConfirm(true);
  }

  function confirmClearCart() {
    clearCart();
    setShowClearConfirm(false);
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-4">
                      <div className="w-20 h-20 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <EmptyState 
          type="cart"
          title="Your cart is empty"
          description="Add some products to get started"
          actionText="Browse Products"
          actionHref="/products"
          icon={null}
          onAction={null}
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-20 to-yellow-20 min-h-screen py-8 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Inline Messages */}
        <div className="mb-4 space-y-2">
          {messages.map((msg) => (
            <InlineMessage
              key={msg.id}
              type={msg.type}
              message={msg.message}
              onClose={() => removeMessage(msg.id)}
            />
          ))}
        </div>

        {/* Clear Cart Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showClearConfirm}
          title="Clear Cart"
          message="Are you sure you want to remove all items from your cart? This action cannot be undone."
          confirmText="Clear Cart"
          cancelText="Cancel"
          type="warning"
          onConfirm={confirmClearCart}
          onCancel={() => setShowClearConfirm(false)}
        />
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClearCart}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 mt-1">
                  {cartCount} item{cartCount !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6"
                  >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-full sm:w-auto">
                          <img
                            src={item.image || "/img/placeholder.png"}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                {item.name}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">
                                {typeof item.category === 'string' ? item.category : item.category?.name}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id || item._id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price and Quantity */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity - 1,
                                    )
                                  }
                                  className="p-2 hover:bg-gray-100"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 text-center min-w-[3rem]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity + 1,
                                    )
                                  }
                                  className="p-2 hover:bg-gray-100"
                                  disabled={item.quantity >= item.stock}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="text-sm text-gray-500">
                                {item.stock} available
                              </span>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-base sm:text-lg font-bold text-primary">
                                ৳{formatAmount(item.price * item.quantity)}
                              </p>
                              <p className="text-sm text-gray-500">
                                ৳{formatAmount(item.price)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>৳{formatAmount(cartTotal)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>৳{formatAmount(cartTotal)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-lg font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
