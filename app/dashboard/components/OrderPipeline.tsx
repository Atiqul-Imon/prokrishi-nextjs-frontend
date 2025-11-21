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
    color: "bg-amber-100 text-amber-700 border-amber-200",
    barColor: "bg-amber-500",
  },
  processing: {
    label: "Processing",
    icon: Package,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    barColor: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    barColor: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    barColor: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-rose-100 text-rose-700 border-rose-200",
    barColor: "bg-rose-500",
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
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-2 bg-slate-100 rounded animate-pulse" />
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
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
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
                    <span className="text-sm font-medium text-slate-700">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{count}</span>
                    <span className="text-xs text-slate-500">({percentage.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${config.barColor} transition-all duration-500 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Total Orders</span>
            <span className="text-lg font-bold text-slate-900">{totalOrders}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

