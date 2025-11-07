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
    <aside className="bg-slate-900 border-r-2 border-slate-800 min-h-screen w-64 sm:w-72 flex flex-col">
      {/* Logo Section */}
      <div className="p-5 sm:p-6 border-b-2 border-slate-800">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-lg flex items-center justify-center border-2 border-emerald-500">
            <span className="text-white font-bold text-lg sm:text-xl">P</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">Prokrishi</h1>
            <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                    isActive
                      ? "bg-emerald-600 text-white border-l-4 border-emerald-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white border-l-4 border-transparent"
                  }`}
                >
                  <item.icon 
                    size={20} 
                    className={isActive ? "text-white" : "text-slate-400"}
                  />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t-2 border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white border-l-4 border-transparent"
        >
          <Home size={20} className="text-slate-400" />
          <span className="font-medium text-sm sm:text-base">Back to Site</span>
        </Link>
        <div className="mt-4 text-xs text-slate-500 text-center font-medium">
          &copy; {new Date().getFullYear()} Prokrishi. All rights reserved.
        </div>
      </div>
    </aside>
  );
}
