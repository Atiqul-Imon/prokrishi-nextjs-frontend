'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createResource } from '@/app/utils/api';

export default function AddCategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createResource('category/create', form);
      router.push('/dashboard/categories');
    } catch (err) {
      setError(err.message || 'Error creating category');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add Category</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Category Name"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          rows={3}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
}