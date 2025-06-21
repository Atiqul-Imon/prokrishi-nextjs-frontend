'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '../ProductForm';

export default function AddProductPage() {
  const router = useRouter();

  // onSave mock: you’d replace this with your API call
  function handleSave(product) {
    alert('Product added!\n' + JSON.stringify(product, null, 2));
    router.push('/dashboard/products');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <ProductForm onSave={handleSave} />
    </div>
  );
}