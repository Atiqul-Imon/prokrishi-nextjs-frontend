'use client';

import Link from 'next/link';
import ProductStatusBadge from './ProductStatusBadge';

export default function ProductRow({ product, onDelete }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-4 py-3">
        <img src={product.image || '/img/placeholder.png'} alt={product.name} className="w-10 h-10 object-cover rounded" />
      </td>
      <td className="px-4 py-3 font-medium">{product.name}</td>
      <td className="px-4 py-3">{product.category?.name || ''}</td>
      <td className="px-4 py-3">৳{product.price}</td>
      <td className="px-4 py-3">{product.stock}</td>
      <td className="px-4 py-3">
        <ProductStatusBadge status={product.status} />
      </td>
      <td className="px-4 py-3">
        <Link href={`/dashboard/products/${product._id}`} className="text-green-600 hover:underline mr-4">Edit</Link>
        <button
          className="text-red-600 hover:underline"
          onClick={() => onDelete(product._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}