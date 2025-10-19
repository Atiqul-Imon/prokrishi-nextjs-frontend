"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/app/utils/api";
import toast from "react-hot-toast";
import {
  Package,
  Tag,
  DollarSign,
  Archive,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const InfoCard = ({ title, children, className = "" }: { title: string; children: any; className?: string }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
    <h3 className="text-lg font-semibold border-b pb-2 mb-4">{title}</h3>
    {children}
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start text-sm text-gray-700 mb-3">
    {React.cloneElement(icon, {
      className: "w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0",
    })}
    <div>
      <span className="font-medium mr-2">{label}:</span>
      <span>{value}</span>
    </div>
  </div>
);

const ProductStatus = ({ status }) => {
  const isPublished = status === "published";
  return (
    <span
      className={`flex items-center text-sm ${isPublished ? "text-green-600" : "text-red-600"}`}
    >
      {isPublished ? (
        <CheckCircle className="w-4 h-4 mr-2" />
      ) : (
        <XCircle className="w-4 h-4 mr-2" />
      )}
      {status}
    </span>
  );
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      setLoading(true);
      try {
        const data = await getProductById(id!);
        setProduct(data.product);
      } catch (err) {
        setError("Failed to load product details.");
        toast.error("Failed to load product details.");
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading)
    return <div className="text-center py-20">Loading product details...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product)
    return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link
            href="/dashboard/products"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            &larr; Back to Products
          </Link>
          <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
        </div>
        <Link
          href={`/dashboard/products/edit/${product._id}`}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <FileText className="w-4 h-4 mr-2" />
          Edit Product
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <InfoCard title="Product Image">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-md shadow-lg"
            />
          </InfoCard>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard title="Core Details">
            <InfoItem
              icon={<Package />}
              label="Product Name"
              value={product.name}
            />
            <InfoItem
              icon={<Tag />}
              label="Category"
              value={product.category?.name || "Uncategorized"}
            />
            <InfoItem
              icon={<DollarSign />}
              label="Price"
              value={`৳${product.price}`}
            />
            <InfoItem
              icon={<Archive />}
              label="Stock"
              value={`${product.stock} units`}
            />
            <InfoItem
              icon={<CheckCircle />}
              label="Status"
              value={<ProductStatus status={product.status} />}
            />
          </InfoCard>
          <InfoCard title="Description">
            <div className="text-sm text-gray-600 prose">
              {product.description || "No description provided."}
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
