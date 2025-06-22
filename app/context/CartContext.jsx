"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        const parsedCart = JSON.parse(stored);
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

  // Only use item.id for matching
  function addToCart(product, qty = 1) {
    try {
      setCart((prev) => {
        const idx = prev.findIndex((item) => item.id === product.id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx].quantity += qty;
          toast.success(`Updated ${product.name} quantity`);
          return updated;
        }
        toast.success(`${product.name} added to cart`);
        return [...prev, { ...product, quantity: qty }];
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  }

  function updateQuantity(id, quantity) {
    try {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
        ),
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  }

  function removeFromCart(id) {
    try {
      setCart((prev) => {
        const itemToRemove = prev.find((item) => item.id === id);
        if (itemToRemove) {
          toast.success(`${itemToRemove.name} removed from cart`);
        }
        return prev.filter((item) => item.id !== id);
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  }

  function clearCart() {
    try {
      setCart([]);
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  }

  // Calculate cart totals
  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
