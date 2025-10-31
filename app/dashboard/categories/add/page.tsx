"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "../CategoryForm";
import { createCategory } from "@/app/utils/api";
import { ArrowLeft } from "lucide-react";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import Link from "next/link";

export default function AddCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const { messages, success, error, removeMessage } = useInlineMessage();

  async function handleSave(data) {
    setLoading(true);
    setLoadingMessage("Creating category...");

    try {
      const newCategory = await createCategory(data);
      setLoadingMessage(null);
      success(
        `Category "${newCategory.category.name}" created successfully!`,
        3000
      );
      setTimeout(() => router.push("/dashboard/categories"), 2000);
    } catch (err: any) {
      setLoadingMessage(null);
      error(err.message || "Error creating category", 5000);
    } finally {
      setLoading(false);
    }
  }

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
        <h1 className="text-2xl font-bold">Add New Category</h1>
        <p className="text-gray-500">
          Fill in the details below to add a new category to your store.
        </p>
      </div>
      <CategoryForm initial={null} onSave={handleSave} loading={loading} />
    </div>
  );
}
