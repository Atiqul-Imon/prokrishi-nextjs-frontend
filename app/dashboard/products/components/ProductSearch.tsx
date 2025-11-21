"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: FilterState) => void;
  placeholder?: string;
}

interface FilterState {
  status?: string;
  category?: string;
  stockStatus?: "all" | "in_stock" | "low_stock" | "out_of_stock";
}

export const ProductSearch = ({
  onSearch,
  onFilterChange,
  placeholder = "Search products by name, SKU...",
}: ProductSearchProps) => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    stockStatus: "all",
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters: FilterState = { ...filters, [key]: value as any };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = { status: "all", stockStatus: "all" };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
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
          {Object.values(filters).some((f) => f !== "all" && f) && (
            <span className="ml-1 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
              {Object.values(filters).filter((f) => f !== "all" && f).length}
            </span>
          )}
        </button>
        {Object.values(filters).some((f) => f !== "all" && f) && (
          <button
            onClick={clearFilters}
            className="text-sm text-slate-600 hover:text-emerald-600 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={filters.status || "all"}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            {/* Stock Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Stock Status</label>
              <select
                value={filters.stockStatus || "all"}
                onChange={(e) => handleFilterChange("stockStatus", e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              >
                <option value="all">All Stock Levels</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

