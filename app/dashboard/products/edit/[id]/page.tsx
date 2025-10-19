"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "../../ProductForm";
import { getProductById, updateProduct } from "@/app/utils/api";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      async function fetchProduct() {
        setLoading(true);
        try {
          const data = await getProductById(id!);
          setProduct(data);
        } catch (err) {
          setError("Failed to load product data.");
          toast.error("Failed to load product data.");
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
      toast.success("Product updated successfully!");
      router.push("/dashboard/products");
      router.refresh(); // To see changes immediately
    } catch (err) {
      toast.error(err.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm initial={product} onSave={handleSave} loading={saving} />
    </div>
  );
}
