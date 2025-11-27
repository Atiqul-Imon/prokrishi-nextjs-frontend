"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && !isAdmin) {
      router.push("/unauthorized");
    }
  }, [user, isAdmin, loading, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50">
        <div className="relative">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-800 h-32 w-32"></div>
          <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-amber-600 animate-spin"></div>
        </div>
        <style>{`
          .loader {
            border-top-color: #f59e0b;
            animation: spinner 1.5s linear infinite;
          }
          @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <>
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-slate-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 text-gray-900 flex font-roboto relative">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Mobile sidebar */}
        <Sidebar isMobile isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-h-screen lg:ml-72 xl:ml-80">
          <Header onToggleSidebar={() => setSidebarOpen(true)} />
          <main
            id="dashboard-main"
            className="flex-1 overflow-x-hidden px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 bg-transparent scroll-smooth"
            style={{ scrollBehavior: "smooth", minHeight: 0 }}
          >
            <div className="w-full max-w-full space-y-4 sm:space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
