"use client";

import { Bell, User } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  // For demonstration, static admin name; replace with real user data
  const admin = { name: "Admin" };

  return (
    <header className="sticky top-0 z-30 bg-white border-b flex items-center justify-between px-6 py-4">
      <div className="text-lg font-semibold text-green-600">Dashboard</div>
      <div className="flex items-center gap-6">
        <button
          className="text-gray-600 hover:text-green-600 relative"
          aria-label="Notifications"
        >
          <Bell size={22} />
          {/* Notification dot */}
          <span className="absolute top-0 right-0 block w-2 h-2 bg-green-500 rounded-full"></span>
        </button>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 text-gray-700 hover:text-green-600"
        >
          <User size={22} />
          <span className="hidden md:inline">{admin.name}</span>
        </Link>
      </div>
    </header>
  );
}
