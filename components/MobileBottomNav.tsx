"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, MessageCircle, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  badge?: number | null;
  onClick?: (() => void) | null;
};

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
    const phoneNumber = "8801748027775";
    const message = "Hello! I need help with Prokrishi.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "Cart",
      href: "#",
      icon: ShoppingCart,
      isActive: false,
      badge: cartCount > 0 ? cartCount : null,
      onClick: openSidebar,
    },
    {
      name: "Chat",
      href: "#",
      icon: MessageCircle,
      isActive: false,
      onClick: handleChatClick,
    },
    {
      name: "Account",
      href: user ? "/account" : "/login",
      icon: User,
      isActive: pathname === "/account" || pathname === "/login",
    }
  ];

  return (
    <div 
      className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-2px_20px_rgba(0,0,0,0.08)] md:hidden safe-area-inset-bottom" 
      style={{ position: 'fixed', zIndex: 9999, transform: 'translateZ(0)' }}
    >
      <div className="flex items-center justify-around px-2 sm:px-3 py-2 sm:py-2.5 gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;
          
          const content = (
            <div
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 sm:px-4 min-w-0 flex-1 touch-manipulation rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-gray-50" 
                  : "hover:bg-gray-50/50 active:bg-gray-50"
              }`}
            >
              <div className="relative">
                <Icon 
                  size={22} 
                  className={`sm:w-6 sm:h-6 transition-all duration-300 ${
                    isActive 
                      ? "text-gray-700 scale-110" 
                      : "text-gray-400 scale-100"
                  }`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-gray-700 text-white text-[10px] sm:text-xs rounded-full px-1.5 sm:px-2 py-0.5 min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] flex items-center justify-center font-semibold shadow-lg ring-2 ring-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] sm:text-xs mt-1 transition-all duration-300 truncate w-full text-center font-medium ${
                isActive 
                  ? "text-gray-700" 
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
                className="w-full min-h-[64px] sm:min-h-[68px] flex items-center justify-center relative"
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
              className="w-full min-h-[64px] sm:min-h-[68px] flex items-center justify-center relative"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
