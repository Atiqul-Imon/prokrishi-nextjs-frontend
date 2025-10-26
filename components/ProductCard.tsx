"use client";

import React, { memo, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { getProductImageUrl } from "@/utils/imageOptimizer";
import { formatMeasurement, formatPricePerUnit } from "@/app/utils/measurement";

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
    shortDescription,
    measurement,
    unit,
  } = product;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, id: _id }, 1);
  }, [product, _id, addToCart]);

  const inStock = useMemo(() => stock > 0, [stock]);
  
  // Format measurement for display
  const measurementDisplay = useMemo(() => {
    return formatMeasurement(measurement, unit);
  }, [measurement, unit]);
  
  // Format price per unit
  const pricePerUnitDisplay = useMemo(() => {
    return formatPricePerUnit(price, measurement, unit);
  }, [price, measurement, unit]);

  return (
    <div className="product-card group relative border rounded-lg overflow-hidden bg-white shadow-sm h-full flex flex-col min-w-0 w-full">
      <Link href={`/products/${_id}`} className="block flex-shrink-0">
        <div className="relative overflow-hidden aspect-square w-full">
          <img
            src={getProductImageUrl(image, 'card')}
            alt={name}
            loading="lazy"
            width={400}
            height={400}
            className="w-full h-full object-cover object-center"
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
      <div className="p-2 sm:p-3 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-primary transition-colors bangla-title">
          <Link href={`/products/${_id}`}>{name}</Link>
        </h3>

        {/* Description - Show on mobile with larger text */}
        {(shortDescription || description) && (
          <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-1 bangla-body">
            {shortDescription || (description && description.length > 100 ? description.substring(0, 100) + '...' : description)}
          </p>
        )}
        

        {/* Price */}
        <div className="mb-3">
          <p className="text-base sm:text-lg font-bold text-primary">
            ৳{price}
            {unit !== "pcs" && (
              <span className="text-sm font-normal text-gray-600">
                {" "}/ {measurementDisplay.displayText}
              </span>
            )}
          </p>
          {unit !== "pcs" && (
            <p className="text-sm text-gray-500">
              {pricePerUnitDisplay}
            </p>
          )}
        </div>

        {/* Add to Cart Button - Pushed to bottom */}
        <div className="mt-auto pt-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="w-full bg-green-800 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-md flex items-center justify-center hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <ShoppingCart size={16} className="mr-2" />
            <span className="text-sm sm:text-base">{inStock ? "Add to Cart" : "Out of Stock"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Memoize ProductCard to prevent unnecessary re-renders in product lists
export default memo(ProductCard);