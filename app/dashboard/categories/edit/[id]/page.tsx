"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CategoryForm from "../../CategoryForm";
import { getCategoryById, updateCategory } from "@/app/utils/api";
import Link from "next/link";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { ArrowLeft } from "lucide-react";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

  useEffect(() => {
    if (!id) return;
    async function fetchCategory() {
      setLoading(true);
      try {
        const data = await getCategoryById(id!);
        setCategory(data.category);
      } catch (err: any) {
        setError(err.message || "Failed to load category");
        showError(err.message || "Failed to load category", 5000);
      }
      setLoading(false);
    }
    fetchCategory();
  }, [id]);

  async function handleUpdate(data) {
    setSaving(true);
    setLoadingMessage("Updating category...");
    try {
      const updated = await updateCategory(id, data);
      setLoadingMessage(null);
      success(`Category "${updated.category.name}" updated!`, 3000);
      setTimeout(() => router.push("/dashboard/categories"), 2000);
    } catch (err: any) {
      setLoadingMessage(null);
      showError(err.message || "Failed to update category", 5000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

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
