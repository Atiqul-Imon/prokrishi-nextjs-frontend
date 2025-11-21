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
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle,
    iconColor: "text-emerald-400",
  },
  inactive: {
    label: "Inactive",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: XCircle,
    iconColor: "text-amber-400",
  },
  out_of_stock: {
    label: "Out of Stock",
    color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    icon: AlertCircle,
    iconColor: "text-rose-400",
  },
};

export default function ProductStatusBadge({ status, size = "md" }: ProductStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.inactive;
  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-xl border font-bold ${config.color} shadow-lg`}
    >
      <Icon size={size === "sm" ? 12 : 14} className={config.iconColor} />
      {config.label}
    </span>
  );
}
