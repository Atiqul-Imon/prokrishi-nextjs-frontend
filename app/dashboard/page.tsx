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
  const CardContent = (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color} hover:shadow-lg transition-all duration-300 hover:scale-105 group`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">{value}</p>
        </div>
        <div className={`p-4 rounded-xl ${color.replace('border-l-', 'bg-').replace('-500', '-100')} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          +12% from last month
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

const RecentOrderItem = ({ order }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors rounded-lg px-3 -mx-3">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-sm">
        <ShoppingCart className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <p className="font-semibold text-gray-900">
          {order.user?.name || "Guest"}
        </p>
        <p className="text-sm text-gray-500">
          Order #{order._id.substring(0, 8)}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-gray-900 text-lg">৳{order.totalPrice?.toFixed(2)}</p>
      <p className="text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const LowStockItem = ({ product }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 hover:bg-red-50 transition-colors rounded-lg px-3 -mx-3">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center shadow-sm">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <div>
        <p className="font-semibold text-gray-900">{product.name}</p>
        <p className="text-sm text-red-600 font-medium">Low stock alert</p>
      </div>
    </div>
    <div className="text-right">
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-800 border border-red-200">
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-xl font-semibold mb-2">Error Loading Dashboard</div>
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="text-xl font-semibold text-gray-600">No data available</div>
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
      icon: <Package className="w-6 h-6 text-green-600" />,
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
      icon: <DollarSign className="w-6 h-6 text-yellow-600" />,
      color: "border-l-yellow-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-green-100 text-lg">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent Orders</h2>
              <Link
                href="/dashboard/orders"
                className="text-blue-100 hover:text-white font-medium text-sm transition-colors"
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
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">No recent orders</p>
                  <p className="text-sm">Orders will appear here once customers start shopping</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Low Stock Alerts</h2>
              <Link
                href="/dashboard/products"
                className="text-red-100 hover:text-white font-medium text-sm transition-colors"
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
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-lg font-medium text-green-600">All products are well stocked</p>
                  <p className="text-sm">Great job managing your inventory!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/dashboard/products/add"
              className="group flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-green-700">Add Product</p>
                <p className="text-sm text-gray-500">Create a new product listing</p>
              </div>
            </Link>
            <Link
              href="/dashboard/categories/add"
              className="group flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-700">Add Category</p>
                <p className="text-sm text-gray-500">Create a new product category</p>
              </div>
            </Link>
            <Link
              href="/dashboard/reports"
              className="group flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-purple-700">View Reports</p>
                <p className="text-sm text-gray-500">Analyze sales and performance</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
