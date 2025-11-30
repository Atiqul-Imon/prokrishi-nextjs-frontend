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
import { placeOrder, addAddress, createPaymentSession, getShippingQuote } from "../utils/api";
import { fishOrderApi } from "../utils/fishApi";
import CheckoutProgress from "@/components/CheckoutProgress";
import { Address } from "@/types/models";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { formatAmount } from "@/app/utils/numberFormat";

export default function CheckoutPage() {
  const {
    cart,
    cartTotal,
    cartCount,
    loading: cartLoading,
    clearCart,
    removeFromCart,
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
  const { messages, success, error, info, removeMessage } = useInlineMessage();
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [shippingQuote, setShippingQuote] = useState<{
    shippingFee: number;
    totalWeightKg: number;
    zone: string;
  } | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<'inside_dhaka' | 'outside_dhaka' | null>(null);

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

  // Calculate shipping only when zone is manually selected
  useEffect(() => {
    if (!selectedZone || cart.length === 0) {
      setShippingQuote(null);
      setShippingError(null);
      return;
    }

    const quotePayload = {
      orderItems: cart.map((item) => ({
        product: item.id || item._id,
        quantity: item.quantity,
        variantId: item.variantId,
      })),
      shippingAddress: {
        address: selectedAddress?.address || 'Address will be provided',
        division: selectedAddress?.division || '',
        district: selectedAddress?.district || '',
        upazila: selectedAddress?.upazila || '',
        postalCode: selectedAddress?.postalCode || '',
      },
      shippingZone: selectedZone, // Zone is determined by user selection only
    };

    let isCancelled = false;
    setShippingLoading(true);
    setShippingError(null);

    getShippingQuote(quotePayload)
      .then((result) => {
        if (!isCancelled) {
          setShippingQuote({
            shippingFee: result.shippingFee,
            totalWeightKg: result.totalWeightKg,
            zone: result.zone,
          });
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setShippingQuote(null);
          const errorMessage = err instanceof Error ? err.message : "Failed to calculate shipping.";
          setShippingError(errorMessage);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setShippingLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [cart, selectedZone, selectedAddress]);

  const handleAddressSave = async (addressData: Address) => {
    setLoadingMessage("Adding new address...");
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
      setLoadingMessage(null);
      success("Address added successfully!", 5000);
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

    // For guest orders, validate guest info
    if (!user) {
      if (!guestInfo.name || !guestInfo.phone) {
        error("Please provide your name and phone number.", 5000);
        return;
      }
      if (!selectedAddress) {
        error("Please provide a shipping address.", 5000);
        return;
      }
    } else {
      if (!selectedAddress) {
        error("Please select a shipping address.", 5000);
        return;
      }
    }

    if (!selectedPaymentMethod) {
      error("Please select a payment method.", 5000);
      return;
    }

    if (shippingLoading) {
      error("Calculating shipping, please wait.", 5000);
      return;
    }

    if (!selectedZone) {
      error("Please select a delivery zone.", 5000);
      return;
    }

    if (!shippingQuote) {
      error("Unable to calculate shipping. Please select delivery zone.", 5000);
      return;
    }

    if (isSubmitting) {
      return; // Prevent double submission
    }

    setIsSubmitting(true);
    setLoadingMessage("Placing your order...");

    // Build shipping address - either from selected address or guest form
    let shippingAddressData;
    if (user && selectedAddress) {
      shippingAddressData = {
        address: selectedAddress.address,
        district: selectedAddress.district,
        upazila: selectedAddress.upazila,
        postalCode: selectedAddress.postalCode,
      };
    } else {
      // For guest orders, use the address form data
      shippingAddressData = {
        address: selectedAddress?.address || "",
        district: selectedAddress?.district || "",
        upazila: selectedAddress?.upazila || "",
        postalCode: selectedAddress?.postalCode || "",
      };
    }

    // Separate fish products from regular products
    // Fish products are identified by explicit flags (prioritized):
    // 1. isFishProduct flag (most reliable - set by backend)
    // 2. sizeCategories property (fish-specific structure)
    // 3. Category name is "মাছ" (Fish) - only if unit is kg (to avoid false positives)
    // 
    // Regular products will NOT have these flags, so they'll be correctly identified
    const fishProducts = cart.filter((item) => {
      const itemAny = item as any;
      
      // Primary check: Explicit isFishProduct flag (most reliable)
      if (itemAny.isFishProduct === true) {
        return true;
      }
      
      // Secondary check: sizeCategories property (fish-specific)
      if (itemAny.sizeCategories !== undefined && Array.isArray(itemAny.sizeCategories) && itemAny.sizeCategories.length > 0) {
        return true;
      }
      
      // Tertiary check: Category name + unit combination (more conservative)
      // Only classify as fish if BOTH category is "মাছ" AND unit is kg
      // This prevents regular products with kg unit from being misclassified
      const category = itemAny.category;
      const unit = item.unit || itemAny.unit;
      const categoryName = category && typeof category === 'object' ? (category as any).name : null;
      
      if (categoryName === 'মাছ' && unit === 'kg') {
        // Additional safety: check if variant also uses kg (fish products use kg for variants)
        if (item.variantSnapshot && (item.variantSnapshot as any).unit === 'kg') {
          return true;
        }
        // If no variant but category is fish and unit is kg, it's likely a fish product
        if (!item.variantSnapshot || !item.hasVariants) {
          return true;
        }
      }
      
      // Default: not a fish product (regular product)
      return false;
    });
    
    const regularProducts = cart.filter((item) => {
      return !fishProducts.includes(item);
    });

    const shippingFee = shippingQuote.shippingFee || 0;
    const grandTotal = cartTotal + shippingFee;

    try {
      let regularOrderId: string | null = null;
      let fishOrderId: string | null = null;
      let regularOrderTotal = 0;
      let fishOrderTotal = 0;

      // Calculate shipping fees separately for regular and fish products
      // The shipping quote breakdown contains separate fees for each product type
      const shippingBreakdown = (shippingQuote as any).breakdown;
      const regularShippingFee = shippingBreakdown?.regularShippingFee !== undefined 
        ? shippingBreakdown.regularShippingFee 
        : (fishProducts.length === 0 ? shippingFee : 0);
      
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
            paymentMethod:
              selectedPaymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
            totalPrice: regularOrderTotalPrice,
            totalAmount: regularOrderTotalPrice + regularShippingFee,
            shippingFee: regularShippingFee,
            shippingZone: selectedZone,
            shippingWeightKg: shippingQuote.totalWeightKg,
            ...(user ? {} : {
              guestInfo: {
                name: guestInfo.name,
                email: guestInfo.email || "",
                phone: guestInfo.phone,
              },
            }),
          };

          const newRegularOrder = await placeOrder(regularOrderData);
          regularOrderId = newRegularOrder._id || newRegularOrder.order?._id || newRegularOrder.data?._id || null;
          regularOrderTotal = regularOrderTotalPrice;
        } catch (regularOrderError) {
          // If regular order fails and we have fish products, still try to create fish order
          // but inform user about partial failure
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
              name: user ? (selectedAddress?.name || user.name) : guestInfo.name,
              phone: user ? (selectedAddress?.phone || user.phone) : guestInfo.phone,
              address: shippingAddressData.address,
              division: shippingAddressData.division,
              district: shippingAddressData.district,
              upazila: shippingAddressData.upazila,
              postalCode: shippingAddressData.postalCode,
            },
            paymentMethod:
              selectedPaymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
            totalPrice: fishOrderTotalPrice,
            ...(user ? {} : {
              guestInfo: {
                name: guestInfo.name,
                email: guestInfo.email || "",
                phone: guestInfo.phone,
              },
            }),
          };

          const newFishOrder: any = await fishOrderApi.create(fishOrderData);
          fishOrderId = newFishOrder?.fishOrder?._id || newFishOrder?._id || null;
          fishOrderTotal = fishOrderTotalPrice;
        } catch (fishOrderError) {
          // If fish order fails and we have regular products, inform user about partial success
          if (regularOrderId) {
            error(
              `Regular product order was created successfully, but fish product order failed. Please contact support with order ID: ${regularOrderId}. Error: ${fishOrderError instanceof Error ? fishOrderError.message : 'Unknown error'}`,
              8000
            );
            // Don't clear cart for fish products, allow retry
            const remainingCart = cart.filter((item) => {
              const itemAny = item as any;
              return itemAny.isFishProduct === true || 
                     (itemAny.sizeCategories !== undefined && Array.isArray(itemAny.sizeCategories) && itemAny.sizeCategories.length > 0);
            });
            // Clear only regular products from cart
            cart.forEach((item) => {
              const itemAny = item as any;
              const isFish = itemAny.isFishProduct === true || 
                            (itemAny.sizeCategories !== undefined && Array.isArray(itemAny.sizeCategories) && itemAny.sizeCategories.length > 0);
              if (!isFish) {
                removeFromCart(item.id || item._id);
              }
            });
            setLoadingMessage(null);
            setIsSubmitting(false);
            return;
          }
          throw fishOrderError;
        }
      }

      setLoadingMessage(null);

      // Handle payment for the primary order (regular if exists, otherwise fish)
      const primaryOrderId = regularOrderId || fishOrderId;
      
      if (!primaryOrderId) {
        throw new Error("Failed to create order");
      }

      if (selectedPaymentMethod === "sslcommerz") {
        // For now, only handle payment for regular orders
        // Fish orders payment handling may need separate implementation
        if (regularOrderId) {
          const paymentResult = await createPaymentSession({
            orderId: regularOrderId,
            paymentMethod: "SSL Commerz",
          });

          if (paymentResult.success) {
            // Redirect to SSL Commerz payment page
            window.location.href = paymentResult.paymentUrl;
          } else {
            error("Failed to create payment session. Please try again.", 5000);
          }
        } else {
          // Fish order with online payment - may need separate handling
          error("Online payment for fish orders is not yet supported. Please use Cash on Delivery.", 5000);
        }
      } else {
        // Cash on Delivery - proceed to success page
        const orderMessage = regularProducts.length > 0 && fishProducts.length > 0
          ? "Orders placed successfully! (Regular and Fish orders created)"
          : "Order placed successfully!";
        
        success(orderMessage, 3000);
        clearCart();
        
        // Redirect to success page with primary order ID
        router.push(`/order/success?orderId=${primaryOrderId}`);
      }
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

  const loading = authLoading || cartLoading;
  const shippingFee = shippingQuote?.shippingFee ?? 0;
  const grandTotal = cartTotal + shippingFee;

  // Guest checkout form state
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  if (cart.length === 0 && !cartLoading) {
    return (
      <div className="text-center min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-amber-20 to-yellow-20 px-4">
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
    <div className="bg-gradient-to-br from-amber-20 to-yellow-20 min-h-screen pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <CheckoutProgress currentStep={checkoutStep} />

        {/* Inline Messages */}
        <div className="mt-6 space-y-2">
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

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Left Side: Address & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Guest Information Form (for non-logged-in users) */}
            {!user && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
                  Your Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={guestInfo.name}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Zone Selection */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
                Delivery Zone
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setSelectedZone('inside_dhaka')}
                  className={`p-4 border-2 rounded-xl font-semibold transition-all ${
                    selectedZone === 'inside_dhaka'
                      ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-green-300 text-gray-700'
                  }`}
                >
                  Inside Dhaka
                </button>
                <button
                  onClick={() => setSelectedZone('outside_dhaka')}
                  className={`p-4 border-2 rounded-xl font-semibold transition-all ${
                    selectedZone === 'outside_dhaka'
                      ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-green-300 text-gray-700'
                  }`}
                >
                  Outside Dhaka
                </button>
              </div>
              {!selectedZone && (
                <p className="text-sm text-gray-500">
                  Please select your delivery zone to calculate shipping
                </p>
              )}
            </div>

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
                  {user ? (
                    <>
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
                    </>
                  ) : (
                    <div>
                      <AddressForm
                        initial={null}
                        onClose={() => {}}
                        onSave={(addressData) => {
                          setSelectedAddress(addressData);
                          success("Address saved!", 3000);
                        }}
                      />
                    </div>
                  )}
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
                      ৳{formatAmount(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t-2 border-dashed pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">৳{formatAmount(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shippingLoading
                      ? "Calculating..."
                      : !selectedZone
                      ? "Select zone"
                      : shippingQuote
                      ? `৳${formatAmount(shippingFee)}`
                      : "—"}
                  </span>
                </div>
                {shippingQuote && (
                  <p className="text-xs text-gray-500">
                    {selectedZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"} ·{" "}
                    {shippingQuote.totalWeightKg.toFixed(2)} kg
                  </p>
                )}
                {shippingError && (
                  <p className="text-xs text-red-500">{shippingError}</p>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 mt-3 border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>৳{formatAmount(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handlePlaceOrder}
                  disabled={
                    cart.length === 0 ||
                    (!user && (!guestInfo.name || !guestInfo.phone)) ||
                    (user && !selectedAddress) ||
                    (!user && !selectedAddress) ||
                    !selectedZone ||
                    !selectedPaymentMethod ||
                    shippingLoading ||
                    !shippingQuote ||
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
