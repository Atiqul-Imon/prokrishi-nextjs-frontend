'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

function ProductCard({ id, _id, image, name, price, originalPrice, ...rest }) {
  const { addToCart } = useCart();
  // Always use the correct id for cart logic
  const productId = id || _id;

  function handleAddToCart(e) {
    e.preventDefault();
    addToCart({
      id: productId, // <-- always use .id for the cart
      name,
      image,
      price,
      originalPrice,
      ...rest,
    }, 1);
  }

  return (
    <Link href={`/products/${productId}`}>
      <div className="bg-white w-80 h-96 rounded-lg shadow hover:shadow-md p-4 transition duration-200 flex flex-col justify-center items-center text-center cursor-pointer">
        <img src={image} alt={name} className="w-80 h-80 object-contain mb-4" />
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <div className="text-gray-900 font-bold text-lg mb-1">৳{price}</div>
        {originalPrice && (
          <div className="text-gray-500 line-through text-sm">৳{originalPrice}</div>
        )}
        <div className="mt-3 flex gap-2 w-full">
          <button
            onClick={handleAddToCart}
            className="bg-gray-900 text-white w-full py-2 rounded-md flex justify-center items-center hover:bg-green-700 transition"
          >
            <ShoppingCart size={18} className="mr-2" /> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;