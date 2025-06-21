'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getResourceList, deleteResource } from '@/app/utils/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError('');
      try {
        const data = await getResourceList('category');
        setCategories(data.categories || data); // Handle both { categories } and array response
      } catch (err) {
        setError(err.message || 'Error loading categories');
      }
      setLoading(false);
    }
    fetchCategories();
  }, [refresh]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteResource('category/delete', id);
      setRefresh(r => r + 1);
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/dashboard/categories/add" className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">
          + Add Category
        </Link>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-500 py-8 text-center">Loading...</div>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-6">No categories found.</td>
              </tr>
            ) : (
              categories.map(c => (
                <tr key={c._id} className="border-b">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c.slug}</td>
                  <td className="px-4 py-3">{c.description}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/categories/${c._id}`} className="text-green-600 hover:underline mr-4">Edit</Link>
                    <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}