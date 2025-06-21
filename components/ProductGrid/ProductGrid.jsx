'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '../ProductCard';
import { getAllProducts } from '@/app/utils/api';

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError('');
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <section className="py-10 px-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">Our Products</h2>
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-16">{error}</div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {products.map(product => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              image={product.image}
              price={product.price}
              // Optionally: originalPrice={product.originalPrice}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductGrid;