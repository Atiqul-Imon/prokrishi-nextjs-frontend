"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getResourceList,
  deleteCategory,
  updateCategory,
} from "@/app/utils/api";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";

// A simple toggle switch component
const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
  </label>
);

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCategories() {
    setLoading(true);
    setError("");
    try {
      const data = await getResourceList("category");
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
    const toastId = toast.loading(
      `${newStatus ? "Featuring" : "Unfeaturing"} "${category.name}"...`,
    );
    try {
      await updateCategory(category._id, { isFeatured: newStatus });
      toast.success(
        `Category "${category.name}" is now ${newStatus ? "featured" : "not featured"}.`,
        { id: toastId },
      );
      fetchCategories(); // Refresh list
    } catch (err) {
      toast.error(`Failed to update "${category.name}".`, { id: toastId });
    }
  }

  async function handleDelete(id, name) {
    toast(
      (t) => (
        <span>
          Delete category "<b>{name}</b>"?
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast.promise(
                deleteCategory(id).then(() => {
                  fetchCategories(); // Refresh the list
                }),
                {
                  loading: "Deleting...",
                  success: `Category "${name}" deleted.`,
                  error: `Failed to delete "${name}".`,
                },
              );
            }}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-2 bg-gray-200 px-3 py-1 rounded"
          >
            Cancel
          </button>
        </span>
      ),
      { duration: 6000 },
    );
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
            />
            <span className="text-sm text-gray-600">Featured</span>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-500">Manage your product categories.</p>
        </div>
        <Link
          href="/dashboard/categories/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </Link>
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
