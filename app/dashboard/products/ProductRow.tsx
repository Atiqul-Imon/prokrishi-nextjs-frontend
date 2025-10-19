"use client";

import Link from "next/link";
import ProductStatusBadge from "./ProductStatusBadge";
import { useRouter } from "next/navigation";

export default function ProductRow({ product, onDelete, onToggleFeatured }) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/dashboard/products/${product._id}`);
  };

  const handleToggleFeatured = (e) => {
    e.stopPropagation();
    onToggleFeatured(product._id);
  };

  return (
    <tr
      className="border-b hover:bg-gray-50 transition cursor-pointer"
      onClick={handleRowClick}
    >
      <td className="px-4 py-3">
        <img
          src={product.image || "/img/placeholder.png"}
          alt={product.name}
          className="w-10 h-10 object-cover rounded"
        />
      </td>
      <td className="px-4 py-3 font-medium">{product.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{product.sku}</td>
      <td className="px-4 py-3">{product.category?.name || ""}</td>
      <td className="px-4 py-3">৳{product.price}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span>
            {product.stock} {product.unit}
          </span>
          {product.stock > 0 && product.stock <= product.lowStockThreshold && (
            <span
              className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full"
              title={`Low stock alert! Threshold: ${product.lowStockThreshold}`}
            >
              Low
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <ProductStatusBadge status={product.status} />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={handleToggleFeatured}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            product.isFeatured
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {product.isFeatured ? "Featured" : "Not Featured"}
        </button>
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/dashboard/products/edit/${product._id}`}
          className="text-green-600 hover:underline mr-4"
          onClick={(e) => e.stopPropagation()}
        >
          Edit
        </Link>
        <button
          className="text-red-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product._id);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
