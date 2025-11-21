"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentContainer from "@/components/ContentContainer";
import MobileBottomNav from "@/components/MobileBottomNav";
import ChatWidget from "../components/ChatWidget";
import CartSidebarWrapper from "@/components/CartSidebarWrapper";

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // For dashboard routes, render only the children (dashboard has its own layout)
  if (isDashboard) {
    return (
      <>
        <CartSidebarWrapper />
        {children}
      </>
    );
  }

  // For regular routes, render with Navbar, Footer, etc.
  return (
    <>
      <CartSidebarWrapper />
      <div className="w-full">
        <Navbar />
      </div>
      <main className="flex-grow flex justify-center bg-gradient-to-br from-amber-20 to-yellow-20 pb-16 md:pb-0">
        <ContentContainer>
          {children}
        </ContentContainer>
      </main>
      <div className="w-full">
        <Footer />
      </div>
      {/* Chat Widget - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block">
        <ChatWidget />
      </div>
      {/* Mobile Bottom Navigation - Rendered last to ensure it's on top */}
      <MobileBottomNav />
    </>
  );
}

