"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, MessageCircle, User } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, openSidebar } = useCart();
  const { user } = useAuth();

  // Don't show on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const handleChatClick = () => {
    // Open WhatsApp chat
    const phoneNumber = "8801234567890"; // Replace with your WhatsApp number
    const message = "Hello! I need help with Prokrishi.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/"
    },
    {
      name: "Cart",
      href: "#",
      icon: ShoppingCart,
      isActive: false,
      badge: cartCount > 0 ? cartCount : null,
      onClick: openSidebar
    },
    {
      name: "Chat",
      href: "#",
      icon: MessageCircle,
      isActive: false,
      onClick: handleChatClick
    },
    {
      name: "Account",
      href: user ? "/account" : "/login",
      icon: User,
      isActive: pathname === "/account" || pathname === "/login"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;
          
          const content = (
            <div className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1">
              <div className="relative">
                <Icon 
                  size={24} 
                  className={`transition-colors duration-200 ${
                    isActive 
                      ? "text-green-600" 
                      : "text-gray-500"
                  }`} 
                />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center font-medium">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 transition-colors duration-200 ${
                isActive 
                  ? "text-green-600 font-medium" 
                  : "text-gray-500"
              }`}>
                {item.name}
              </span>
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={item.name}
                onClick={item.onClick}
                className="w-full"
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={item.name} href={item.href} className="w-full">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
