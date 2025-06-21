'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { getProductById } from '@/app/utils/api';

export default function ProductDetailsPage() {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError('');
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      }
      setLoading(false);
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-16 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-16">{error}</div>;
  if (!product) return <div className="text-center text-gray-500 py-16">Product not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Product Image */}
        <img
          src={product.image || '/img/placeholder.png'}
          alt={product.name}
          className="w-full md:w-1/2 h-auto object-contain rounded-lg shadow"
        />

        {/* Product Info */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

          <div className="text-2xl font-semibold text-green-600">৳{product.price}</div>
          {product.originalPrice && (
            <div className="text-gray-500 line-through text-lg">৳{product.originalPrice}</div>
          )}

          <p className="text-gray-700">{product.description}</p>

          <button className="bg-green-600 text-white px-6 py-3 rounded-md flex items-center hover:bg-green-700 transition">
            <ShoppingCart size={20} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}