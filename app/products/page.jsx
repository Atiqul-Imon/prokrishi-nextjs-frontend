"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, searchProducts } from "@/app/utils/api";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllProducts();
      setProducts(data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(
          data.map((product) => product.category?.name).filter(Boolean),
        ),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.message || "Failed to load products");
      toast.error("Failed to load products");
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category?.name === selectedCategory,
      );
    }

    // Price range filter
    if (priceRange.min !== "") {
      filtered = filtered.filter(
        (product) => product.price >= Number(priceRange.min),
      );
    }
    if (priceRange.max !== "") {
      filtered = filtered.filter(
        (product) => product.price <= Number(priceRange.max),
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "name":
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }

      if (sortOrder === "desc") {
        return aValue > bValue ? -1 : 1;
      }
      return aValue < bValue ? -1 : 1;
    });

    return filtered;
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSortBy("name");
    setSortOrder("asc");
    setPriceRange({ min: "", max: "" });
  };

  const filteredProducts = filterProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} products available
          </p>
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
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Products
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search products..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleSearch}
                      className="bg-green-600 text-white px-3 py-2 rounded-r-md hover:bg-green-700 transition-colors"
                    >
                      <Search size={18} />
                    </button>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
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
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                      placeholder="Min price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
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
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                    </select>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
                  >
                    <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
