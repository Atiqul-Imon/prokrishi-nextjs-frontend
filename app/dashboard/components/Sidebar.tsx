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
  Home,
  Image,
  X,
  Sparkles,
  ChevronRight,
  Fish,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, gradient: "from-blue-500 to-cyan-500" },
  { label: "Products", href: "/dashboard/products", icon: Package, gradient: "from-emerald-500 to-teal-500" },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag, gradient: "from-amber-500 to-orange-500" },
  { label: "Customers", href: "/dashboard/customers", icon: Users, gradient: "from-indigo-500 to-blue-500" },
  { label: "Categories", href: "/dashboard/categories", icon: Tag, gradient: "from-orange-500 to-red-500" },
  { label: "Media", href: "/dashboard/media", icon: Image, gradient: "from-amber-500 to-orange-500" },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart2, gradient: "from-rose-500 to-pink-500" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, gradient: "from-gray-500 to-slate-500" },
  { label: "Profile", href: "/dashboard/profile", icon: User, gradient: "from-cyan-500 to-blue-500" },
];

const fishNavItems = [
  { label: "Fish Products", href: "/dashboard/fish/products", icon: Fish, gradient: "from-blue-500 to-cyan-500" },
  { label: "Fish Orders", href: "/dashboard/fish/orders", icon: ShoppingCart, gradient: "from-amber-500 to-orange-500" },
];

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="px-8 py-8">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/50 group-hover:scale-110 group-hover:shadow-amber-500/70 transition-all duration-500">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500"></div>
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent">
              Prokrishi
            </h1>
            <p className="text-xs text-gray-300 font-semibold tracking-wider uppercase">Admin Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const isHovered = hoveredItem === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={isMobile ? onClose : undefined}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white shadow-lg shadow-amber-500/10"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-amber-400 to-orange-400 rounded-r-full shadow-lg shadow-amber-500/50"></div>
                  )}
                  
                  {/* Hover gradient effect */}
                  {isHovered && !isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-2xl blur-md`}></div>
                  )}
                  
                  {/* Icon container */}
                  <div className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                      : "bg-gray-700/50 group-hover:bg-gray-700"
                  }`}>
                    <item.icon 
                      size={20} 
                      className={isActive ? "text-white" : "text-gray-300 group-hover:text-white"}
                    />
                  </div>
                  
                  <span className="relative text-sm font-semibold flex-1 text-white">{item.label}</span>
                  
                  {isActive && (
                    <ChevronRight size={16} className="text-amber-300" />
                  )}
                  
                  {/* Active glow */}
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 rounded-2xl blur-xl -z-10`}></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Fish Management Section */}
        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <div className="px-4 mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fish Management</h3>
          </div>
          <ul className="space-y-2">
            {fishNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const isHovered = hoveredItem === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={isMobile ? onClose : undefined}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white shadow-lg shadow-amber-500/10"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-amber-400 to-orange-400 rounded-r-full shadow-lg shadow-amber-500/50"></div>
                    )}
                    
                    {/* Hover gradient effect */}
                    {isHovered && !isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-2xl blur-md`}></div>
                    )}
                    
                    {/* Icon container */}
                    <div className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                        : "bg-gray-700/50 group-hover:bg-gray-700"
                    }`}>
                      <item.icon 
                        size={20} 
                        className={isActive ? "text-white" : "text-gray-300 group-hover:text-white"}
                      />
                    </div>
                    
                    <span className="relative text-sm font-semibold flex-1 text-white">{item.label}</span>
                    
                    {isActive && (
                      <ChevronRight size={16} className="text-amber-300" />
                    )}
                    
                    {/* Active glow */}
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 rounded-2xl blur-xl -z-10`}></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-6">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all group"
        >
          <div className="p-2 rounded-xl bg-gray-700/50 group-hover:bg-gray-700 transition-colors">
            <Home size={18} />
          </div>
          <span className="text-sm font-semibold text-gray-300">Back to Site</span>
        </Link>
        <div className="mt-4 px-4 text-xs text-gray-400 text-center font-medium">
          &copy; {new Date().getFullYear()} Prokrishi
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-gray-800 via-gray-800/95 to-gray-900 z-50 transform transition-transform duration-300 ease-out lg:hidden shadow-2xl ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ top: 0, bottom: 0, height: '100vh' }}
        >
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-white">Prokrishi</h1>
                <p className="text-xs text-gray-300">Admin</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <div className="h-[calc(100vh-100px)] overflow-y-auto">
            {sidebarContent}
          </div>
        </aside>
      </>
    );
  }

  return (
    <aside
      className="hidden lg:flex fixed inset-y-0 left-0 w-72 xl:w-80 z-40"
      aria-label="Dashboard sidebar"
    >
      <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 flex flex-col shadow-2xl">
        {sidebarContent}
      </div>
    </aside>
  );
}
