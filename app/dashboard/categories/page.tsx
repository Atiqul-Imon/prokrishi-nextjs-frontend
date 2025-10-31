"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getResourceList,
  deleteCategory,
  updateCategory,
} from "@/app/utils/api";
import { Plus, Edit, Trash2, Star, RefreshCw } from "lucide-react";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { ConfirmDialog } from "@/components/ConfirmDialog";

// Enhanced toggle switch component
const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
  <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="sr-only peer"
    />
    <div className={`w-11 h-6 rounded-full transition-all duration-200 peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
      checked 
        ? 'bg-green-600 shadow-lg shadow-green-200' 
        : 'bg-gray-200 hover:bg-gray-300'
    } ${disabled ? 'opacity-50' : ''}`}></div>
  </label>
);

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingCategories, setTogglingCategories] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

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

  const CategoryCard = ({ category }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-all hover:shadow-xl relative">
      {category.isFeatured && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full z-10">
          <Star size={16} />
        </div>
      )}

      <Link href={`/dashboard/categories/edit/${category._id}`}>
        <div className="relative h-40 w-full">
          <Image
            src={category.image || "/placeholder.svg"} // Use a placeholder if no image
            alt={category.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-bold text-lg capitalize">{category.name}</h3>
        <p className="text-gray-600 text-sm truncate h-10">
          {category.description || "No description"}
        </p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <ToggleSwitch
              checked={category.isFeatured}
              onChange={() => handleToggleFeatured(category)}
              disabled={togglingCategories.has(category._id)}
            />
            <span className="text-sm text-gray-600">
              Featured
              {togglingCategories.has(category._id) && (
                <span className="ml-2 text-xs text-gray-400">Updating...</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/categories/edit/${category._id}`}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => handleDelete(category._id, category.name)}
              className="p-2 rounded-full hover:bg-red-50 text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Inline Messages */}
      <div className="mb-4 space-y-2">
        {loadingMessage && (
          <InlineMessage type="info" message={loadingMessage} />
        )}
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
        message={deleteConfirm ? `Are you sure you want to delete category "${deleteConfirm.name}"? This action cannot be undone.` : ""}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-500">Manage your product categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <Link
            href="/dashboard/categories/add"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-center py-10">Loading categories...</div>
      )}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              <p>No categories found.</p>
              <p className="mt-2">Click "Add Category" to get started.</p>
            </div>
          ) : (
            categories.map((c) => <CategoryCard key={c._id} category={c} />)
          )}
        </div>
      )}
    </div>
  );
}
