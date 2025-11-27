"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { fishProductApi } from "@/app/utils/fishApi";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Card, CardHeader, CardContent } from "../../components/Card";
import { Plus, RefreshCw, Search, X, Edit, Trash2, Eye, Star } from "lucide-react";
import { FishProduct } from "@/types/models";
import { formatAmount } from "@/app/utils/numberFormat";

export default function FishProductsPage() {
  const [products, setProducts] = useState<FishProduct[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { messages, success, error: showError, removeMessage } = useInlineMessage();
  const fetchingRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchProducts = useCallback(async () => {
    if (fetchingRef.current) return; // Prevent concurrent calls
    fetchingRef.current = true;
    setLoading(true);
    setError("");
    try {
      const params: any = { page: currentPage, limit: 20 };
      if (searchQuery) {
        params.search = searchQuery;
      }
      const result: any = await fishProductApi.getAll(params);
      setProducts(result.fishProducts || []);
      setPagination(result.pagination || { page: 1, limit: 20, total: 0, pages: 1 });
    } catch (err: any) {
      const errorMessage = err.message || "Error fetching fish products";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refresh]);

  async function confirmDelete() {
    if (!deleteConfirm) return;
    try {
      await fishProductApi.delete(deleteConfirm);
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setRefresh((r) => r + 1);
      }
      success("Fish product deleted successfully");
      setDeleteConfirm(null);
    } catch (err: any) {
      showError(err.message || "Failed to delete fish product");
    }
  }

  async function handleToggleFeatured(id: string) {
    try {
      await fishProductApi.toggleFeatured(id);
      setRefresh((r) => r + 1);
      success("Featured status updated");
    } catch (err: any) {
      showError(err.message || "Failed to update featured status");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Fish Products"
          description="Manage your fish product inventory"
          actions={
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/fish/products/add"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Plus size={18} />
                Add Fish Product
              </Link>
              <button
                onClick={() => setRefresh((r) => r + 1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          }
        />
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search fish products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {messages.map((msg) => (
              <InlineMessage
                key={msg.id}
                type={msg.type}
                message={msg.message}
                onClose={() => removeMessage(msg.id)}
              />
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <p className="mt-2 text-gray-500">Loading fish products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No fish products found</p>
              <Link
                href="/dashboard/fish/products/add"
                className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:text-amber-700"
              >
                <Plus size={18} />
                Add your first fish product
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Size Categories</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Price Range</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          {product.sku && <div className="text-sm text-gray-500">{product.sku}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {product.sizeCategories.slice(0, 3).map((cat) => (
                              <span
                                key={cat._id}
                                className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded"
                              >
                                {cat.label}
                              </span>
                            ))}
                            {product.sizeCategories.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{product.sizeCategories.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {product.priceRange ? (
                            <div className="text-sm">
                              ৳{formatAmount(product.priceRange.min)} - ৳{formatAmount(product.priceRange.max)}/kg
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium">{product.availableStock || 0}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                product.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {product.status}
                            </span>
                            {product.isFeatured && (
                              <Star size={16} className="text-amber-500 fill-amber-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/fish/products/${product._id}`}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              href={`/dashboard/fish/products/edit/${product._id}`}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleToggleFeatured(product._id)}
                              className={`p-1.5 rounded transition-colors ${
                                product.isFeatured
                                  ? "text-amber-600 hover:bg-amber-50"
                                  : "text-gray-400 hover:bg-gray-50 hover:text-amber-600"
                              }`}
                              title={product.isFeatured ? "Unfeature" : "Feature"}
                            >
                              <Star size={16} className={product.isFeatured ? "fill-current" : ""} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Fish Product"
        message="Are you sure you want to delete this fish product? This action cannot be undone."
      />
    </div>
  );
}

