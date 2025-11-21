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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => onFilterChange("search", e.target.value)}
          placeholder="Search by Order ID, customer name..."
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 transition-all"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange("search", "")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:border-amber-500 hover:bg-amber-50 text-gray-700 hover:text-gray-900 font-semibold text-sm transition-all"
        >
          <Filter size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs rounded-full font-bold shadow-lg">
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
              className="text-sm text-gray-700 hover:text-amber-700 font-semibold transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Order Status</label>
              <select
                value={filters.status || ""}
                onChange={(e) => onFilterChange("status", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 transition-all"
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
              <label className="block text-sm font-bold text-gray-800 mb-2">Payment Status</label>
              <select
                value={filters.paymentStatus || ""}
                onChange={(e) => onFilterChange("paymentStatus", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 transition-all"
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
              <label className="block text-sm font-bold text-gray-800 mb-2">Sort By</label>
              <select
                value={`${filters.sortBy || "createdAt"}-${filters.sortOrder || "desc"}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-");
                  onFilterChange("sortBy", sortBy);
                  onFilterChange("sortOrder", sortOrder);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 transition-all"
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

