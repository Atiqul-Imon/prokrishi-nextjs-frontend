"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProductForm from "../../ProductForm";
import { getProductById, updateProduct } from "@/app/utils/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

  useEffect(() => {
    if (id) {
      async function fetchProduct() {
        setLoading(true);
        setError("");
        try {
          const response = await getProductById(id!);
          console.log("Fetched product response:", response);
          // Extract the product from the response object
          const productData = response.product || response;
          console.log("Extracted product data:", productData);
          setProduct(productData);
        } catch (err: any) {
          const errorMessage = err.message || "Failed to load product data.";
          setError(errorMessage);
          showError(errorMessage, 5000);
        } finally {
          setLoading(false);
        }
      }
      fetchProduct();
    }
  }, [id]);

  async function handleSave(formData) {
    setSaving(true);
    try {
      await updateProduct(id!, formData);
      success("Product updated successfully!", 3000);
      // Use router.push for better navigation (softer redirect)
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update product.";
      showError(errorMessage, 5000);
      console.error("Update error:", err);
      setSaving(false); // Only set to false on error, success will redirect
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
  return (
    <div className="max-w-4xl mx-auto">
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="text-red-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-medium text-red-800">Error Loading Product</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/dashboard/products"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/dashboard/products"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">
              Update product information and settings
            </p>
          </div>
          {product && (
            <div className="text-sm text-gray-500">
              <span className="font-medium">SKU:</span> {product.sku}
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      {product ? (
        <ProductForm 
          initial={product} 
          onSave={handleSave} 
          loading={saving} 
        />
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Preparing form...</p>
          </div>
        </div>
      )}
    </div>
  );
}
