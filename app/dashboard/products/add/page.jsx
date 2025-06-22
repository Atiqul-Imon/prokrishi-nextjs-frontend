"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../ProductForm";
import { createProduct } from "@/app/utils/api";
import toast from "react-hot-toast";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSave(data) {
    setLoading(true);
    toast.loading("Creating product...");

    try {
      const newProduct = await createProduct(data);
      toast.dismiss();
      toast.success(
        `Product "${newProduct.product.name}" created successfully!`,
      );
      router.push("/dashboard/products");
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Error creating product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-gray-600">
          Fill in the details below to add a new product to your store.
        </p>
      </div>
      <ProductForm onSave={handleSave} loading={loading} />
    </div>
  );
}
