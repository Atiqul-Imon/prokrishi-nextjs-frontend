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
import { formatMeasurement } from "@/app/utils/measurement";
import {
  getPrimaryProductImageSource,
  getSecondaryProductImageSource,
} from "@/utils/productImages";

function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const {
    _id,
    name,
    price,
    stock,
    measurement,
    unit,
  } = product;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, id: _id }, 1);
  }, [product, _id, addToCart]);

  const inStock = useMemo(() => stock > 0, [stock]);

  const primaryImageSource = useMemo(
    () => getPrimaryProductImageSource(product),
    [product],
  );
  const hoverImageSource = useMemo(
    () => getSecondaryProductImageSource(product),
    [product],
  );
  const primaryImageUrl = useMemo(
    () => getProductImageUrl(primaryImageSource, "card"),
    [primaryImageSource],
  );
  const hoverImageUrl = useMemo(
    () => (hoverImageSource ? getProductImageUrl(hoverImageSource, "card") : null),
    [hoverImageSource],
  );
  
  // Format measurement for display
  const measurementDisplay = useMemo(() => {
    return formatMeasurement(measurement, unit);
  }, [measurement, unit]);

  return (
    <div className="product-card group relative border rounded-lg overflow-hidden bg-white shadow-sm h-full flex flex-col min-w-0 w-full">
      <Link href={`/products/${_id}`} className="block flex-shrink-0">
        <div className="relative overflow-hidden aspect-square w-full">
          <img
            src={primaryImageUrl}
            alt={name}
            loading="lazy"
            width={400}
            height={400}
            className={`w-full h-full object-cover object-center ${hoverImageUrl ? "transition-opacity duration-300 group-hover:opacity-0" : ""}`}
          />
          {hoverImageUrl && (
            <img
              src={hoverImageUrl}
              alt={`${name} alternate`}
              loading="lazy"
              width={400}
              height={400}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
          )}
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
      <div className="p-2 sm:p-3 flex flex-col flex-grow min-h-0">
        {/* Title - Fixed height, centered */}
        <h3 className="text-lg sm:text-xl font-semibold text-primary-800 mb-2 leading-snug tracking-tight line-clamp-2 hover:text-primary transition-colors bangla-title text-center flex-shrink-0">
          <Link href={`/products/${_id}`}>{name}</Link>
        </h3>
        
        {/* Spacer to push price and button to bottom */}
        <div className="flex-grow min-h-0"></div>

        {/* Price - Fixed at bottom before button, centered */}
        <div className="mb-3 flex-shrink-0 text-center">
          <p className="text-lg sm:text-xl font-bold text-primary">
            ৳{price}
            {unit !== "pcs" && (
              <span className="text-base font-normal text-gray-600">
                {" "}/ {measurementDisplay.displayText}
              </span>
            )}
          </p>
        </div>

        {/* Add to Cart Button - Fixed at bottom */}
        <div className="flex-shrink-0 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="w-full bg-amber-600 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-md flex items-center justify-center hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <span className="text-sm sm:text-base">{inStock ? "Add to Cart" : "Out of Stock"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Memoize ProductCard to prevent unnecessary re-renders in product lists
export default memo(ProductCard);