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
  color?: "blue" | "emerald" | "purple" | "amber" | "rose" | "cyan" | "violet";
  loading?: boolean;
}

const colorConfig = {
  blue: {
    gradient: "from-blue-500 to-cyan-500",
    bg: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    iconBg: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/30",
  },
  emerald: {
    gradient: "from-emerald-500 to-teal-500",
    bg: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    iconBg: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/30",
  },
  purple: {
    gradient: "from-amber-500 to-orange-500",
    bg: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    iconBg: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/30",
  },
  amber: {
    gradient: "from-amber-500 to-orange-500",
    bg: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    iconBg: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/30",
  },
  rose: {
    gradient: "from-rose-500 to-pink-500",
    bg: "from-rose-500/10 to-pink-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    iconBg: "from-rose-500 to-pink-500",
    shadow: "shadow-rose-500/30",
  },
  cyan: {
    gradient: "from-cyan-500 to-blue-500",
    bg: "from-cyan-500/10 to-blue-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    iconBg: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/30",
  },
  violet: {
    gradient: "from-amber-500 to-orange-500",
    bg: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    iconBg: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/30",
  },
};

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  href,
  color = "amber",
  loading = false,
}: MetricCardProps) => {
  const colors = colorConfig[color];

  const content = (
    <div
      className={`group relative bg-white rounded-2xl border ${colors.border} p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${colors.shadow} shadow-lg ${
        href ? "cursor-pointer" : ""
      }`}
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 rounded-2xl blur-2xl transition-opacity duration-300`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-gray-700 mb-3 uppercase tracking-widest">{title}</p>
          {loading ? (
            <div className="h-12 w-40 bg-gray-200 rounded-xl animate-pulse mt-2" />
          ) : (
            <p className="text-4xl font-black text-gray-900 mt-2">
              {value}
            </p>
          )}
          {trend && !loading && (
            <div className="flex items-center gap-2 mt-4">
              {trend.value > 0 ? (
                <TrendingUp size={18} className={trend.isPositive ? colors.text : "text-gray-400"} />
              ) : trend.value < 0 ? (
                <TrendingDown size={18} className={trend.isPositive ? "text-gray-400" : colors.text} />
              ) : (
                <Minus size={18} className="text-gray-400" />
              )}
              <span className={`text-sm font-bold ${trend.value > 0 ? (trend.isPositive ? colors.text : "text-gray-400") : trend.value < 0 ? (trend.isPositive ? "text-gray-400" : colors.text) : "text-gray-400"}`}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-700 font-medium">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`ml-4 flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center shadow-2xl ${colors.shadow}`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
      
      {href && (
        <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-${color}-500/50 transition-colors pointer-events-none`} />
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
