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
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  return (
    <tr
      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer ${
        isSelected ? "bg-emerald-50/50" : ""
      }`}
      onClick={handleRowClick}
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

      {/* Customer Info */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 flex-shrink-0">
            <User size={18} className="text-emerald-600" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{customer.name}</div>
            {customer.email && (
              <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                <Mail size={12} />
                {customer.email}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 py-4">
        {customer.phone ? (
          <div className="text-sm text-slate-700 flex items-center gap-1.5">
            <Phone size={14} className="text-slate-400" />
            {customer.phone}
          </div>
        ) : (
          <span className="text-sm text-slate-400 italic">—</span>
        )}
      </td>

      {/* Role */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getRoleBadgeColor(
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
      <td className="px-4 py-4">
        <div className="text-sm text-slate-700 flex items-center gap-1.5">
          <Calendar size={14} className="text-slate-400" />
          {new Date(customer.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/dashboard/customers/${customer._id}`}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </Link>
        </div>
      </td>
    </tr>
  );
};

