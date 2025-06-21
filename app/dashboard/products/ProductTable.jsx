'use client';

import React from 'react';
import ProductRow from './ProductRow';

export default function ProductTable({ products, loading, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full table-auto text-left">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center text-gray-500 py-8">Loading...</td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-gray-500 py-8">No products found.</td>
            </tr>
          ) : (
            products.map((product) => (
              <ProductRow key={product._id} product={product} onDelete={onDelete} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}