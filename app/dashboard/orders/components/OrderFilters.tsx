"use client";

import React, { useState } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { AdminOrderFilters } from "@/app/utils/api";

interface OrderFiltersProps {
  filters: AdminOrderFilters;
  onFilterChange: (key: string, value: any) => void;
}

export const OrderFilters = ({ filters, onFilterChange }: OrderFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [
    filters.search,
    filters.status,
    filters.paymentStatus,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => onFilterChange("search", e.target.value)}
          placeholder="Search by Order ID, customer name..."
          className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange("search", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 font-medium text-sm transition-colors"
        >
          <Filter size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              onFilterChange("search", "");
              onFilterChange("status", "");
              onFilterChange("paymentStatus", "");
            }}
            className="text-sm text-slate-600 hover:text-emerald-600 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Order Status</label>
              <select
                value={filters.status || ""}
                onChange={(e) => onFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Payment Status</label>
              <select
                value={filters.paymentStatus || ""}
                onChange={(e) => onFilterChange("paymentStatus", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              >
                <option value="">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
              <select
                value={`${filters.sortBy || "createdAt"}-${filters.sortOrder || "desc"}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-");
                  onFilterChange("sortBy", sortBy);
                  onFilterChange("sortOrder", sortOrder);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="totalPrice-desc">Highest Amount</option>
                <option value="totalPrice-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

