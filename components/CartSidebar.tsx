"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
import { placeOrder, addAddress, getShippingQuote } from "@/app/utils/api";
import { fishOrderApi } from "@/app/utils/fishApi";
import InlineAddressForm from "./InlineAddressForm";
import { Address } from "@/types/models";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import Image from "next/image";
import { formatAmount } from "@/app/utils/numberFormat";

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
    getItemDisplayQuantity,
  } = useCart();
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address">("cart");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { messages, success, error, removeMessage } = useInlineMessage();
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<'inside_dhaka' | 'outside_dhaka' | null>(null);
  const [totalWeightKg, setTotalWeightKg] = useState(0);
  const isCalculatingRef = useRef(false);

  const addresses = user?.addresses || [];

  // Pre-select the first address if available
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress && checkoutStep !== "cart") {
      const defaultAddress = addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress, checkoutStep]);

  // Calculate weight from cart items (optimized with useMemo)
  const calculatedWeightKg = useMemo(() => {
    if (cart.length === 0) {
      return 0;
    }

    let weight = 0;
    cart.forEach((item) => {
      const variant = item.variantSnapshot || item.variants?.find((v) => v._id === item.variantId);
      const unit = variant?.unit || item.unit;
      const measurement = variant?.measurement || item.measurement;
      const unitWeightKg = variant?.unitWeightKg || item.unitWeightKg;
      const quantity = item.quantity;

      if (unitWeightKg && unitWeightKg > 0) {
        weight += unitWeightKg * quantity;
      } else if (unit === 'kg' && measurement) {
        weight += measurement * quantity;
      } else if (unit === 'g' && measurement) {
        weight += (measurement * quantity) / 1000;
      } else if (unit === 'l' && measurement) {
        weight += measurement * quantity; // 1L ≈ 1kg
      } else if (unit === 'ml' && measurement) {
        weight += (measurement * quantity) / 1000; // 1ml ≈ 1g
      }
    });

    return weight;
  }, [cart]);

  // Update totalWeightKg when calculated weight changes
  useEffect(() => {
    setTotalWeightKg(calculatedWeightKg);
  }, [calculatedWeightKg]);

  // Calculate shipping fee only when zone is selected
  useEffect(() => {
    if (!selectedZone || cart.length === 0 || isCalculatingRef.current) {
      if (!selectedZone) {
        setShippingFee(0);
        setShippingError(null);
      }
      return;
    }

    let isCancelled = false;
    isCalculatingRef.current = true;
    setShippingLoading(true);
    setShippingError(null);

    const calculateShipping = async () => {
      try {
        // Use a minimal address - zone is determined by user selection, not address
        const quotePayload = {
          orderItems: cart.map((item) => ({
            product: item.id || item._id,
            quantity: item.quantity,
            variantId: item.variantId,
          })),
          shippingAddress: {
            address: 'Address will be provided at checkout',
            division: '',
            district: '',
            upazila: '',
            postalCode: '',
          },
          shippingZone: selectedZone, // Zone is determined by user selection only
        };

        const result = await getShippingQuote(quotePayload);
        
        if (!isCancelled) {
          setShippingFee(result.shippingFee);
          if (result.totalWeightKg) {
            setTotalWeightKg(result.totalWeightKg);
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const errorMessage = err instanceof Error ? err.message : "Failed to calculate shipping.";
          setShippingFee(0);
          setShippingError(errorMessage);
        }
      } finally {
        if (!isCancelled) {
          setShippingLoading(false);
          isCalculatingRef.current = false;
        }
      }
    };

    calculateShipping();

    return () => {
      isCancelled = true;
      isCalculatingRef.current = false;
    };
  }, [selectedZone, cart]);

  // Reset checkout step when cart is empty
  useEffect(() => {
    if (cart.length === 0 && checkoutStep !== "cart") {
      setCheckoutStep("cart");
      setSelectedZone(null);
      setShippingFee(0);
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

  // Memoize form change callbacks to prevent infinite loops
  const handleFormChangeForLoggedIn = useCallback((formData: Address | null, isValid: boolean) => {
    if (isValid && formData) {
      setSelectedAddress(formData);
    } else {
      setSelectedAddress(null);
    }
  }, []);

  const handleFormChangeForGuest = useCallback((formData: Address | null, isValid: boolean) => {
    if (isValid && formData) {
      setSelectedAddress(formData);
    } else {
      setSelectedAddress(null);
    }
  }, []);

  const handlePlaceOrder = async () => {
    // Validation
    if (cart.length === 0) {
      error("Your cart is empty.", 5000);
      return;
    }

    if (!selectedAddress) {
      error("Please provide a shipping address.", 5000);
      return;
    }

    if (!selectedZone) {
      error("Please select a delivery zone.", 5000);
      return;
    }

    if (shippingLoading) {
      error("Please wait for shipping calculation to complete.", 5000);
      return;
    }

    if (isSubmitting) {
      return; // Prevent double submission
    }

    setIsSubmitting(true);
    setLoadingMessage("Placing your order...");

    const shippingAddressData = {
      address: selectedAddress.address || "",
      district: selectedAddress.district || "",
      upazila: selectedAddress.upazila || "",
      postalCode: selectedAddress.postalCode || "",
    };

    // Separate fish products from regular products (same logic as checkout page)
    const fishProducts = cart.filter((item) => {
      const itemAny = item as any;
      
      // Primary check: Explicit isFishProduct flag
      if (itemAny.isFishProduct === true) return true;
      
      // Secondary check: sizeCategories property
      if (itemAny.sizeCategories !== undefined && Array.isArray(itemAny.sizeCategories) && itemAny.sizeCategories.length > 0) {
        return true;
      }
      
      // Tertiary check: Category name + unit combination
      const category = itemAny.category;
      const unit = item.unit || itemAny.unit;
      const categoryName = category && typeof category === 'object' ? (category as any).name : null;
      
      if (categoryName === 'মাছ' && unit === 'kg') {
        if (item.variantSnapshot && (item.variantSnapshot as any).unit === 'kg') {
          return true;
        }
        if (!item.variantSnapshot || !item.hasVariants) {
          return true;
        }
      }
      
      return false;
    });
    
    const regularProducts = cart.filter((item) => {
      return !fishProducts.includes(item);
    });

    try {
      let regularOrderId: string | null = null;
      let fishOrderId: string | null = null;

      // Calculate shipping fees separately for regular and fish products
      // For CartSidebar, we use the total shipping fee and split it
      // (The backend calculates combined shipping, fish orders will recalculate on backend)
      const regularShippingFee = fishProducts.length === 0 ? shippingFee : 
        (shippingFee * regularProducts.length / (regularProducts.length + fishProducts.length)); // Simple split

      // Create regular order if there are regular products
      if (regularProducts.length > 0) {
        try {
          setLoadingMessage("Creating order for regular products...");
          
          const regularOrderTotalPrice = regularProducts.reduce((sum, item) => {
            const price = item.variantSnapshot?.price || item.price;
            return sum + price * item.quantity;
          }, 0);

          const regularOrderData = {
            orderItems: regularProducts.map((item) => ({
              product: item.id || item._id,
              name: item.name,
              quantity: item.quantity,
              price: item.variantSnapshot?.price || item.price,
              variantId: item.variantId,
            })),
            shippingAddress: shippingAddressData,
            paymentMethod: "Cash on Delivery",
            totalPrice: regularOrderTotalPrice,
            totalAmount: regularOrderTotalPrice + regularShippingFee,
            shippingFee: regularShippingFee,
            shippingZone: selectedZone,
            shippingWeightKg: totalWeightKg,
            ...(user ? {} : {
              guestInfo: {
                name: selectedAddress.name || "",
                email: "",
                phone: selectedAddress.phone || "",
              },
            }),
          };

          const newRegularOrder = await placeOrder(regularOrderData);
          regularOrderId = newRegularOrder._id || newRegularOrder.order?._id || newRegularOrder.data?._id || null;
        } catch (regularOrderError) {
          if (fishProducts.length > 0) {
            throw new Error(`Failed to create regular product order. Please try again or contact support. Error: ${regularOrderError instanceof Error ? regularOrderError.message : 'Unknown error'}`);
          }
          throw regularOrderError;
        }
      }

      // Create fish order if there are fish products
      if (fishProducts.length > 0) {
        try {
          setLoadingMessage("Creating order for fish products...");

          const fishOrderItems = fishProducts.map((item) => {
            const itemAny = item as any;
            
            // Try multiple ways to get sizeCategoryId
            let sizeCategoryId = item.variantId || (item.variantSnapshot as any)?._id;
            
            // If not found, try to get from sizeCategories array
            if (!sizeCategoryId && itemAny.sizeCategories && Array.isArray(itemAny.sizeCategories)) {
              // Try to find default or first size category
              const defaultSizeCat = itemAny.sizeCategories.find((sc: any) => sc.isDefault) || itemAny.sizeCategories[0];
              if (defaultSizeCat) {
                sizeCategoryId = defaultSizeCat._id;
              }
            }
            
            const requestedWeight = item.quantity; // Quantity is in kg for fish products
            const pricePerKg = item.variantSnapshot?.price || item.price;

            if (!sizeCategoryId) {
              // Provide more detailed error message
              console.error('Fish product cart item details:', {
                name: item.name,
                id: item.id || item._id,
                variantId: item.variantId,
                variantSnapshot: item.variantSnapshot,
                sizeCategories: itemAny.sizeCategories,
                isFishProduct: itemAny.isFishProduct,
              });
              throw new Error(`Size category not found for ${item.name}. Please remove this item from cart and add it again.`);
            }

            return {
              fishProduct: item.id || item._id,
              sizeCategoryId: sizeCategoryId,
              requestedWeight: requestedWeight,
              notes: item.name,
            };
          });

          const fishOrderTotalPrice = fishProducts.reduce((sum, item) => {
            const pricePerKg = item.variantSnapshot?.price || item.price;
            return sum + pricePerKg * item.quantity;
          }, 0);

          const fishOrderData = {
            orderItems: fishOrderItems,
            shippingAddress: {
              name: user ? (selectedAddress?.name || user.name) : (selectedAddress?.name || ""),
              phone: user ? (selectedAddress?.phone || user.phone) : (selectedAddress?.phone || ""),
              address: shippingAddressData.address,
              division: (selectedAddress as any)?.division || "",
              district: shippingAddressData.district,
              upazila: shippingAddressData.upazila,
              postalCode: shippingAddressData.postalCode,
            },
            paymentMethod: "Cash on Delivery",
            totalPrice: fishOrderTotalPrice,
            ...(user ? {} : {
              guestInfo: {
                name: selectedAddress.name || "",
                email: "",
                phone: selectedAddress.phone || "",
              },
            }),
          };

          const newFishOrder: any = await fishOrderApi.create(fishOrderData);
          fishOrderId = newFishOrder?.fishOrder?._id || newFishOrder?._id || null;
        } catch (fishOrderError) {
          if (regularOrderId) {
            error(
              `Regular product order was created successfully, but fish product order failed. Please contact support with order ID: ${regularOrderId}. Error: ${fishOrderError instanceof Error ? fishOrderError.message : 'Unknown error'}`,
              8000
            );
            setLoadingMessage(null);
            return;
          }
          throw fishOrderError;
        }
      }

      setLoadingMessage(null);

      // Use primary order ID (regular if exists, otherwise fish)
      const primaryOrderId = regularOrderId || fishOrderId;
      
      if (!primaryOrderId) {
        throw new Error("Failed to create order");
      }

      const orderMessage = regularProducts.length > 0 && fishProducts.length > 0
        ? "Orders placed successfully! (Regular and Fish orders created)"
        : "Order placed successfully!";
      
      success(orderMessage, 3000);
      clearCart();
      onClose();
      router.push(`/order/success?orderId=${primaryOrderId}`);
    } catch (err: unknown) {
      setLoadingMessage(null);
      console.error("Failed to create order:", err);
      const errorMessage =
        (err && typeof err === 'object' && 'response' in err && 
         err.response && typeof err.response === 'object' && 'data' in err.response &&
         err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data)
          ? String(err.response.data.message)
          : err instanceof Error 
          ? err.message 
          : "There was an issue placing your order.";
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
        <div className="flex-1 overflow-y-auto pb-20 md:pb-4">
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
                    {cart.map((item) => {
                      const displayQty = getItemDisplayQuantity ? getItemDisplayQuantity(item) : null;
                      const itemTotalPrice = item.price * item.quantity;
                      const itemId = item.id || item._id;
                      const cartKey = `${itemId}-${item.variantId || "default"}`;
                      return (
                        <div
                          key={cartKey}
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
                            <div className="mb-2">
                              <p className="text-green-600 font-bold text-sm">
                                ৳{formatAmount(itemTotalPrice)}
                              </p>
                              {displayQty && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {displayQty.displayText} × {item.quantity}
                                </p>
                              )}
                            </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(itemId, item.quantity - 1, item.variantId)
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
                                updateQuantity(itemId, item.quantity + 1, item.variantId)
                              }
                              className="w-7 h-7 flex items-center justify-center border-2 border-gray-300 rounded hover:border-green-500 hover:bg-green-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(itemId, item.variantId)}
                              className="ml-auto p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>

                  {/* Shipping Zone Selection */}
                  <div className="border-t-2 border-gray-200 pt-4 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Delivery Zone</h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        onClick={() => setSelectedZone('inside_dhaka')}
                        className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                          selectedZone === 'inside_dhaka'
                            ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'
                            : 'border-gray-200 hover:border-green-300 text-gray-700'
                        }`}
                      >
                        Inside Dhaka
                      </button>
                      <button
                        onClick={() => setSelectedZone('outside_dhaka')}
                        className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                          selectedZone === 'outside_dhaka'
                            ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'
                            : 'border-gray-200 hover:border-green-300 text-gray-700'
                        }`}
                      >
                        Outside Dhaka
                      </button>
                    </div>
                    {totalWeightKg > 0 && (
                      <p className="text-xs text-gray-500 mb-2">
                        Total Weight: {totalWeightKg.toFixed(2)} kg
                      </p>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t-2 border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Subtotal</span>
                      <span className="font-semibold">৳{formatAmount(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Shipping</span>
                      <span className="font-bold text-green-600">
                        {shippingLoading
                          ? "Calculating..."
                          : !selectedZone
                          ? "Select zone"
                          : shippingFee === 0
                          ? "FREE"
                          : `৳${formatAmount(shippingFee)}`}
                      </span>
                    </div>
                    {shippingError && (
                      <p className="text-xs text-red-500 mb-2">{shippingError}</p>
                    )}
                    <div className="flex justify-between text-xl font-bold text-gray-900 mt-3 pt-3 border-t-2 border-gray-200">
                      <span>Total</span>
                      <span>৳{formatAmount(cartTotal + shippingFee)}</span>
                    </div>
                  </div>

                  {/* Proceed to Checkout Button - Fixed at bottom with mobile nav padding */}
                  <div className="fixed bottom-16 md:sticky md:bottom-0 left-0 right-0 md:left-auto md:right-auto bg-white pt-4 border-t-2 border-gray-200 -mx-4 px-4 pb-4 md:pb-4 z-50">
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
                    onFormChange={handleFormChangeForLoggedIn}
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
                        onFormChange={handleFormChangeForGuest}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Shipping Zone Selection in Address Step */}
              <div className="border-t-2 border-gray-200 pt-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Delivery Zone</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => setSelectedZone('inside_dhaka')}
                    className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                      selectedZone === 'inside_dhaka'
                        ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-green-300 text-gray-700'
                    }`}
                  >
                    Inside Dhaka
                  </button>
                  <button
                    onClick={() => setSelectedZone('outside_dhaka')}
                    className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                      selectedZone === 'outside_dhaka'
                        ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-green-300 text-gray-700'
                    }`}
                  >
                    Outside Dhaka
                  </button>
                </div>
                {totalWeightKg > 0 && (
                  <p className="text-xs text-gray-500 mb-2">
                    Total Weight: {totalWeightKg.toFixed(2)} kg
                  </p>
                )}
              </div>

              {/* Order Summary in Address Step */}
              {selectedAddress && (
                <div className="border-t-2 border-gray-200 pt-4 mb-4">
                  <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span className="font-semibold">৳{formatAmount(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Shipping</span>
                    <span className="font-bold text-green-600">
                      {shippingLoading
                        ? "Calculating..."
                        : !selectedZone
                        ? "Select zone"
                        : shippingFee === 0
                        ? "FREE"
                        : `৳${formatAmount(shippingFee)}`}
                    </span>
                  </div>
                  {shippingError && (
                    <p className="text-xs text-red-500 mb-2">{shippingError}</p>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-900 mt-3 pt-3 border-t-2 border-gray-200">
                    <span>Total</span>
                    <span>৳{formatAmount(cartTotal + shippingFee)}</span>
                  </div>
                </div>
              )}

              {/* Place Order Button - Fixed at bottom with mobile nav padding */}
              <div className="fixed bottom-16 md:sticky md:bottom-0 left-0 right-0 md:left-auto md:right-auto bg-white pt-4 border-t-2 border-gray-200 -mx-4 px-4 pb-4 md:pb-4 z-50">
                <button
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || !selectedZone || isSubmitting || shippingLoading}
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
                {!selectedAddress && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Please fill in name, phone, and address to continue
                  </p>
                )}
                {!selectedZone && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Please select delivery zone
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

