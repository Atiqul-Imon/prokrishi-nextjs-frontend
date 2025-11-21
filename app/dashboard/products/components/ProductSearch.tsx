"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: FilterState) => void;
  placeholder?: string;
  showSearchBar?: boolean;
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
  showSearchBar = true,
}: ProductSearchProps) => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    stockStatus: "all",
  });

  // Debounce search
  useEffect(() => {
    if (!showSearchBar) return;
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, showSearchBar]);

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
      {showSearchBar && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      {/* Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:border-amber-500 hover:bg-amber-50 text-gray-700 hover:text-gray-900 font-semibold text-sm transition-all"
        >
          <Filter size={16} />
          Filters
          {Object.values(filters).some((f) => f !== "all" && f) && (
            <span className="ml-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs rounded-full font-bold shadow-lg">
              {Object.values(filters).filter((f) => f !== "all" && f).length}
            </span>
          )}
        </button>
        {Object.values(filters).some((f) => f !== "all" && f) && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-700 hover:text-amber-700 font-semibold transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Status</label>
              <select
                value={filters.status || "all"}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            {/* Stock Status Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Stock Status</label>
              <select
                value={filters.stockStatus || "all"}
                onChange={(e) => handleFilterChange("stockStatus", e.target.value as any)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 transition-all"
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

