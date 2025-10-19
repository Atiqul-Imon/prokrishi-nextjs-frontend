"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "../CategoryForm";
import { createCategory } from "@/app/utils/api";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSave(data) {
    setLoading(true);
    toast.loading("Creating category...");

    try {
      const newCategory = await createCategory(data);
      toast.dismiss();
      toast.success(
        `Category "${newCategory.category.name}" created successfully!`,
      );
      router.push("/dashboard/categories");
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Error creating category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/categories"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Categories
        </Link>
        <h1 className="text-2xl font-bold">Add New Category</h1>
        <p className="text-gray-500">
          Fill in the details below to add a new category to your store.
        </p>
      </div>
      <CategoryForm initial={null} onSave={handleSave} loading={loading} />
    </div>
  );
}
