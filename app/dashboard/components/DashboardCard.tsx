"use client";

import Link from "next/link";

export default function DashboardCard({ title, value, icon, href }) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-lg border-2 border-slate-200 hover:border-emerald-400 p-6 text-center"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-lg font-bold mb-2 text-slate-800">
        {title}
      </div>
      <div className="text-2xl font-bold text-emerald-600">{value}</div>
    </Link>
  );
}
