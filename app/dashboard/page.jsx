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

const StatCard = ({ title, value, icon, color, href }) => {
  const CardContent = (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          {icon}
        </div>
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
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <ShoppingCart className="w-5 h-5 text-green-600" />
      </div>
      <div>
        <p className="font-medium text-gray-900">
          {order.user?.name || "Guest"}
        </p>
        <p className="text-sm text-gray-500">
          Order #{order._id.substring(0, 8)}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-medium text-gray-900">৳{order.totalPrice?.toFixed(2)}</p>
      <p className="text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const LowStockItem = ({ product }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-red-600" />
      </div>
      <div>
        <p className="font-medium text-gray-900">{product.name}</p>
        <p className="text-sm text-gray-500">Low stock alert</p>
      </div>
    </div>
    <div className="text-right">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-semibold text-gray-600">Loading dashboard...</div>
      </div>
    );
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link
              href="/dashboard/orders"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <RecentOrderItem key={order._id} order={order} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
            <Link
              href="/dashboard/products"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((product) => (
                <LowStockItem key={product._id} product={product} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>All products are well stocked</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/products/add"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <Package className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Add Product</p>
              <p className="text-sm text-gray-500">Create a new product listing</p>
            </div>
          </Link>
          <Link
            href="/dashboard/categories/add"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Add Category</p>
              <p className="text-sm text-gray-500">Create a new product category</p>
            </div>
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <Calendar className="w-6 h-6 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">View Reports</p>
              <p className="text-sm text-gray-500">Analyze sales and performance</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
