"use client";

import React from "react";
import { User, Mail, Phone, Calendar, Shield, Eye } from "lucide-react";
import Link from "next/link";

interface CustomerRowProps {
  customer: any;
  onView?: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export const CustomerRow = ({ customer, onView, isSelected = false, onSelect }: CustomerRowProps) => {
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect?.(customer._id, e.target.checked);
  };

  const handleRowClick = () => {
    if (onView) {
      onView(customer._id);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === "admin" || role === "super_admin") {
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
    return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  };

  return (
    <tr
      className={`border-b border-gray-200 hover:bg-gray-50 transition-all cursor-pointer ${
        isSelected ? "bg-amber-50 border-amber-200" : ""
      }`}
      onClick={handleRowClick}
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

      {/* Customer Info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-300 flex-shrink-0 shadow-lg">
            <User size={20} className="text-amber-700" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">{customer.name}</div>
            {customer.email && (
              <div className="text-xs text-gray-600 truncate flex items-center gap-1 mt-0.5">
                <Mail size={12} />
                {customer.email}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Phone */}
      <td className="px-6 py-4">
        {customer.phone ? (
          <div className="text-sm text-gray-800 flex items-center gap-1.5 font-semibold">
            <Phone size={14} className="text-gray-600" />
            {customer.phone}
          </div>
        ) : (
          <span className="text-sm text-gray-600 italic">—</span>
        )}
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-lg ${getRoleBadgeColor(
            customer.role || "user"
          )}`}
        >
          <Shield size={12} />
          {customer.role === "super_admin"
            ? "Super Admin"
            : customer.role === "admin"
            ? "Admin"
            : "Customer"}
        </span>
      </td>

      {/* Joined Date */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-800 flex items-center gap-1.5 font-semibold">
          <Calendar size={14} className="text-gray-600" />
          {new Date(customer.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/dashboard/customers/${customer._id}`}
            className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-300"
            title="View Details"
          >
            <Eye size={18} />
          </Link>
        </div>
      </td>
    </tr>
  );
};

