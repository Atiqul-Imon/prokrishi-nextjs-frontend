"use client";

import React, { useState, useEffect } from "react";
import { getDashboardStats } from "@/app/utils/api";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import { DashboardSkeleton } from "./components/SkeletonLoader";

interface StatCardProps {
  title: string;
  value: any;
  icon: any;
  color: string;
  href?: string;
}

const StatCard = ({ title, value, icon, color, href }: StatCardProps) => {
  const colorMap: { [key: string]: { border: string; bg: string; text: string; hover: string } } = {
    'border-l-blue-500': { border: 'border-l-4 border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', hover: 'hover:border-blue-600' },
    'border-l-green-500': { border: 'border-l-4 border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', hover: 'hover:border-emerald-600' },
    'border-l-purple-500': { border: 'border-l-4 border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', hover: 'hover:border-purple-600' },
    'border-l-yellow-500': { border: 'border-l-4 border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', hover: 'hover:border-amber-600' },
  };
  
  const colorConfig = colorMap[color] || colorMap['border-l-green-500'];
  
  const CardContent = (
    <div className={`bg-white p-6 rounded-lg border-2 border-slate-200 ${colorConfig.border} ${colorConfig.hover}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-4 rounded-lg ${colorConfig.bg} border-2 ${colorConfig.border.replace('border-l-4', 'border')}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${colorConfig.bg} ${colorConfig.text} border-2 ${colorConfig.border.replace('border-l-4', 'border')}`}>
          +12% from last month
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

const RecentOrderItem = ({ order }) => (
  <div className="flex items-center justify-between py-4 border-b-2 border-slate-100 last:border-b-0 hover:bg-slate-50 rounded-lg px-3 -mx-3">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center border-2 border-emerald-200">
        <ShoppingCart className="w-6 h-6 text-emerald-600" />
      </div>
      <div>
        <p className="font-bold text-slate-900">
          {order.user?.name || "Guest"}
        </p>
        <p className="text-sm text-slate-600 font-medium">
          Order #{order._id.substring(0, 8)}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-slate-900 text-lg">৳{order.totalPrice?.toFixed(2)}</p>
      <p className="text-sm text-slate-500 font-medium">
        {new Date(order.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const LowStockItem = ({ product }) => (
  <div className="flex items-center justify-between py-4 border-b-2 border-slate-100 last:border-b-0 hover:bg-red-50 rounded-lg px-3 -mx-3">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center border-2 border-red-200">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <div>
        <p className="font-bold text-slate-900">{product.name}</p>
        <p className="text-sm text-red-600 font-bold">Low stock alert</p>
      </div>
    </div>
    <div className="text-right">
      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-red-50 text-red-700 border-2 border-red-300">
        {product.stock} left
      </span>
    </div>
  </div>
);

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
        <div className="text-red-700 text-xl font-bold mb-2">Error Loading Dashboard</div>
        <div className="text-red-600 font-medium">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="text-xl font-bold text-slate-600">No data available</div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.stats.totalUsers,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: "border-l-blue-500",
      href: "/dashboard/customers",
    },
    {
      title: "Total Products",
      value: stats.stats.totalProducts,
      icon: <Package className="w-6 h-6 text-emerald-600" />,
      color: "border-l-green-500",
      href: "/dashboard/products",
    },
    {
      title: "Total Orders",
      value: stats.stats.totalOrders,
      icon: <ShoppingCart className="w-6 h-6 text-purple-600" />,
      color: "border-l-purple-500",
      href: "/dashboard/orders",
    },
    {
      title: "Total Revenue",
      value: `৳${stats.stats.totalRevenue}`,
      icon: <DollarSign className="w-6 h-6 text-amber-600" />,
      color: "border-l-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-lg p-6 sm:p-8 border-2 border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-300 text-base sm:text-lg font-medium">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-emerald-600 rounded-lg flex items-center justify-center border-2 border-emerald-500">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 border-b-2 border-blue-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent Orders</h2>
              <Link
                href="/dashboard/orders"
                className="text-blue-100 hover:text-white font-bold text-sm"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-1">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <RecentOrderItem key={order._id} order={order} />
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
                    <ShoppingCart className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-lg font-bold">No recent orders</p>
                  <p className="text-sm font-medium">Orders will appear here once customers start shopping</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
          <div className="bg-red-600 px-6 py-4 border-b-2 border-red-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Low Stock Alerts</h2>
              <Link
                href="/dashboard/products"
                className="text-red-100 hover:text-white font-bold text-sm"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-1">
              {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                stats.lowStockProducts.map((product) => (
                  <LowStockItem key={product._id} product={product} />
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <div className="w-16 h-16 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200">
                    <Package className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-lg font-bold text-emerald-600">All products are well stocked</p>
                  <p className="text-sm font-medium">Great job managing your inventory!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
        <div className="bg-purple-600 px-6 py-4 border-b-2 border-purple-700">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              href="/dashboard/products/add"
              className="flex items-center p-5 border-2 border-slate-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mr-4 border-2 border-emerald-200">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Add Product</p>
                <p className="text-sm text-slate-600 font-medium">Create a new product listing</p>
              </div>
            </Link>
            <Link
              href="/dashboard/categories/add"
              className="flex items-center p-5 border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4 border-2 border-blue-200">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Add Category</p>
                <p className="text-sm text-slate-600 font-medium">Create a new product category</p>
              </div>
            </Link>
            <Link
              href="/dashboard/reports"
              className="flex items-center p-5 border-2 border-slate-200 rounded-lg hover:border-purple-400 hover:bg-purple-50"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4 border-2 border-purple-200">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">View Reports</p>
                <p className="text-sm text-slate-600 font-medium">Analyze sales and performance</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
