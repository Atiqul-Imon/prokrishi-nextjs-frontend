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
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Plus, RefreshCw, Download } from "lucide-react";

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

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
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Products", href: "/dashboard/products" }]} />

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1 font-medium">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRefresh((r) => r + 1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <Link
            href="/dashboard/products/add"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent>
          <ProductSearch onSearch={setSearchQuery} />
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
