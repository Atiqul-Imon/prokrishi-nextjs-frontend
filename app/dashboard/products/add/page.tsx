"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../ProductForm";
import { createProduct } from "@/app/utils/api";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const { messages, success, error, removeMessage } = useInlineMessage();

  async function handleSave(data) {
    setLoading(true);
    setLoadingMessage("Creating product...");

    try {
      const newProduct = await createProduct(data);
      setLoadingMessage(null);
      success(
        `Product "${newProduct.product.name}" created successfully!`,
        3000
      );
      setTimeout(() => router.push("/dashboard/products"), 2000);
    } catch (err: any) {
      setLoadingMessage(null);
      error(err.message || "Error creating product", 5000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
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
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to add a new product to your store.
        </p>
      </div>
      <ProductForm initial={null} onSave={handleSave} loading={loading} />
    </div>
  );
}
