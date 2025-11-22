"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import FishProductForm from "../../FishProductForm";
import { fishProductApi } from "@/app/utils/fishApi";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { Card, CardHeader, CardContent } from "../../../../components/Card";

export default function EditFishProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const result: any = await fishProductApi.getById(id);
        setProduct(result.fishProduct);
      } catch (err: any) {
        showError(err.message || "Failed to load fish product");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchProduct();
    }
  }, [id, showError]);

  async function handleSave(formData: FormData) {
    setSaving(true);
    try {
      await fishProductApi.update(id, formData);
      success("Fish product updated successfully");
      setTimeout(() => {
        router.push("/dashboard/fish/products");
      }, 1000);
    } catch (err: any) {
      showError(err.message || "Failed to update fish product");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <p className="mt-2 text-gray-500">Loading fish product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Fish product not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Edit Fish Product"
          description="Update fish product information"
        />
        <CardContent>
          <div className="space-y-2">
            {messages.map((msg) => (
              <InlineMessage
                key={msg.id}
                type={msg.type}
                message={msg.message}
                onClose={() => removeMessage(msg.id)}
              />
            ))}
          </div>
          <FishProductForm initial={product} onSave={handleSave} loading={saving} />
        </CardContent>
      </Card>
    </div>
  );
}

