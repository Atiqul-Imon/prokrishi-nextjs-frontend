"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductTable from "./ProductTable";
import {
  getAllProducts,
  deleteProduct,
  toggleProductFeatured,
} from "@/app/utils/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const result = await getAllProducts();
        setProducts(result);
      } catch (err) {
        setError(err.message || "Error fetching products");
      }
      setLoading(false);
    }
    fetchProducts();
  }, [refresh]);

  // Handler for delete
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProduct(id);
      setRefresh((r) => r + 1);
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  }

  // Handler for toggle featured
  async function handleToggleFeatured(id) {
    try {
      await toggleProductFeatured(id);
      setRefresh((r) => r + 1);
    } catch (err) {
      alert(err.message || "Failed to toggle featured status");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/dashboard/products/add"
          className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700"
        >
          + Add Product
        </Link>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <ProductTable
        products={products}
        loading={loading}
        onDelete={handleDelete}
        onToggleFeatured={handleToggleFeatured}
      />
    </div>
  );
}
