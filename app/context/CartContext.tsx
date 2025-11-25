"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode, useCallback } from "react";
import { CartContextType } from "@/types/context";
import { CartItem, Product, ProductVariant } from "@/types/models";

function normalizeMeasurement(value?: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 1;
  }
  return value > 0 ? value : 1;
}

function getMeasurementInfo(product: Product | CartItem, variantId?: string) {
  if (product.hasVariants && variantId) {
    const variant = product.variants?.find((v) => v._id === variantId) || (product as CartItem).variantSnapshot;
    if (variant) {
      return {
        measurement: normalizeMeasurement(variant.measurement),
        unit: variant.unit || product.unit,
      };
    }
  }
  return {
    measurement: normalizeMeasurement(product.measurement),
    unit: product.unit,
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        const parsedCart = JSON.parse(stored) as CartItem[];
        setCart(parsedCart);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem("cart", JSON.stringify(cart));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cart, loading]);

  // Add item to cart
  function addToCart(product: Product, qty = 1, variantId?: string) {
    try {
      setCart((prev) => {
        const id = product.id || product._id;
        const measurementInfo = getMeasurementInfo(product, variantId);
        
        // Find matching item (same product and same variant)
        const idx = prev.findIndex((item) => {
          const itemId = item.id || item._id;
          const itemVariantId = item.variantId;
          
          // Must match product ID
          if (itemId !== id) return false;
          
          // If product has variants, must match variant ID
          if (product.hasVariants) {
            return itemVariantId === variantId;
          }
          
          // For non-variant products, no variant should be set
          return !itemVariantId;
        });
        
        if (idx > -1) {
          const updated = [...prev];
          updated[idx].quantity += qty;
          if (measurementInfo) {
            updated[idx].totalMeasurement = (updated[idx].totalMeasurement || 0) + measurementInfo.measurement * qty;
          }
          return updated;
        }
        
        // Create new cart item with variant info if applicable
        const newItem: CartItem = {
          ...product,
          id: id,
          quantity: qty,
          totalMeasurement: measurementInfo ? measurementInfo.measurement * qty : qty,
          unitWeightKg: product.unitWeightKg,
        };
        
        if (product.hasVariants && variantId) {
          const variant = product.variants?.find((v) => v._id === variantId);
          if (variant) {
            newItem.variantId = variantId;
            newItem.variantSnapshot = variant;
            // Override price and stock with variant values
            newItem.price = variant.price;
            newItem.stock = variant.stock;
            newItem.measurement = variant.measurement;
            newItem.unit = variant.unit;
            newItem.measurementIncrement = variant.measurementIncrement;
            newItem.unitWeightKg = variant.unitWeightKg ?? product.unitWeightKg;
          }
        }
        
        return [...prev, newItem];
      });
      // Open sidebar when item is added
      setIsSidebarOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }

  function updateQuantity(id: string, quantity: number, variantId?: string) {
    try {
      if (quantity < 1) {
        removeFromCart(id, variantId);
        return;
      }
      setCart((prev) =>
        prev.map((item) => {
          const itemId = item.id || item._id;
          const itemVariantId = item.variantId;
          
          // Match by product ID and variant ID
          if (itemId === id && itemVariantId === variantId) {
            const measurementInfo = getMeasurementInfo(item, variantId);
            return { 
              ...item, 
              quantity,
              totalMeasurement: measurementInfo ? measurementInfo.measurement * quantity : quantity,
            };
          }
          return item;
        })
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }

  function removeFromCart(id: string, variantId?: string) {
    try {
      setCart((prev) =>
        prev.filter((item) => {
          const itemId = item.id || item._id;
          const itemVariantId = item.variantId;
          
          // Remove if product ID matches and variant ID matches (or both are undefined)
          if (itemId !== id) return true;
          return itemVariantId !== variantId;
        })
      );
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  }

  function clearCart() {
    try {
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }

  // Memoize expensive calculations to prevent recalculation on every render
  // Price is already for the measurement amount (e.g., 800 BDT for 500g), so we only multiply by quantity
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => {
      const price = item.variantSnapshot?.price || item.price;
      return sum + price * item.quantity;
    }, 0),
    [cart]
  );
  
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const getItemDisplayQuantity = useCallback((item: CartItem) => {
    const info = getMeasurementInfo(item, item.variantId);
    const totalMeasurement = item.totalMeasurement ?? info.measurement * item.quantity;
    const unitLabel = info.unit || "unit";
    return {
      value: totalMeasurement,
      unit: unitLabel,
      displayText: `${totalMeasurement} ${unitLabel}`,
    };
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
      getItemDisplayQuantity,
      isSidebarOpen,
      openSidebar: () => setIsSidebarOpen(true),
      closeSidebar: () => setIsSidebarOpen(false),
    }),
    [cart, loading, cartTotal, cartCount, isSidebarOpen, getItemDisplayQuantity]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

