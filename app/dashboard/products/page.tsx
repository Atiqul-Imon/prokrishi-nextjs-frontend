"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProductTable from "./ProductTable";
import { ProductSearch } from "./components/ProductSearch";
import { BulkActions } from "./components/BulkActions";
import {
  getAllProducts,
  deleteProduct,
  toggleProductFeatured,
} from "@/app/utils/api";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Card, CardHeader, CardContent } from "../components/Card";
import { Plus, RefreshCw, Download, Search, X } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = { page: currentPage, limit: pageSize };
      if (searchQuery) {
        params.search = searchQuery;
      }
      const result = await getAllProducts(params);
      setProducts(result.products || []);
      const paginationData = result.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        hasNext: false,
        hasPrev: false,
      };
      setPagination({
        currentPage: paginationData.currentPage || 1,
        totalPages: paginationData.totalPages || 1,
        totalProducts: paginationData.totalProducts || 0,
        hasNext: paginationData.hasNext || false,
        hasPrev: paginationData.hasPrev || false,
      });
    } catch (err: any) {
      setError(err.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refresh]);

  // Handler for delete
  function handleDelete(id: string) {
    setDeleteConfirm(id);
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    try {
      await deleteProduct(deleteConfirm);
      // If we're on the last page and it becomes empty, go to previous page
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setRefresh((r) => r + 1);
      }
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteConfirm);
        return next;
      });
      success("Product deleted successfully!", 5000);
      setDeleteConfirm(null);
    } catch (err: any) {
      showError(err.message || "Failed to delete product", 5000);
      setDeleteConfirm(null);
    }
  }

  // Handler for bulk delete
  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;
    setBulkDeleteConfirm(true);
  }

  async function confirmBulkDelete() {
    try {
      const deletePromises = Array.from(selectedIds).map((id) => deleteProduct(id));
      await Promise.all(deletePromises);
      setSelectedIds(new Set());
      setRefresh((r) => r + 1);
      success(`${selectedIds.size} products deleted successfully!`, 5000);
      setBulkDeleteConfirm(false);
    } catch (err: any) {
      showError(err.message || "Failed to delete products", 5000);
      setBulkDeleteConfirm(false);
    }
  }

  // Handler for toggle featured
  async function handleToggleFeatured(id: string) {
    try {
      await toggleProductFeatured(id);
      setRefresh((r) => r + 1);
      success("Featured status updated!", 3000);
    } catch (err: any) {
      showError(err.message || "Failed to toggle featured status", 5000);
    }
  }

  // Handler for select/deselect
  function handleSelect(id: string, selected: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  function handleSelectAll(selected: boolean) {
    if (selected) {
      setSelectedIds(new Set(products.map((p: any) => p._id)));
    } else {
      setSelectedIds(new Set());
    }
  }

  function handleClearSelection() {
    setSelectedIds(new Set());
  }

  return (
    <div className="space-y-6">
      {/* Inline Messages */}
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

      {/* Delete Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        title="Delete Multiple Products"
        message={`Are you sure you want to delete ${selectedIds.size} product(s)? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-rose-700 font-bold">
          {error}
        </div>
      )}

      {/* Search and Action Buttons */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Search Bar - Smaller */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search products by name, SKU..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 text-sm transition-all"
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearchQuery("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRefresh((r) => r + 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold text-sm transition-all"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <Link
                href="/dashboard/products/add"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all shadow-lg shadow-amber-500/30 text-sm"
              >
                <Plus size={16} />
                Add Product
              </Link>
            </div>
          </div>
          
          {/* Filters Section */}
          <div className="mt-4">
            <ProductSearch onSearch={setSearchQuery} showSearchBar={false} />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <BulkActions
          selectedCount={selectedIds.size}
          onDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Product Table */}
      <ProductTable
        products={products}
        loading={loading}
        onDelete={handleDelete}
        onToggleFeatured={handleToggleFeatured}
        pagination={pagination}
        onPageChange={setCurrentPage}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
      />
    </div>
  );
}
