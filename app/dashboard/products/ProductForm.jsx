'use client';

import React, { useEffect, useState } from 'react';
import { getResourceList } from '@/app/utils/api';

export default function ProductForm({ initial, onSave, loading }) {
  const [form, setForm] = useState(
    initial || {
      name: '',
      category: '',
      price: '',
      stock: '',
      status: 'active',
      image: '', // This will be a File or a URL
      description: '',
    }
  );
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      setCatLoading(true);
      setCatError('');
      try {
        const data = await getResourceList('category');
        setCategories(data.categories || data); // handle both array and {categories}
      } catch (err) {
        setCatError(err.message || 'Failed to load categories');
      }
      setCatLoading(false);
    }
    fetchCategories();
  }, []);

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFile(files[0]);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave?.({ ...form, image: file });
  }

  return (
    <form className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">{initial ? "Edit Product" : "Add Product"}</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full border px-3 py-2 rounded"
        required
      />

      {/* Category dropdown */}
      <div>
        {catLoading ? (
          <div className="text-gray-500">Loading categories...</div>
        ) : catError ? (
          <div className="text-red-600">{catError}</div>
        ) : (
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        name="stock"
        type="number"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="out_of_stock">Out of Stock</option>
      </select>
      <input
        name="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border px-3 py-2 rounded"
        rows={3}
      />
      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? (initial ? "Updating..." : "Adding...") : (initial ? "Update" : "Add")}
        </button>
      </div>
    </form>
  );
}