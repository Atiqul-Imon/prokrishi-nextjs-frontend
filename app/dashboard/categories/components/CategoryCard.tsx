"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Star, StarOff, Package } from "lucide-react";

interface CategoryCardProps {
  category: any;
  onToggleFeatured: (category: any) => void;
  onDelete: (id: string, name: string) => void;
  isToggling?: boolean;
}

export const CategoryCard = ({
  category,
  onToggleFeatured,
  onDelete,
  isToggling = false,
}: CategoryCardProps) => {
  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Featured Badge */}
      {category.isFeatured && (
        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white p-1.5 rounded-full shadow-lg">
          <Star size={16} className="fill-current" />
        </div>
      )}

      {/* Category Image */}
      <Link href={`/dashboard/categories/edit/${category._id}`}>
        <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={48} className="text-slate-400" />
            </div>
          )}
        </div>
      </Link>

      {/* Category Info */}
      <div className="p-4">
        <Link href={`/dashboard/categories/edit/${category._id}`}>
          <h3 className="font-semibold text-lg text-slate-900 mb-1 capitalize hover:text-emerald-600 transition-colors">
            {category.name}
          </h3>
        </Link>
        <p className="text-sm text-slate-600 line-clamp-2 min-h-[2.5rem] mb-4">
          {category.description || "No description available"}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {/* Featured Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFeatured(category)}
              disabled={isToggling}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                category.isFeatured
                  ? "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
              } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {category.isFeatured ? (
                <>
                  <Star size={14} className="fill-current" />
                  Featured
                </>
              ) : (
                <>
                  <StarOff size={14} />
                  Not Featured
                </>
              )}
              {isToggling && (
                <span className="ml-1 text-xs text-slate-400">Updating...</span>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/categories/edit/${category._id}`}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Edit Category"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => onDelete(category._id, category.name)}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Category"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

