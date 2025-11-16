"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductTable from "./ProductTable";
import {
  getAllProducts,
  deleteProduct,
  toggleProductFeatured,
} from "@/app/utils/api";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { ConfirmDialog } from "@/components/ConfirmDialog";

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
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const result = await getAllProducts({ page: currentPage, limit: pageSize });
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
      }
      setLoading(false);
    }
    fetchProducts();
  }, [refresh, currentPage, pageSize]);

  // Handler for delete
  function handleDelete(id) {
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
      success("Product deleted successfully!", 5000);
      setDeleteConfirm(null);
    } catch (err: any) {
      showError(err.message || "Failed to delete product", 5000);
      setDeleteConfirm(null);
    }
  }

  // Handler for toggle featured
  async function handleToggleFeatured(id) {
    try {
      await toggleProductFeatured(id);
      setRefresh((r) => r + 1);
      success("Featured status updated!", 3000);
    } catch (err: any) {
      showError(err.message || "Failed to toggle featured status", 5000);
    }
  }

  return (
    <div>
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

      {/* Delete Confirmation Dialog */}
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

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1 font-medium">Manage your product inventory</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setRefresh((r) => r + 1)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 border-2 border-blue-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <Link
            href="/dashboard/products/add"
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-emerald-700 border-2 border-emerald-700"
          >
            + Add Product
          </Link>
        </div>
      </div>
      {error && <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-red-700 font-medium mb-4">{error}</div>}
      <ProductTable
        products={products}
        loading={loading}
        onDelete={handleDelete}
        onToggleFeatured={handleToggleFeatured}
        pagination={pagination}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
