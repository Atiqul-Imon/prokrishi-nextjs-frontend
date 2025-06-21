'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '../ProductForm';
import { createProduct } from '@/app/utils/api'; // adjust path as needed

export default function AddProductPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave(product) {
    setError('');
    setLoading(true);
    try {
      await createProduct(product);
      router.push('/dashboard/products');
    } catch (err) {
      setError(err.message || 'Error creating product');
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      {error && (
        <div className="text-red-600 text-center mb-4">{error}</div>
      )}
      <ProductForm onSave={handleSave} loading={loading} />
    </div>
  );
}