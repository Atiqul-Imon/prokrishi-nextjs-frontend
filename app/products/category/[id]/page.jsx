"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/app/utils/api";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function ProductsByCategoryPage() {
  const params = useParams();
  const { id: categorySlug } = params;
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!categorySlug) return;

    async function fetchData() {
      setLoading(true);
      try {
        // Fetch products and category info in parallel
        const [productRes, categoryRes] = await Promise.all([
          apiRequest(`/product/category/slug/${categorySlug}`),
          apiRequest(`/category/${categorySlug}`),
        ]);

        if (productRes.success) {
          setProducts(productRes.products);
        } else {
          throw new Error(productRes.message || "Failed to fetch products");
        }

        if (categoryRes.success) {
          setCategory(categoryRes.category);
        } else {
          throw new Error(
            categoryRes.message || "Failed to fetch category details",
          );
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data for category page:", err);
      }
      setLoading(false);
    }

    fetchData();
  }, [categorySlug]);

  if (loading)
    return <div className="text-center py-20">Loading products...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold mt-2">
          Products in {category ? `"${category.name}"` : "Category"}
        </h1>
        <p className="text-gray-500 mt-1">{products.length} items found</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">No Products Found</h2>
          <p className="text-gray-600 mt-2">
            There are currently no products available in this category.
          </p>
        </div>
      )}
    </div>
  );
}
