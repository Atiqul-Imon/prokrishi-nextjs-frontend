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
    color: "bg-amber-100 text-amber-600",
    borderColor: "border-amber-200",
  },
  out_of_stock: {
    icon: Package,
    color: "bg-rose-100 text-rose-600",
    borderColor: "border-rose-200",
  },
  trending_down: {
    icon: TrendingDown,
    color: "bg-blue-100 text-blue-600",
    borderColor: "border-blue-200",
  },
};

const severityConfig = {
  low: "border-l-2",
  medium: "border-l-4",
  high: "border-l-4 border-rose-400",
};

export const AlertList = ({ alerts, loading = false }: AlertListProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title="Alerts & Notifications" />
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-lg animate-pulse" />
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
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-emerald-200">
              <Package size={24} className="text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-emerald-600 mb-1">All clear!</p>
            <p className="text-xs text-slate-500">No alerts at this time</p>
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
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
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
                className={`p-4 rounded-lg border ${config.borderColor} ${severity} bg-white hover:shadow-sm transition-all ${
                  alert.href ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 mb-1">{alert.title}</p>
                    <p className="text-xs text-slate-600">{alert.description}</p>
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

