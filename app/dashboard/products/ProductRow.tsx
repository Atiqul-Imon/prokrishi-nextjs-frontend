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
      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
        isSelected ? "bg-emerald-50/50" : ""
      }`}
      onClick={handleRowClick}
    >
      {/* Checkbox */}
      {onSelect && (
        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
          />
        </td>
      )}

      {/* Image */}
      <td className="px-4 py-4">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={20} className="text-slate-400" />
            </div>
          )}
        </div>
      </td>

      {/* Name */}
      <td className="px-4 py-4">
        <div>
          <div className="font-semibold text-slate-900 mb-1">{product.name}</div>
          {product.shortDescription && (
            <div className="text-xs text-slate-500 line-clamp-1">{product.shortDescription}</div>
          )}
        </div>
      </td>

      {/* SKU */}
      <td className="px-4 py-4">
        <div className="text-sm text-slate-600 font-mono">{product.sku || "—"}</div>
      </td>

      {/* Category */}
      <td className="px-4 py-4">
        <div className="text-sm text-slate-700">
          {product.category?.name || (
            <span className="text-slate-400 italic">Uncategorized</span>
          )}
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-4">
        <div className="font-semibold text-slate-900">
          ৳{product.price?.toFixed(2) || "0.00"}
        </div>
        {product.hasVariants && product.variantSummary && (
          <div className="text-xs text-slate-500">
            ৳{product.variantSummary.minPrice} - ৳{product.variantSummary.maxPrice}
          </div>
        )}
      </td>

      {/* Stock */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">
            {stock} {product.unit || "pcs"}
          </span>
          {isLowStock && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
              Low
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full border border-rose-200">
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
      <td className="px-4 py-4">
        <button
          onClick={handleToggleFeatured}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            product.isFeatured
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
          }`}
        >
          {product.isFeatured ? (
            <>
              <Star size={12} />
              Featured
            </>
          ) : (
            <>
              <StarOff size={12} />
              Not Featured
            </>
          )}
        </button>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/dashboard/products/edit/${product._id}`}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={() => onDelete(product._id)}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
