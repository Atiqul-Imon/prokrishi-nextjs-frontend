"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getDashboardStats } from "@/app/utils/api";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { DashboardSkeleton } from "./components/SkeletonLoader";
import { MetricCard } from "./components/MetricCard";
import { OrderPipeline } from "./components/OrderPipeline";
import { ActivityFeed } from "./components/ActivityFeed";
import { AlertList } from "./components/AlertList";
import { Card, CardHeader, CardContent } from "./components/Card";
import { Breadcrumbs } from "./components/Breadcrumbs";

export default function DashboardHome() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Transform data for components
  const orderStatusCounts = useMemo(() => {
    if (!stats?.recentOrders) {
      return {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      };
    }

    const counts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    stats.recentOrders.forEach((order: any) => {
      const status = order.orderStatus || order.status || "pending";
      if (status in counts) {
        counts[status as keyof typeof counts]++;
      }
    });

    return counts;
  }, [stats]);

  const activityItems = useMemo(() => {
    if (!stats?.recentOrders) return [];

    return stats.recentOrders.slice(0, 5).map((order: any) => ({
      id: order._id,
      type: "order" as const,
      title: `New order from ${order.user?.name || "Guest"}`,
      description: `Order #${order._id.substring(0, 8)} • ৳${order.totalPrice?.toFixed(2) || "0.00"}`,
      timestamp: order.createdAt,
      href: `/dashboard/orders/${order._id}`,
    }));
  }, [stats]);

  const alertItems = useMemo(() => {
    if (!stats?.lowStockProducts) return [];

    return stats.lowStockProducts.map((product: any) => ({
      id: product._id,
      type: product.stock === 0 ? ("out_of_stock" as const) : ("low_stock" as const),
      title: product.name,
      description: product.stock === 0 ? "Out of stock" : `Only ${product.stock} units remaining`,
      severity: product.stock === 0 ? ("high" as const) : product.stock < 5 ? ("high" as const) : ("medium" as const),
      href: `/dashboard/products/edit/${product._id}`,
    }));
  }, [stats]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-red-600 text-xl font-semibold mb-2">Error Loading Dashboard</div>
            <div className="text-slate-600">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-xl font-semibold text-slate-600">No data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[]} />

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 sm:p-8 border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-300 text-base sm:text-lg font-medium">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center border-2 border-emerald-400 shadow-lg">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={stats.stats?.totalUsers || 0}
          icon={Users}
          color="blue"
          href="/dashboard/customers"
          trend={{ value: 12, label: "from last month", isPositive: true }}
          loading={loading}
        />
        <MetricCard
          title="Total Products"
          value={stats.stats?.totalProducts || 0}
          icon={Package}
          color="emerald"
          href="/dashboard/products"
          trend={{ value: 8, label: "from last month", isPositive: true }}
          loading={loading}
        />
        <MetricCard
          title="Total Orders"
          value={stats.stats?.totalOrders || 0}
          icon={ShoppingCart}
          color="purple"
          href="/dashboard/orders"
          trend={{ value: 15, label: "from last month", isPositive: true }}
          loading={loading}
        />
        <MetricCard
          title="Total Revenue"
          value={`৳${(stats.stats?.totalRevenue || 0).toLocaleString("en-BD")}`}
          icon={DollarSign}
          color="amber"
          trend={{ value: 22, label: "from last month", isPositive: true }}
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Pipeline - Takes 1 column */}
        <div className="lg:col-span-1">
          <OrderPipeline statusCounts={orderStatusCounts} loading={loading} />
        </div>

        {/* Activity Feed & Alerts - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <ActivityFeed activities={activityItems} loading={loading} />
          <AlertList alerts={alertItems} loading={loading} />
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader
          title="Quick Actions"
          description="Common tasks and shortcuts"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/products/add"
              className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-200 transition-colors">
                <Plus size={24} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-1">Add Product</p>
                <p className="text-sm text-slate-600">Create a new product listing</p>
              </div>
            </Link>
            <Link
              href="/dashboard/categories/add"
              className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200 group-hover:bg-blue-200 transition-colors">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-1">Add Category</p>
                <p className="text-sm text-slate-600">Create a new product category</p>
              </div>
            </Link>
            <Link
              href="/dashboard/reports"
              className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center border border-purple-200 group-hover:bg-purple-200 transition-colors">
                <Calendar size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-1">View Reports</p>
                <p className="text-sm text-slate-600">Analyze sales and performance</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
