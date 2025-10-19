"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Check,
  X,
  Plus,
  Minus,
  Tag,
  Layers,
  Package,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart } from "@/app/context/CartContext";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton";
import { useProductData } from "@/hooks/useSWRWithConfig";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  // Use SWR for product data - important to have fresh stock levels
  const { data, error, isLoading } = useProductData<any>(id ? `/product/${id}` : null);
  
  const product = data?.product;

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock < quantity) {
      toast.error("Not enough stock available.");
      return;
    }
    if (quantity > 0) {
      addToCart(product, quantity);
    }
  };

  const incrementQuantity = () => {
    if (!product) return;
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (isLoading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 text-lg">Loading product...</p>
      </div>
    );
  if (error)
    return <div className="text-center text-red-600 py-16">{error}</div>;
  if (!product)
    return (
      <div className="text-center text-gray-500 py-16">Product not found.</div>
    );

  const isOutOfStock = product.stock === 0;

  const stockStatus = isOutOfStock
    ? {
        text: "Out of Stock",
        icon: <X className="w-4 h-4 mr-2" />,
        color: "text-red-600",
      }
    : product.stock <= product.lowStockThreshold
      ? {
          text: `Only ${product.stock} left`,
          icon: <Check className="w-4 h-4 mr-2" />,
          color: "text-yellow-600",
        }
      : {
          text: "In Stock",
          icon: <Check className="w-4 h-4 mr-2" />,
          color: "text-green-600",
        };

  return (
    <div className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <div
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <img
                src={product.image || "/testp.webp"} // Use product.image directly
                alt={product.name}
                className="w-full h-auto max-h-[450px] object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div
            >
              {product.category && (
                <Link
                  href={`/products/category/${product.category._id || product.category.name?.toLowerCase() || ''}`}
                  className="text-primary-600 hover:text-primary-800 font-semibold text-sm uppercase tracking-wide"
                >
                  {product.category.name}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
            </div>

            <div
              className="my-4"
            >
              <span className="text-4xl font-bold text-gray-900">
                ৳{product.price}
                {product.unit !== "pcs" && (
                  <span className="text-xl font-medium text-gray-600">
                    {" "}
                    / {product.measurement}
                    {product.unit === "l" ? "L" : product.unit}
                  </span>
                )}
              </span>
            </div>

            <div
              className="prose text-gray-600 mb-6"
            >
              <p>{product.description}</p>
            </div>

            <div
              className="bg-white border border-gray-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center font-semibold ${stockStatus.color}`}
                >
                  {stockStatus.icon}
                  {stockStatus.text}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  disabled={isOutOfStock || quantity <= 1}
                  className="p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-semibold text-lg">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-green-500/50 transform hover:scale-105"
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </button>
            </div>

            <div className="mt-8 space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <ShieldCheck className="w-5 h-5 mr-3 text-primary-600" />
                <span>100% Secure Payments</span>
              </div>
              <div className="flex items-center">
                <Truck className="w-5 h-5 mr-3 text-primary-600" />
                <span>Fast Delivery Across the Country</span>
              </div>
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-3 text-primary-600" />
                <span>Easy Returns & Exchanges</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
