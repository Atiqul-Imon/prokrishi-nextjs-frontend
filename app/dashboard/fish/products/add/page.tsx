"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FishProductForm from "../FishProductForm";
import { fishProductApi } from "@/app/utils/fishApi";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { Card, CardHeader, CardContent } from "../../../components/Card";

export default function AddFishProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

  async function handleSave(formData: FormData) {
    setLoading(true);
    try {
      await fishProductApi.create(formData);
      success("Fish product created successfully");
      setTimeout(() => {
        router.push("/dashboard/fish/products");
      }, 1000);
    } catch (err: any) {
      showError(err.message || "Failed to create fish product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Add Fish Product"
          description="Create a new fish product with size categories"
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
          <FishProductForm onSave={handleSave} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}

