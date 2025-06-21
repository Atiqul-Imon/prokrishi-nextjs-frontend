'use client';

import Link from 'next/link';

export default function DashboardCard({ title, value, icon, href }) {
  return (
    <Link href={href} className="block bg-white rounded-lg shadow hover:shadow-md transition p-6 text-center group">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-lg font-semibold mb-1 text-gray-800 group-hover:text-green-600">{title}</div>
      <div className="text-2xl font-bold text-green-700">{value}</div>
    </Link>
  );
}