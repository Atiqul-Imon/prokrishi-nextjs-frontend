"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  href?: string;
  color?: "blue" | "emerald" | "purple" | "amber" | "rose";
  loading?: boolean;
}

const colorConfig = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    trendPositive: "text-blue-600",
    trendNegative: "text-blue-400",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    trendPositive: "text-emerald-600",
    trendNegative: "text-emerald-400",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    trendPositive: "text-purple-600",
    trendNegative: "text-purple-400",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    trendPositive: "text-amber-600",
    trendNegative: "text-amber-400",
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    trendPositive: "text-rose-600",
    trendNegative: "text-rose-400",
  },
};

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  href,
  color = "emerald",
  loading = false,
}: MetricCardProps) => {
  const colors = colorConfig[color];

  const content = (
    <div
      className={`group relative bg-white rounded-xl border ${colors.border} p-6 hover:shadow-md transition-all duration-200 ${
        href ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-slate-200 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          )}
          {trend && !loading && (
            <div className="flex items-center gap-1.5 mt-3">
              {trend.value > 0 ? (
                <TrendingUp
                  size={16}
                  className={trend.isPositive ? colors.trendPositive : colors.trendNegative}
                />
              ) : trend.value < 0 ? (
                <TrendingDown
                  size={16}
                  className={trend.isPositive ? colors.trendNegative : colors.trendPositive}
                />
              ) : (
                <Minus size={16} className="text-slate-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.value > 0
                    ? trend.isPositive
                      ? colors.trendPositive
                      : colors.trendNegative
                    : trend.value < 0
                    ? trend.isPositive
                      ? colors.trendNegative
                      : colors.trendPositive
                    : "text-slate-500"
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-slate-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={`ml-4 flex-shrink-0 w-12 h-12 rounded-xl ${colors.iconBg} ${colors.iconColor} flex items-center justify-center border ${colors.border}`}
        >
          <Icon size={24} />
        </div>
      </div>
      {href && (
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-emerald-300 transition-colors pointer-events-none" />
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

