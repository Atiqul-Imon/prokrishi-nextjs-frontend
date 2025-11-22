"use client";

import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { fishInventoryApi, fishProductApi } from "@/app/utils/fishApi";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Card, CardHeader, CardContent } from "../../components/Card";
import { Plus, RefreshCw, Search, X, Edit, Trash2, Filter } from "lucide-react";
import { FishInventory } from "@/types/models";

export default function FishInventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<FishInventory[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
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
  const [filterFishProduct, setFilterFishProduct] = useState("");
  const [filterSizeCategoryId, setFilterSizeCategoryId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [fishProducts, setFishProducts] = useState<any[]>([]);
  const { messages, success, error: showError, removeMessage } = useInlineMessage();
  const fetchingRef = useRef(false);
  const prevParamsRef = useRef<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    async function fetchFishProducts() {
      try {
        const result: any = await fishProductApi.getAll({ limit: 1000 });
        setFishProducts(result.fishProducts || []);
      } catch (err) {
        console.error("Failed to load fish products:", err);
      }
    }
    fetchFishProducts();
  }, []);

  const selectedProduct = useMemo(() => {
    return fishProducts.find((p) => p._id === filterFishProduct);
  }, [fishProducts, filterFishProduct]);

  const sizeCategories = useMemo(() => {
    return selectedProduct?.sizeCategories || [];
  }, [selectedProduct]);

  useEffect(() => {
    // Create a unique key from all filter parameters
    const paramsKey = JSON.stringify({
      page: currentPage,
      search: searchQuery,
      fishProduct: filterFishProduct,
      sizeCategoryId: filterSizeCategoryId,
      status: filterStatus,
      refresh,
    });

    // Only fetch if parameters actually changed
    if (paramsKey === prevParamsRef.current) {
      return;
    }
    prevParamsRef.current = paramsKey;

    if (fetchingRef.current) return; // Prevent concurrent calls
    fetchingRef.current = true;
    setLoading(true);
    setError("");

    const fetchInventory = async () => {
      try {
        const params: any = { page: currentPage, limit: 50 };
        if (searchQuery) {
          params.search = searchQuery;
        }
        if (filterFishProduct) {
          params.fishProduct = filterFishProduct;
        }
        if (filterSizeCategoryId) {
          params.sizeCategoryId = filterSizeCategoryId;
        }
        if (filterStatus) {
          params.status = filterStatus;
        }
        const result: any = await fishInventoryApi.getAll(params);
        setInventoryItems(result.inventoryItems || []);
        setPagination(result.pagination || { page: 1, limit: 50, total: 0, pages: 1 });
      } catch (err: any) {
        const errorMessage = err.message || "Error fetching fish inventory";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, filterFishProduct, filterSizeCategoryId, filterStatus, refresh]);

  async function confirmDelete() {
    if (!deleteConfirm) return;
    try {
      await fishInventoryApi.delete(deleteConfirm);
      if (inventoryItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setRefresh((r) => r + 1);
      }
      success("Inventory item deleted successfully");
      setDeleteConfirm(null);
    } catch (err: any) {
      showError(err.message || "Failed to delete inventory item");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Fish Inventory"
          description="Manage individual fish items with actual weights"
          actions={
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/fish/inventory/add"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Plus size={18} />
                Add Fish
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
          <div className="mb-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search inventory..."
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Filter size={14} className="inline mr-1" />
                  Fish Product
                </label>
                <select
                  value={filterFishProduct}
                  onChange={(e) => {
                    setFilterFishProduct(e.target.value);
                    setFilterSizeCategoryId("");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">All Products</option>
                  {fishProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size Category
                </label>
                <select
                  value={filterSizeCategoryId}
                  onChange={(e) => setFilterSizeCategoryId(e.target.value)}
                  disabled={!filterFishProduct}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">All Categories</option>
                  {sizeCategories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="expired">Expired</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>
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
              <p className="mt-2 text-gray-500">Loading inventory...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : inventoryItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No inventory items found</p>
              <Link
                href="/dashboard/fish/inventory/add"
                className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:text-amber-700"
              >
                <Plus size={18} />
                Add your first fish
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Fish Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Size Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actual Weight</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Purchase Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryItems.map((item) => (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {typeof item.fishProduct === "object"
                              ? item.fishProduct.name
                              : "N/A"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                            {item.sizeCategory?.label || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900">{item.actualWeight} kg</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              item.status === "available"
                                ? "bg-green-100 text-green-800"
                                : item.status === "reserved"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.status === "sold"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{item.location || "N/A"}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {item.purchaseDate
                              ? new Date(item.purchaseDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/fish/inventory/edit/${item._id}`}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Link>
                            {item.status === "available" && (
                              <button
                                onClick={() => setDeleteConfirm(item._id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
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
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} items
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
        title="Delete Inventory Item"
        message="Are you sure you want to delete this inventory item? This action cannot be undone."
      />
    </div>
  );
}

