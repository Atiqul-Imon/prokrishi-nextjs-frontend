"use client";

import React from "react";
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  X,
  AlertCircle,
} from "lucide-react";

interface BadgeProps {
  status: string;
  size?: "sm" | "md";
}

const orderStatusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
    iconColor: "text-amber-600",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: CheckCircle,
    iconColor: "text-blue-600",
  },
  processing: {
    label: "Processing",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Package,
    iconColor: "text-purple-600",
  },
  shipped: {
    label: "Shipped",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    icon: Truck,
    iconColor: "text-cyan-600",
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
    iconColor: "text-emerald-600",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: X,
    iconColor: "text-rose-600",
  },
};

const paymentStatusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  paid: {
    label: "Paid",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  failed: {
    label: "Failed",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

export const OrderStatusBadge = ({ status, size = "sm" }: BadgeProps) => {
  const config = orderStatusConfig[status as keyof typeof orderStatusConfig] || orderStatusConfig.pending;
  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-lg border font-semibold ${config.color}`}
    >
      <Icon size={size === "sm" ? 12 : 14} className={config.iconColor} />
      {config.label}
    </span>
  );
};

export const PaymentStatusBadge = ({ status, size = "sm" }: BadgeProps) => {
  // Normalize status (handle both 'paid' and 'completed')
  const normalizedStatus = status === "paid" ? "completed" : status;
  const config = paymentStatusConfig[normalizedStatus as keyof typeof paymentStatusConfig] || paymentStatusConfig.pending;
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center ${sizeClasses} rounded-lg border font-semibold ${config.color}`}
    >
      {config.label}
    </span>
  );
};

