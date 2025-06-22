"use client";

import React, { useEffect, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getProductById } from "@/app/utils/api";
import { useCart } from "@/app/context/CartContext";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton"; // Assuming you have this

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product");
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error("Not enough stock available.");
      return;
    }
    if (quantity > 0) {
      addToCart(product, quantity);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="animate-pulse bg-gray-200 rounded-lg w-full h-[400px]"></div>
          <div className="space-y-4">
            <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-6 w-1/4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-1/3 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-24 w-full rounded"></div>
            <div className="flex items-center gap-4">
              <div className="animate-pulse bg-gray-200 h-12 w-32 rounded-lg"></div>
              <div className="animate-pulse bg-gray-200 h-12 w-48 rounded-lg"></div>
            </div>
          </div>
        </div>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <img
                src={product.image || "/testp.webp"} // Use product.image directly
                alt={product.name}
                className="w-full h-auto max-h-[450px] object-contain rounded-lg"
              />
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href={`/products/category/${product.category.name.toLowerCase()}`}
                className="text-primary-600 hover:text-primary-800 font-semibold text-sm uppercase tracking-wide"
              >
                {product.category.name}
              </Link>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="prose text-gray-600 mb-6"
            >
              <p>{product.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4"
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 space-y-3 text-sm text-gray-600"
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
