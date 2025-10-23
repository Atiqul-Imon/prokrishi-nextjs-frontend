"use client";

import React, { memo, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Heart,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { getProductImageUrl } from "@/utils/imageOptimizer";

function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const {
    _id,
    name,
    image,
    price,
    category,
    stock,
    description,
    measurement,
    unit,
  } = product;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, id: _id }, 1);
  }, [product, _id, addToCart]);

  const inStock = useMemo(() => stock > 0, [stock]);

  return (
    <div className="product-card group relative border rounded-lg overflow-hidden bg-white shadow-sm">
      <Link href={`/products/${_id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={getProductImageUrl(image, 'card')}
            alt={name}
            loading="lazy"
            width={400}
            height={400}
            className="w-full h-24 sm:h-32 md:h-40 object-cover"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-2 sm:p-3">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/products/${_id}`}>{name}</Link>
        </h3>

        {/* Description (Hidden on mobile) */}
        {description && (
          <p className="text-xs text-gray-500 mb-1 line-clamp-1 hidden sm:block">
            {description}
          </p>
        )}
        
        {/* Rating (Hidden on mobile) */}
        <div className="hidden sm:flex items-center mb-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${star <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">(12)</span>
        </div>

        {/* Price */}
        <div className="mb-2">
          <p className="text-sm sm:text-base font-bold text-primary">
            ৳{price}
            {unit !== "pcs" && (
              <span className="text-xs font-normal text-gray-600">
                {" "}/ {measurement}{unit}
              </span>
            )}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="w-full bg-slate-800 text-white font-semibold py-1.5 sm:py-2 px-2 sm:px-3 rounded-md flex items-center justify-center hover:bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed text-xs sm:text-sm"
        >
          <ShoppingCart size={14} className="mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">{inStock ? "Add to Cart" : "Out of Stock"}</span>
        </button>
      </div>
    </div>
  );
}

// Memoize ProductCard to prevent unnecessary re-renders in product lists
export default memo(ProductCard);