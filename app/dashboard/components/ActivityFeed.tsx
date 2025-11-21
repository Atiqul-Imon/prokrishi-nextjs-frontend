"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Clock, Package, ShoppingBag, User, TrendingUp } from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  id: string;
  type: "order" | "product" | "user" | "revenue";
  title: string;
  description: string;
  timestamp: string;
  href?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  loading?: boolean;
}

const activityConfig = {
  order: {
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-600",
  },
  product: {
    icon: Package,
    color: "bg-emerald-100 text-emerald-600",
  },
  user: {
    icon: User,
    color: "bg-purple-100 text-purple-600",
  },
  revenue: {
    icon: TrendingUp,
    color: "bg-amber-100 text-amber-600",
  },
};

export const ActivityFeed = ({ activities, loading = false }: ActivityFeedProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title="Recent Activity" />
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader title="Recent Activity" />
        <CardContent>
          <div className="text-center py-8">
            <Clock size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500 font-medium">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Recent Activity"
        description="Latest updates and events"
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
          {activities.map((activity) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            const content = (
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 mb-0.5">{activity.title}</p>
                  <p className="text-xs text-slate-600 mb-1">{activity.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={12} />
                    <span>{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            );

            if (activity.href) {
              return (
                <Link key={activity.id} href={activity.href}>
                  {content}
                </Link>
              );
            }

            return <div key={activity.id}>{content}</div>;
          })}
        </div>
      </CardContent>
    </Card>
  );
};

