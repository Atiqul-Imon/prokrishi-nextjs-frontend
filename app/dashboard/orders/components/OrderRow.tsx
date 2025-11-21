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
      className={`border-b border-gray-200 hover:bg-gray-50 transition-all ${
        isSelected ? "bg-amber-50 border-amber-200" : ""
      }`}
    >
      {/* Checkbox */}
      {onSelect && (
        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-5 h-5 text-amber-600 border-gray-400 rounded focus:ring-amber-500 cursor-pointer bg-white"
          />
        </td>
      )}

      {/* Order ID */}
      <td className="px-6 py-4">
        <Link
          href={`/dashboard/orders/${order._id}`}
          className="text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
        >
          #{order._id.substring(0, 8)}
        </Link>
      </td>

      {/* Customer */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-300 shadow-lg">
            <User size={20} className="text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">
              {order.userInfo?.name || "Guest"}
            </div>
            <div className="text-xs text-gray-600">
              {order.userInfo?.email || order.userInfo?.phone || "—"}
            </div>
          </div>
        </div>
      </td>

      {/* Date */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-800 font-semibold">
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="text-xs text-gray-600">
          {new Date(order.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </td>

      {/* Total */}
      <td className="px-6 py-4">
        <div className="text-sm font-bold text-gray-900">
          ৳{order.totalPrice?.toFixed(2) || "0.00"}
        </div>
        <div className="text-xs text-gray-700">
          {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? "item" : "items"}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <OrderStatusBadge status={order.status || order.orderStatus} />
      </td>

      {/* Payment Status */}
      <td className="px-6 py-4">
        <PaymentStatusBadge status={order.paymentStatus} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/dashboard/orders/${order._id}`}
            className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-300"
            title="View Details"
          >
            <Eye size={18} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-300"
            title="Delete Order"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

