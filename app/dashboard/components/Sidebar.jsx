'use client';

import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, BarChart2, Settings, User } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Categories', href: '/dashboard/categories', icon: Tag },
  { label: 'Reports', href: '/dashboard/reports', icon: BarChart2 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function Sidebar({ current }) {
  return (
    <aside className="bg-white border-r min-h-screen w-64 flex flex-col py-6 px-4">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-bold text-green-600">
          Prokrishi Admin
        </Link>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = current?.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-8 text-xs text-gray-400 text-center">
        &copy; {new Date().getFullYear()} Prokrishi
      </div>
    </aside>
  );
}