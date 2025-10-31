"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/app/utils/api";
import { ProductsResponse } from "@/types/api";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [results, setResults] = useState<Partial<ProductsResponse>>({
    products: [],
    pagination: {} as any,
    filters: {},
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { messages, error: showError, removeMessage } = useInlineMessage();

  // Get search parameters from URL
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const page = searchParams.get("page") || "1";
  const status = searchParams.get("status") || "active";

  // Local state for filters
  const [filters, setFilters] = useState({
    q: query,
    category: category,
    minPrice: minPrice,
    maxPrice: maxPrice,
    sortBy: sortBy,
    sortOrder: sortOrder,
    status: status,
  });

  useEffect(() => {
    performSearch();
  }, [searchParams]);

  const performSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const searchParams = new URLSearchParams();

      // Add all search parameters
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          searchParams.append(key, filters[key]);
        }
      });

      const data = await searchProducts({
        q: query,
        category,
        minPrice: minPrice || 0,
        maxPrice: maxPrice || 999999,
        sortBy,
        sortOrder,
        page: parseInt(page) || 1,
        status,
      });

      setResults(data);
    } catch (err: any) {
      setError(err.message);
      showError("Failed to search products", 5000);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Update URL with new filters
    const params = new URLSearchParams();
    Object.keys(updatedFilters).forEach((key) => {
      if (updatedFilters[key] !== undefined && updatedFilters[key] !== "") {
        params.append(key, updatedFilters[key]);
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      q: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "name",
      sortOrder: "asc",
      status: "active",
    });
    router.push("/search");
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage.toString() });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Inline Messages */}
        <div className="mb-4 space-y-2">
          {messages.map((msg) => (
            <InlineMessage
              key={msg.id}
              type={msg.type}
              message={msg.message}
              onClose={() => removeMessage(msg.id)}
            />
          ))}
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
            {query && <span className="text-gray-600"> for "{query}"</span>}
          </h1>
          {results.pagination?.totalProducts !== undefined && (
            <p className="text-gray-600">
              {results.pagination.totalProducts} product
              {results.pagination.totalProducts !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
                >
                  {showFilters ? <X size={20} /> : <Filter size={20} />}
                </button>
              </div>

              <div
                className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}
              >
                {/* Search Query */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Query
                  </label>
                  <input
                    type="text"
                    value={filters.q}
                    onChange={(e) => updateFilters({ q: e.target.value })}
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      updateFilters({ category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Categories</option>
                    {results.categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        updateFilters({ minPrice: e.target.value })
                      }
                      placeholder="Min price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        updateFilters({ maxPrice: e.target.value })
                      }
                      placeholder="Max price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <div className="space-y-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        updateFilters({ sortBy: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                    </select>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) =>
                        updateFilters({ sortOrder: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16 text-gray-500">
                <p>Searching...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : results.products.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mt-2 text-gray-600">
                  Try adjusting your filters or search for different products.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {results.pagination && results.pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(results.pagination.currentPage - 1)}
                        disabled={results.pagination.currentPage <= 1}
                        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      <span className="px-3 py-2 text-sm text-gray-600">
                        Page {results.pagination.currentPage} of {results.pagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(results.pagination.currentPage + 1)}
                        disabled={results.pagination.currentPage >= results.pagination.totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading search...</p>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
