'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  function handleCheckout() {
    router.push('/checkout');
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart size={28} className="text-green-600" />
        Cart
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow text-center">
          <p className="text-gray-700 mb-4">Your cart is empty.</p>
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
          >
            Shop Products
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          <ul>
            {cart.map((item) => (
              <li
                key={item.id || item._id}
                className="flex items-center gap-4 py-4 border-b last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain rounded border"
                />
                <div className="flex-1">
                  <Link href={`/products/${item.id || item._id}`}>
                    <span className="font-semibold hover:underline">{item.name}</span>
                  </Link>
                  <div className="text-gray-900 font-bold">
                    ৳{item.price}
                    {item.originalPrice && (
                      <span className="text-gray-400 line-through ml-2 text-sm">
                        ৳{item.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-2 gap-2">
                    <button
                      aria-label="Reduce quantity"
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                      onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                      onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-semibold mb-2">
                    ৳{item.price * item.quantity}
                  </div>
                  <button
                    aria-label="Remove"
                    onClick={() => removeFromCart(item.id || item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-end mt-6">
            <div className="text-lg font-bold">
              Total: <span className="text-green-600">৳{total}</span>
            </div>
            <button
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;