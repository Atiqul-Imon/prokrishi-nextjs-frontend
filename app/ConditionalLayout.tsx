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
    return <>{children}</>;
  }

  // For regular routes, render with Navbar, Footer, etc.
  return (
    <>
      <CartSidebarWrapper />
      <Navbar />
      <main className="flex-grow w-full bg-gradient-to-br from-amber-20 to-yellow-20 pb-16 md:pb-0">
        <ContentContainer>
          {children}
        </ContentContainer>
      </main>
      <Footer />
      {/* Chat Widget - Floating on desktop, fixed on mobile */}
      <ChatWidget />
      {/* Mobile Bottom Navigation - Rendered last to ensure it's on top */}
      <MobileBottomNav />
    </>
  );
}

