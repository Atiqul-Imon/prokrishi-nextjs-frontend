"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className="text-gray-700 hover:text-amber-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
        aria-label="Dashboard home"
      >
        <Home size={16} />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight size={14} className="text-gray-500" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-gray-700 hover:text-amber-700 transition-colors font-semibold px-2 py-1 rounded-lg hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-black px-2 py-1">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumbs;

