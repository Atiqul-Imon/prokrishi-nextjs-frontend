"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import ProductStatusBadge from "./ProductStatusBadge";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Star, StarOff, Package, Eye } from "lucide-react";

interface ProductRowProps {
  product: any;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export default function ProductRow({
  product,
  onDelete,
  onToggleFeatured,
  isSelected = false,
  onSelect,
}: ProductRowProps) {
  const router = useRouter();

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on checkbox or action buttons
    if (
      (e.target as HTMLElement).closest("input[type='checkbox']") ||
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a")
    ) {
      return;
    }
    router.push(`/dashboard/products/edit/${product._id}`);
  };

  const handleToggleFeatured = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFeatured(product._id);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect?.(product._id, e.target.checked);
  };

  const stock = product.stock || 0;
  const isLowStock = stock > 0 && stock <= 10;
  const isOutOfStock = stock === 0;

  return (
    <tr
      className={`border-b border-gray-200 hover:bg-gray-50 transition-all cursor-pointer ${
        isSelected ? "bg-amber-50 border-amber-200" : ""
      }`}
      onClick={handleRowClick}
    >
      {/* Checkbox */}
      {onSelect && (
        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-5 h-5 text-amber-600 border-gray-400 rounded focus:ring-amber-500 cursor-pointer bg-white"
          />
        </td>
      )}

      {/* Image */}
      <td className="px-6 py-4">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-300 bg-gray-100 shadow-lg">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={24} className="text-gray-600" />
            </div>
          )}
        </div>
      </td>

      {/* Name */}
      <td className="px-6 py-4">
        <div>
          <div className="font-bold text-gray-900 mb-1">{product.name}</div>
          {product.shortDescription && (
            <div className="text-xs text-gray-600 line-clamp-1">{product.shortDescription}</div>
          )}
        </div>
      </td>

      {/* SKU */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-700 font-mono">{product.sku || "—"}</div>
      </td>

      {/* Category */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-800">
          {product.category?.name || (
            <span className="text-gray-600 italic">Uncategorized</span>
          )}
        </div>
      </td>

      {/* Price */}
      <td className="px-6 py-4">
        <div className="font-bold text-gray-900">
          ৳{product.price?.toFixed(2) || "0.00"}
        </div>
        {product.hasVariants && product.variantSummary && (
          <div className="text-xs text-gray-700">
            ৳{product.variantSummary.minPrice} - ৳{product.variantSummary.maxPrice}
          </div>
        )}
      </td>

      {/* Stock */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{stock}</span>
          {isLowStock && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-300">
              Low
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full border border-rose-300">
              Out
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <ProductStatusBadge status={product.status} size="sm" />
      </td>

      {/* Featured */}
      <td className="px-6 py-4">
        <button
          onClick={handleToggleFeatured}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            product.isFeatured
              ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-300 hover:from-emerald-200 hover:to-teal-200 shadow-lg"
              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          {product.isFeatured ? (
            <>
              <Star size={14} className="fill-emerald-600" />
              Featured
            </>
          ) : (
            <>
              <StarOff size={14} />
              Not Featured
            </>
          )}
        </button>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/dashboard/products/edit/${product._id}`}
            className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-300"
            title="Edit"
          >
            <Edit size={18} />
          </Link>
          <button
            onClick={() => onDelete(product._id)}
            className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-300"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
