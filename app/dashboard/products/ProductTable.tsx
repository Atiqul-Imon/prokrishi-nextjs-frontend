"use client";

import React from "react";
import ProductRow from "./ProductRow";
import Pagination from "./Pagination";
import { TableSkeleton } from "../components/SkeletonLoader";
import { Package, Search } from "lucide-react";
import { Card, CardContent } from "../components/Card";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ProductTableProps {
  products: any[];
  loading: boolean;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  selectedIds?: Set<string>;
  onSelect?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
}

export default function ProductTable({
  products,
  loading,
  onDelete,
  onToggleFeatured,
  pagination,
  onPageChange,
  selectedIds = new Set(),
  onSelect,
  onSelectAll,
}: ProductTableProps) {
  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p._id));
  const someSelected = products.some((p) => selectedIds.has(p._id));

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {onSelect && (
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = someSelected && !allSelected;
                      }}
                      onChange={(e) => onSelectAll?.(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={onSelect ? 10 : 9}
                    className="px-4 py-12 text-center"
                  >
                    <TableSkeleton />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={onSelect ? 10 : 9}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-lg font-semibold text-slate-900 mb-1">No products found</p>
                      <p className="text-sm text-slate-500">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <ProductRow
                    key={product._id}
                    product={product}
                    onDelete={onDelete}
                    onToggleFeatured={onToggleFeatured}
                    isSelected={selectedIds.has(product._id)}
                    onSelect={onSelect}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination && pagination.totalPages > 1 && onPageChange && (
          <div className="border-t border-slate-200 p-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalProducts}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
