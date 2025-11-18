"use client";

import React from "react";
import ProductCard from "../ProductCard";
import { useProductData } from "@/hooks/useSWRWithConfig";

function ProductGrid() {
  // Use SWR for product data - cached with auto-revalidation
  const { data, error, isLoading } = useProductData<any>("/product");
  
  const products = data?.products || [];

  return (
    <section className="py-10 px-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">Our Products</h2>
      {isLoading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-16">{error?.message || "Failed to load products"}</div>
      ) : (
        <div className="product-grid w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center 3xl:max-w-7xl 3xl:mx-auto">
          {products.map((product: any) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
