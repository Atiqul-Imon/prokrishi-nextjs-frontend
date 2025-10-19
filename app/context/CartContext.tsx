"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import toast from "react-hot-toast";
import { CartContextType } from "@/types/context";
import { CartItem, Product } from "@/types/models";

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      toast.error("Failed to load your cart items");
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
        toast.error("Failed to save your cart");
      }
    }
  }, [cart, loading]);

  // Add item to cart
  function addToCart(product: Product, qty = 1) {
    try {
      setCart((prev) => {
        const id = product.id || product._id;
        const idx = prev.findIndex((item) => (item.id || item._id) === id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx].quantity += qty;
          // Removed toast notification for quantity update
          return updated;
        }
        // Removed toast notification for adding to cart
        return [...prev, { ...product, id: id, quantity: qty }];
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  }

  function updateQuantity(id: string, quantity: number) {
    try {
      if (quantity < 1) {
        removeFromCart(id);
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          (item.id || item._id) === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  }

  function removeFromCart(id: string) {
    try {
      setCart((prev) => {
        const item = prev.find((i) => (i.id || i._id) === id);
        if (item) {
          toast.success(`${item.name} removed from cart`);
        }
        return prev.filter((item) => (item.id || item._id) !== id);
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  }

  function clearCart() {
    try {
      setCart([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  }

  // Memoize expensive calculations to prevent recalculation on every render
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

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
    }),
    [cart, loading, cartTotal, cartCount]
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

