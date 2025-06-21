'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getResourceList, updateResource } from '@/app/utils/api';

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCategory() {
      setLoading(true);
      setError('');
      try {
        // Fetch all and find by id (since no direct by id endpoint)
        const data = await getResourceList('category');
        const category = (data.categories || data).find(c => c._id === id);
        if (category) setForm({ name: category.name, description: category.description || '' });
        else setError('Category not found');
      } catch (err) {
        setError(err.message || 'Error loading category');
      }
      setLoading(false);
    }
    if (id) fetchCategory();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateResource('category/update', id, form);
      router.push('/dashboard/categories');
    } catch (err) {
      setError(err.message || 'Error updating category');
    }
    setSaving(false);
  }

  if (loading) return <div className="text-center py-16 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-16">{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
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
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}