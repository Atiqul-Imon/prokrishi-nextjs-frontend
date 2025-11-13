"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Filter, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useProductData } from "@/hooks/useSWRWithConfig";

export default function ProductsPage() {
  const router = useRouter();

  // Use SWR for products - auto-revalidates to keep stock levels fresh
  const { data, error, isLoading } = useProductData<any>("/product");
  
  const products = data?.products || [];

  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("");

  // Extract unique categories (memoized to avoid recalculating on every render)
  const categories = useMemo(() => {
    return [
      ...new Set(
        products.map((product: any) => 
          typeof product.category === 'string' ? product.category : product.category?.name
        ).filter(Boolean),
      ),
    ];
  }, [products]);


  // Memoize filtered products to avoid recalculating on every render
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (product: any) => product.category?.name === selectedCategory,
      );
    }

    return filtered;
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            All Products
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {filteredProducts.length} products available
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 lg:flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors touch-manipulation"
                  aria-label={showFilters ? "Hide filters" : "Show filters"}
                >
                  {showFilters ? <X size={20} /> : <Filter size={20} />}
                </button>
              </div>

              <div
                className={`${showFilters ? "block" : "hidden"} lg:block`}
              >
                {/* Categories List */}
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                      selectedCategory === ""
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category: any) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                        selectedCategory === category
                          ? "bg-green-100 text-green-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="text-center py-8 sm:py-12 md:py-16 text-gray-500">
                <p className="text-sm sm:text-base">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base text-red-600">{error?.message || "Failed to load products"}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base text-gray-600">No products found.</p>
              </div>
            ) : (
              <div className="product-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {filteredProducts.map((product: any) => (
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
