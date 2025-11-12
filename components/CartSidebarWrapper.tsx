"use client";

import { useCart } from "@/app/context/CartContext";
import CartSidebar from "./CartSidebar";

export default function CartSidebarWrapper() {
  const { isSidebarOpen, closeSidebar } = useCart();

  return <CartSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />;
}

