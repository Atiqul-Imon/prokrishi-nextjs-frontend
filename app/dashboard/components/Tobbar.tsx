"use client";

import { Bell, User, Search, Settings, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Topbar() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-slate-900">Dashboard</div>
          <div className="hidden md:block text-sm text-slate-600 font-medium">
            Welcome back, {user?.name || "Admin"}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-slate-50 w-64 text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border-2 border-transparent hover:border-emerald-200"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 block w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border-2 border-slate-200 z-50">
                <div className="p-4 border-b-2 border-slate-200 bg-slate-50">
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-6 text-center text-slate-500">
                    <Bell size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-medium">No new notifications</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg border-2 border-transparent hover:border-slate-200"
            >
              <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-emerald-500">
                <User size={18} className="text-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-bold text-slate-900">{user?.name || "Admin"}</div>
                <div className="text-xs text-slate-500 font-medium">Administrator</div>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border-2 border-slate-200 z-50">
                <div className="py-2">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} className="mr-3 text-slate-500" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} className="mr-3 text-slate-500" />
                    Settings
                  </Link>
                  <div className="border-t-2 border-slate-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
