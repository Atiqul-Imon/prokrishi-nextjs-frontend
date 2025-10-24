"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  BarChart2,
  Settings,
  User,
  LogOut,
  Home,
  Image,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Categories", href: "/dashboard/categories", icon: Tag },
  { label: "Media Gallery", href: "/dashboard/media", icon: Image },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

interface SidebarProps {
  current?: string;
}

export default function Sidebar({ current }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="bg-white border-r border-gray-200 min-h-screen w-64 sm:w-72 flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-lg">P</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Prokrishi</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon 
                    size={18} 
                    className={`transition-colors ${
                      isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                    }`} 
                  />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Home size={18} />
          <span className="font-medium text-sm sm:text-base">Back to Site</span>
        </Link>
        <div className="mt-4 text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Prokrishi. All rights reserved.
        </div>
      </div>
    </aside>
  );
}
