'use client';

export default function ProductStatusBadge({ status }) {
  let color = "bg-gray-200 text-gray-700";
  if (status === "active") color = "bg-green-100 text-green-700";
  if (status === "inactive") color = "bg-yellow-100 text-yellow-700";
  if (status === "out_of_stock") color = "bg-red-100 text-red-700";
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
      {status === "active" ? "Active" : status === "inactive" ? "Inactive" : "Out of Stock"}
    </span>
  );
}