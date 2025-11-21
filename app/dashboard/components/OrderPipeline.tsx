"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";

interface OrderStatusCount {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface OrderPipelineProps {
  statusCounts: OrderStatusCount;
  loading?: boolean;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    barColor: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
  processing: {
    label: "Processing",
    icon: Package,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    barColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    barColor: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    barColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    barColor: "bg-gradient-to-r from-rose-500 to-pink-500",
  },
};

export const OrderPipeline = ({ statusCounts, loading = false }: OrderPipelineProps) => {
  const totalOrders = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ] as const;

  if (loading) {
    return (
      <Card>
        <CardHeader title="Order Pipeline" />
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-2 bg-gray-700/30 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Order Pipeline"
        description="Current order status distribution"
        actions={
          <Link
            href="/dashboard/orders"
            className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            View all →
          </Link>
        }
      />
      <CardContent>
        <div className="space-y-4">
          {statuses.map((status) => {
            const config = statusConfig[status];
            const count = statusCounts[status] || 0;
            const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
            const Icon = config.icon;

            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${config.color}`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                    <span className="text-xs text-gray-700">({percentage.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full ${config.barColor} transition-all duration-500 rounded-full shadow-lg`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Orders</span>
            <span className="text-lg font-bold text-gray-900">{totalOrders}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

