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
            <div className="text-rose-400 text-xl font-semibold mb-2">Error Loading Dashboard</div>
            <div className="text-gray-400">{error}</div>
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
            <div className="text-xl font-semibold text-gray-400">No data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={stats.stats?.totalUsers || 0}
          icon={Users}
          color="cyan"
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
          color="amber"
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
              className="group flex items-center gap-4 p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-300 transition-all hover:scale-[1.02]"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all">
                <Plus size={24} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Add Product</p>
                <p className="text-sm text-gray-600">Create a new product listing</p>
              </div>
            </Link>
            <Link
              href="/dashboard/categories/add"
              className="group flex items-center gap-4 p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300 transition-all hover:scale-[1.02]"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Add Category</p>
                <p className="text-sm text-gray-600">Create a new product category</p>
              </div>
            </Link>
            <Link
              href="/dashboard/reports"
              className="group flex items-center gap-4 p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 hover:border-amber-300 transition-all hover:scale-[1.02]"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-xl group-hover:shadow-amber-500/40 transition-all">
                <Calendar size={24} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">View Reports</p>
                <p className="text-sm text-gray-600">Analyze sales and performance</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
