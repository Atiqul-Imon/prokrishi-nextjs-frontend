"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  getResourceList,
  deleteCategory,
  updateCategory,
} from "@/app/utils/api";
import { Plus, RefreshCw, Tag, Search, X } from "lucide-react";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Card, CardContent } from "../components/Card";
import { MetricCard } from "../components/MetricCard";
import { CategoryCard } from "./components/CategoryCard";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingCategories, setTogglingCategories] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query))
    );
  }, [categories, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: categories.length,
      featured: categories.filter((c) => c.isFeatured).length,
      withImage: categories.filter((c) => c.image).length,
    };
  }, [categories]);

  async function fetchCategories() {
    setLoading(true);
    setError("");
    try {
      // Add cache-busting timestamp to ensure fresh data
      const timestamp = Date.now();
      const data = await getResourceList("category", `t=${timestamp}`);
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message || "Error loading categories");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleToggleFeatured(category) {
    const newStatus = !category.isFeatured;
    setLoadingMessage(
      `${newStatus ? "Featuring" : "Unfeaturing"} "${category.name}"...`,
    );
    
    // Add to toggling set
    setTogglingCategories(prev => new Set(prev).add(category._id));
    
    try {
      // Optimistic update - update UI immediately
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat._id === category._id 
            ? { ...cat, isFeatured: newStatus }
            : cat
        )
      );

      await updateCategory(category._id, { isFeatured: newStatus });
      setLoadingMessage(null);
      success(
        `Category "${category.name}" is now ${newStatus ? "featured" : "not featured"}.`,
        5000
      );
    } catch (err: any) {
      // Revert optimistic update on error
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat._id === category._id 
            ? { ...cat, isFeatured: !newStatus }
            : cat
        )
      );
      setLoadingMessage(null);
      showError(`Failed to update "${category.name}". ${err.message || ''}`, 5000);
    } finally {
      // Remove from toggling set
      setTogglingCategories(prev => {
        const newSet = new Set(prev);
        newSet.delete(category._id);
        return newSet;
      });
    }
  }

  function handleDelete(id: string, name: string) {
    setDeleteConfirm({ id, name });
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    setLoadingMessage("Deleting...");
    try {
      await deleteCategory(deleteConfirm.id);
      setLoadingMessage(null);
      success(`Category "${deleteConfirm.name}" deleted.`, 5000);
      fetchCategories(); // Refresh the list
      setDeleteConfirm(null);
    } catch (err: any) {
      setLoadingMessage(null);
      showError(`Failed to delete "${deleteConfirm.name}". ${err.message || ''}`, 5000);
      setDeleteConfirm(null);
    }
  }


  return (
    <div className="space-y-6">
      {/* Inline Messages */}
      <div className="space-y-2">
        {loadingMessage && <InlineMessage type="info" message={loadingMessage} />}
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
        title="Delete Category"
        message={
          deleteConfirm
            ? `Are you sure you want to delete category "${deleteConfirm.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />


      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Categories"
          value={stats.total}
          icon={Tag}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title="Featured Categories"
          value={stats.featured}
          icon={Tag}
          color="amber"
          loading={loading}
        />
        <MetricCard
          title="With Images"
          value={stats.withImage}
          icon={Tag}
          color="emerald"
          loading={loading}
        />
      </div>

      {/* Search and Action Buttons */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories by name or description..."
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchCategories()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold text-sm transition-all"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <Link
                href="/dashboard/categories/add"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all shadow-lg shadow-amber-500/30 text-sm"
              >
                <Plus size={16} />
                Add Category
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      {loading ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-gray-700 font-bold">Loading categories...</div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-rose-600 text-lg font-black mb-2">Error Loading Categories</div>
              <div className="text-gray-700">{error}</div>
            </div>
          </CardContent>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Tag className="mx-auto h-16 w-16 text-gray-500 mb-4" />
              <h3 className="text-sm font-black text-gray-900 mb-1">
                {searchQuery ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Get started by creating your first category"}
              </p>
              {!searchQuery && (
                <Link
                  href="/dashboard/categories/add"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all shadow-lg"
                >
                  <Plus size={18} />
                  Add Category
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onToggleFeatured={handleToggleFeatured}
              onDelete={handleDelete}
              isToggling={togglingCategories.has(category._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
