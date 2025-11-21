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
  Filter,
  Zap,
  HelpCircle,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
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

  // Keyboard shortcuts
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
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300"
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Control Center</p>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                {user?.name ? `Welcome back, ${user.name}` : "Welcome back"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search across products, orders..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-500 w-72 text-sm"
                />
              </div>
              <button
                onClick={() => setShowCommandPalette(true)}
                className="hidden xl:flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
              >
                <Zap size={16} />
                Shortcuts
                <span className="text-xs text-slate-400 border border-slate-200 rounded px-1 py-0.5">⌘K</span>
              </button>
            </div>

            <div className="relative" ref={quickActionsRef}>
              <button
                onClick={() => setShowQuickActions((prev) => !prev)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-sm hover:bg-emerald-700"
              >
                <Plus size={16} />
                New
              </button>
              {showQuickActions && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-50">
                  <div className="py-2">
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      onClick={() => {
                        window.location.href = "/dashboard/products/add";
                        setShowQuickActions(false);
                      }}
                    >
                      <Plus size={16} className="text-emerald-500" />
                      New product
                    </button>
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      onClick={() => {
                        window.location.href = "/dashboard/orders";
                        setShowQuickActions(false);
                      }}
                    >
                      <ShoppingBag size={16} className="text-emerald-500" />
                      Quick order
                    </button>
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      onClick={() => {
                        window.location.href = "/dashboard/media";
                        setShowQuickActions(false);
                      }}
                    >
                      <Filter size={16} className="text-emerald-500" />
                      Upload media
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600"
            >
              <HelpCircle size={18} />
              Support
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-emerald-600 rounded-lg border border-slate-200 hover:border-emerald-300"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 block w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                    <h3 className="text-sm font-semibold text-slate-700">Notifications</h3>
                    <span className="text-xs text-emerald-600 font-medium">Mark all read</span>
                  </div>
                  <div className="p-6 text-center text-slate-500">
                    <Bell size={30} className="mx-auto mb-3 text-slate-300" />
                    You're all caught up!
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-3 hover:border-emerald-300"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-sm font-semibold">
                  {user?.name?.[0] || "A"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || "Admin"}</p>
                  <span className="text-xs text-slate-400">Administrator</span>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">{user?.name || "Admin"}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
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

      {showCommandPalette && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 flex items-start justify-center pt-24 px-4"
          onClick={() => setShowCommandPalette(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-100 px-4 py-3 flex items-center gap-3">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search anything or jump to a page..."
                className="w-full outline-none text-sm"
              />
              <span className="text-xs text-slate-400 border border-slate-200 rounded px-2 py-0.5">Esc</span>
            </div>
            <div className="py-2">
              <p className="px-4 py-2 text-xs uppercase tracking-wide text-slate-400">Quick Actions</p>
              <div className="flex flex-col">
                <Link
                  href="/dashboard/products/add"
                  className="px-4 py-2 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setShowCommandPalette(false)}
                >
                  <Package size={16} />
                  Add new product
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="px-4 py-2 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setShowCommandPalette(false)}
                >
                  <ShoppingBag size={16} />
                  Review latest orders
                </Link>
                <Link
                  href="/dashboard/customers"
                  className="px-4 py-2 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50"
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
