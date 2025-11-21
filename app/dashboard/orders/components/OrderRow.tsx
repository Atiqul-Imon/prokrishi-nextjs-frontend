"use client";

import React from "react";
import Link from "next/link";
import { Eye, Trash2, MoreVertical, User, Calendar, DollarSign } from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "../components/OrderBadges";

interface OrderRowProps {
  order: any;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export const OrderRow = ({ order, onDelete, isSelected = false, onSelect }: OrderRowProps) => {
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect?.(order._id, e.target.checked);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(order._id);
  };

  return (
    <tr
      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
        isSelected ? "bg-emerald-50/50" : ""
      }`}
    >
      {/* Checkbox */}
      {onSelect && (
        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
          />
        </td>
      )}

      {/* Order ID */}
      <td className="px-4 py-4">
        <Link
          href={`/dashboard/orders/${order._id}`}
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          #{order._id.substring(0, 8)}
        </Link>
      </td>

      {/* Customer */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
            <User size={18} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {order.userInfo?.name || "Guest"}
            </div>
            <div className="text-xs text-slate-500">
              {order.userInfo?.email || order.userInfo?.phone || "—"}
            </div>
          </div>
        </div>
      </td>

      {/* Date */}
      <td className="px-4 py-4">
        <div className="text-sm text-slate-700">
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="text-xs text-slate-500">
          {new Date(order.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </td>

      {/* Total */}
      <td className="px-4 py-4">
        <div className="text-sm font-semibold text-slate-900">
          ৳{order.totalPrice?.toFixed(2) || "0.00"}
        </div>
        <div className="text-xs text-slate-500">
          {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? "item" : "items"}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <OrderStatusBadge status={order.status || order.orderStatus} />
      </td>

      {/* Payment Status */}
      <td className="px-4 py-4">
        <PaymentStatusBadge status={order.paymentStatus} />
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/dashboard/orders/${order._id}`}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Order"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

