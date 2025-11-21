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
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                {onSelect && (
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = someSelected && !allSelected;
                      }}
                      onChange={(e) => onSelectAll?.(e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-gray-400 rounded focus:ring-amber-500 cursor-pointer bg-white"
                    />
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                  Featured
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mb-4 border border-gray-300 shadow-xl">
                        <Package className="w-10 h-10 text-gray-600" />
                      </div>
                      <p className="text-lg font-black text-gray-900 mb-1">No products found</p>
                      <p className="text-sm text-gray-700">
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
          <div className="border-t border-gray-200 p-6 bg-gray-50">
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
