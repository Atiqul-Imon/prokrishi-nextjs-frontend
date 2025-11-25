"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, MessageCircle, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

type NavItemColors = {
  bg?: string;
  activeBg?: string;
  icon?: string;
  iconInactive?: string;
  text?: string;
  textInactive?: string;
};

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  badge?: number | null;
  onClick?: (() => void) | null;
  colors?: NavItemColors;
  badgeColor?: string;
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
      colors: {
        bg: "bg-gradient-to-br from-green-50 to-green-100",
        activeBg: "bg-gradient-to-br from-green-100 to-green-200 shadow-inner shadow-green-200/60",
        icon: "text-green-700",
        iconInactive: "text-green-600",
        text: "text-green-800",
        textInactive: "text-green-600",
      },
      badgeColor: "bg-green-600",
    },
    {
      name: "Cart",
      href: "#",
      icon: ShoppingCart,
      isActive: false,
      badge: cartCount > 0 ? cartCount : null,
      onClick: openSidebar,
      colors: {
        bg: "bg-gradient-to-br from-amber-50 to-orange-50",
        activeBg: "bg-gradient-to-br from-amber-100 to-orange-100 shadow-inner shadow-orange-200/60",
        icon: "text-orange-600",
        iconInactive: "text-orange-500",
        text: "text-orange-700",
        textInactive: "text-orange-600",
      },
      badgeColor: "bg-orange-500",
    },
    {
      name: "Chat",
      href: "#",
      icon: MessageCircle,
      isActive: false,
      onClick: handleChatClick,
      colors: {
        bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
        activeBg: "bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-inner shadow-emerald-200/60",
        icon: "text-emerald-600",
        iconInactive: "text-emerald-500",
        text: "text-emerald-700",
        textInactive: "text-emerald-600",
      },
    },
    {
      name: "Account",
      href: user ? "/account" : "/login",
      icon: User,
      isActive: pathname === "/account" || pathname === "/login",
      colors: {
        bg: "bg-gradient-to-br from-indigo-50 to-sky-50",
        activeBg: "bg-gradient-to-br from-indigo-100 to-sky-100 shadow-inner shadow-indigo-200/60",
        icon: "text-indigo-600",
        iconInactive: "text-indigo-500",
        text: "text-indigo-700",
        textInactive: "text-indigo-600",
      },
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
          
          const colors = item.colors || {};
          const content = (
            <div
              className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-2 sm:px-3 min-w-0 flex-1 touch-manipulation rounded-2xl transition-all duration-200 ${
                isActive ? colors.activeBg ?? "bg-green-100" : colors.bg ?? "bg-gray-50"
              }`}
            >
              <div className="relative">
                <Icon 
                  size={20} 
                  className={`sm:w-6 sm:h-6 transition-colors duration-200 ${
                    isActive 
                      ? colors.icon ?? "text-green-600" 
                      : colors.iconInactive ?? "text-gray-500"
                  }`} 
                />
                {item.badge && (
                  <span className={`absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 ${item.badgeColor ?? "bg-green-600"} text-white text-[10px] sm:text-xs rounded-full px-1 sm:px-1.5 py-0.5 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center font-medium shadow-md`}>
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 transition-colors duration-200 truncate w-full text-center ${
                isActive 
                  ? `${colors.text ?? "text-green-700"} font-semibold` 
                  : colors.textInactive ?? "text-gray-500"
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
                className="w-full min-h-[60px] sm:min-h-[64px] flex items-center justify-center active:bg-transparent rounded-2xl transition-colors"
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
              className="w-full min-h-[60px] sm:min-h-[64px] flex items-center justify-center active:bg-transparent rounded-2xl transition-colors"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
