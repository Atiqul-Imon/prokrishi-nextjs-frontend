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
    <div 
      className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-gray-200 shadow-lg md:hidden safe-area-inset-bottom" 
      style={{ position: 'fixed', zIndex: 9999, transform: 'translateZ(0)' }}
    >
      <div className="flex items-center justify-around px-1 sm:px-2 py-1.5 sm:py-2 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;
          
          const content = (
            <div className="flex flex-col items-center justify-center py-1.5 sm:py-2 px-2 sm:px-3 min-w-0 flex-1 touch-manipulation">
              <div className="relative">
                <Icon 
                  size={20} 
                  className={`sm:w-6 sm:h-6 transition-colors duration-200 ${
                    isActive 
                      ? "text-green-600" 
                      : "text-gray-500"
                  }`} 
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-green-600 text-white text-[10px] sm:text-xs rounded-full px-1 sm:px-1.5 py-0.5 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center font-medium shadow-md">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 transition-colors duration-200 truncate w-full text-center ${
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
                className="w-full min-h-[60px] sm:min-h-[64px] flex items-center justify-center active:bg-gray-50 rounded-lg transition-colors"
                aria-label={item.name}
              >
                {content}
              </button>
            );
          }

          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className="w-full min-h-[60px] sm:min-h-[64px] flex items-center justify-center active:bg-gray-50 rounded-lg transition-colors"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
