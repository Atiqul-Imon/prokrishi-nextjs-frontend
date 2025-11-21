"use client";

import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ProductStatusBadgeProps {
  status: "active" | "inactive" | "out_of_stock";
  size?: "sm" | "md";
}

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
    iconColor: "text-emerald-600",
  },
  inactive: {
    label: "Inactive",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: XCircle,
    iconColor: "text-amber-600",
  },
  out_of_stock: {
    label: "Out of Stock",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: AlertCircle,
    iconColor: "text-rose-600",
  },
};

export default function ProductStatusBadge({ status, size = "md" }: ProductStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.inactive;
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
}
