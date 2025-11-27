"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fishProductApi } from "@/app/utils/fishApi";
import { Card, CardHeader, CardContent } from "../../../components/Card";
import { Edit, ArrowLeft, Star } from "lucide-react";
import { FishProduct } from "@/types/models";
import { formatAmount } from "@/app/utils/numberFormat";

export default function ViewFishProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<FishProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const result: any = await fishProductApi.getById(id);
        setProduct(result.fishProduct);
      } catch (err: any) {
        setError(err.message || "Failed to load fish product");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <p className="mt-2 text-gray-500">Loading fish product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "Fish product not found"}</p>
        <Link
          href="/dashboard/fish/products"
          className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:text-amber-700"
        >
          <ArrowLeft size={18} />
          Back to Fish Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/fish/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Fish Products
        </Link>
        <Link
          href={`/dashboard/fish/products/edit/${product._id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Edit size={18} />
          Edit Product
        </Link>
      </div>

      <Card>
        <CardHeader
          title={`${product.name}${product.isFeatured ? " ⭐" : ""}`}
          description={product.sku ? `SKU: ${product.sku}` : undefined}
          actions={
            <span
              className={`px-3 py-1 text-sm rounded ${
                product.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {product.status}
            </span>
          }
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.image && (
              <div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="text-gray-900">
                  {typeof product.category === "object"
                    ? product.category.name
                    : "N/A"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Available Stock</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {product.availableStock || 0} fish
                </p>
              </div>

              {product.priceRange && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price Range</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ৳{formatAmount(product.priceRange.min)} - ৳{formatAmount(product.priceRange.max)}/kg
                  </p>
                </div>
              )}

              {product.shortDescription && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Short Description</h3>
                  <p className="text-gray-900">{product.shortDescription}</p>
                </div>
              )}
            </div>
          </div>

          {product.description && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Categories</h3>
            {product.sizeCategories && product.sizeCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.sizeCategories.map((cat) => (
                  <div
                    key={cat._id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{cat.label}</h4>
                      {cat.isDefault && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-500">Price per kg:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          ৳{formatAmount(cat.pricePerKg)}
                        </span>
                      </div>
                      {(cat.minWeight || cat.maxWeight) && (
                        <div>
                          <span className="text-gray-500">Weight range:</span>{" "}
                          <span className="text-gray-900">
                            {cat.minWeight ? `${cat.minWeight}kg` : ""}
                            {cat.minWeight && cat.maxWeight ? " - " : ""}
                            {cat.maxWeight ? `${cat.maxWeight}kg` : ""}
                          </span>
                        </div>
                      )}
                      {cat.sku && (
                        <div>
                          <span className="text-gray-500">SKU:</span>{" "}
                          <span className="text-gray-900">{cat.sku}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Status:</span>{" "}
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            cat.status === "active"
                              ? "bg-green-100 text-green-800"
                              : cat.status === "inactive"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {cat.status}
                        </span>
                      </div>
                      {cat.stock !== undefined && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="text-xs text-gray-500">
                            <div>Stock: {cat.stock}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No size categories defined</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

