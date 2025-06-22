"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CategoryForm from "../../CategoryForm";
import { getCategoryById, updateCategory } from "@/app/utils/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    async function fetchCategory() {
      setLoading(true);
      try {
        const data = await getCategoryById(id);
        setCategory(data.category);
      } catch (err) {
        setError(err.message || "Failed to load category");
        toast.error(err.message || "Failed to load category");
      }
      setLoading(false);
    }
    fetchCategory();
  }, [id]);

  async function handleUpdate(data) {
    setSaving(true);
    toast.loading("Updating category...");
    try {
      const updated = await updateCategory(id, data);
      toast.dismiss();
      toast.success(`Category "${updated.category.name}" updated!`);
      router.push("/dashboard/categories");
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

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
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <p className="text-gray-500">Update the details for this category.</p>
      </div>
      <CategoryForm initial={category} onSave={handleUpdate} loading={saving} />
    </div>
  );
}
