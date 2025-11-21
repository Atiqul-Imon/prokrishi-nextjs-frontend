"use client";

import {
  Bell,
  User,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  Plus,
  Zap,
  HelpCircle,
  Package,
  ShoppingBag,
  Users,
  Command,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setShowQuickActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setShowCommandPalette(true);
      } else if (event.key === "Escape") {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl shadow-lg w-full">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2.5 rounded-xl border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-400 transition-all"
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-600 font-black">Control Center</p>
              <h1 className="text-xl font-black text-gray-900">
                {user?.name ? `Welcome, ${user.name.split(' ')[0]}` : "Welcome back"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 w-80 text-sm font-medium transition-all"
                />
              </div>
              <button
                onClick={() => setShowCommandPalette(true)}
                className="hidden xl:flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
              >
                <Command size={16} />
                <span className="text-xs text-gray-600 border border-gray-300 rounded px-1.5 py-0.5 bg-gray-100 font-medium">⌘K</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="relative" ref={quickActionsRef}>
              <button
                onClick={() => setShowQuickActions((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-bold shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all"
              >
                <Plus size={16} />
                New
              </button>
              {showQuickActions && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl z-50">
                  <div className="py-2">
                    <Link
                      href="/dashboard/products/add"
                      className="flex items-center gap-4 px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                      onClick={() => setShowQuickActions(false)}
                    >
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                        <Package size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">New Product</p>
                        <p className="text-xs text-gray-700">Add a product</p>
                      </div>
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      className="flex items-center gap-4 px-4 py-3.5 text-sm text-gray-800 hover:bg-gray-50 transition-colors group"
                      onClick={() => setShowQuickActions(false)}
                    >
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                        <ShoppingBag size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Quick Order</p>
                        <p className="text-xs text-gray-700">View orders</p>
                      </div>
                    </Link>
                    <Link
                      href="/dashboard/customers"
                      className="flex items-center gap-4 px-4 py-3.5 text-sm text-gray-800 hover:bg-gray-50 transition-colors group"
                      onClick={() => setShowQuickActions(false)}
                    >
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                        <Users size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">View Customers</p>
                        <p className="text-xs text-gray-700">Manage users</p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <button className="hidden lg:flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all font-medium">
              <HelpCircle size={18} />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 hover:text-gray-900 hover:bg-gray-50 transition-all"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 block w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/50"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl border border-gray-200 shadow-xl z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                    <span className="text-xs text-amber-600 font-semibold cursor-pointer hover:text-amber-700">Mark all read</span>
                  </div>
                  <div className="p-8 text-center text-gray-700">
                    <Bell size={36} className="mx-auto mb-3 text-gray-500" />
                    <p className="font-bold text-gray-900">All caught up!</p>
                    <p className="text-xs mt-1 text-gray-600">No new notifications</p>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white p-1.5 pr-3 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-amber-500/30">
                  {user?.name?.[0] || "A"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || "Admin"}</p>
                  <span className="text-xs text-gray-700">Administrator</span>
                </div>
                <ChevronDown size={16} className="text-gray-700" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl z-50">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                    <p className="text-sm font-bold text-gray-900">{user?.name || "Admin"}</p>
                    <p className="text-xs text-gray-700">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 transition-colors font-medium"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 transition-colors font-medium"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-700 hover:bg-rose-50 transition-colors font-medium"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      {showCommandPalette && (
        <div
          className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-40 flex items-start justify-center pt-32 px-4"
          onClick={() => setShowCommandPalette(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-3 bg-gray-50 rounded-t-2xl">
              <Search size={18} className="text-gray-600" />
              <input
                type="text"
                autoFocus
                placeholder="Search anything or jump to a page..."
                className="w-full outline-none text-sm bg-transparent text-gray-900 placeholder-gray-600 font-medium"
              />
              <span className="text-xs text-gray-600 border border-gray-300 rounded px-2 py-0.5 bg-gray-100 font-medium">Esc</span>
            </div>
            <div className="py-2">
              <p className="px-4 py-2 text-xs uppercase tracking-wider text-gray-600 font-bold">Quick Actions</p>
              <div className="flex flex-col">
                <Link
                  href="/dashboard/products/add"
                  className="px-4 py-3 flex items-center gap-3 text-sm text-gray-800 hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setShowCommandPalette(false)}
                >
                  <Package size={16} />
                  Add new product
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="px-4 py-3 flex items-center gap-3 text-sm text-gray-800 hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setShowCommandPalette(false)}
                >
                  <ShoppingBag size={16} />
                  Review latest orders
                </Link>
                <Link
                  href="/dashboard/customers"
                  className="px-4 py-3 flex items-center gap-3 text-sm text-gray-800 hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setShowCommandPalette(false)}
                >
                  <Users size={16} />
                  View customers
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
