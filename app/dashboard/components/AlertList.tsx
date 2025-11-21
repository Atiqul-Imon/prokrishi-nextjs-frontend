"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import Link from "next/link";

interface AlertItem {
  id: string;
  type: "low_stock" | "out_of_stock" | "trending_down";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  href?: string;
}

interface AlertListProps {
  alerts: AlertItem[];
  loading?: boolean;
}

const alertConfig = {
  low_stock: {
    icon: AlertTriangle,
    color: "bg-amber-500/20 text-amber-400",
    borderColor: "border-amber-500/30",
    gradient: "from-amber-500 to-orange-500",
  },
  out_of_stock: {
    icon: Package,
    color: "bg-rose-500/20 text-rose-400",
    borderColor: "border-rose-500/30",
    gradient: "from-rose-500 to-pink-500",
  },
  trending_down: {
    icon: TrendingDown,
    color: "bg-blue-500/20 text-blue-400",
    borderColor: "border-blue-500/30",
    gradient: "from-blue-500 to-cyan-500",
  },
};

const severityConfig = {
  low: "border-l-2 border-blue-500/50",
  medium: "border-l-4 border-amber-500/50",
  high: "border-l-4 border-rose-500",
};

export const AlertList = ({ alerts, loading = false }: AlertListProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title="Alerts & Notifications" />
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader title="Alerts & Notifications" />
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/30 shadow-lg">
              <Package size={28} className="text-emerald-400" />
            </div>
            <p className="text-sm font-black text-emerald-600 mb-1">All clear!</p>
            <p className="text-xs text-gray-700">No alerts at this time</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Alerts & Notifications"
        description="Items requiring attention"
        actions={
          <Link
            href="/dashboard/products"
            className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            View all →
          </Link>
        }
      />
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const config = alertConfig[alert.type];
            const Icon = config.icon;
            const severity = severityConfig[alert.severity];

            const content = (
              <div
                className={`p-4 rounded-xl border ${config.borderColor} ${severity} bg-gradient-to-br ${config.color.replace('text-', 'from-').replace('/20', '/10')} to-transparent hover:shadow-lg hover:scale-[1.01] transition-all ${
                  alert.href ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${config.gradient} shadow-lg`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{alert.title}</p>
                    <p className="text-xs text-gray-700">{alert.description}</p>
                  </div>
                </div>
              </div>
            );

            if (alert.href) {
              return (
                <Link key={alert.id} href={alert.href}>
                  {content}
                </Link>
              );
            }

            return <div key={alert.id}>{content}</div>;
          })}
        </div>
      </CardContent>
    </Card>
  );
};

