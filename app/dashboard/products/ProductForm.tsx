"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getResourceList } from "@/app/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define a schema for validation
const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  category: z.string().nonempty("Category is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  measurement: z.coerce
    .number()
    .positive("Measurement must be a positive number"),
  unit: z.enum(["pcs", "kg", "g", "l", "ml"]),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  lowStockThreshold: z.coerce
    .number()
    .int()
    .min(0, "Threshold must be a non-negative number")
    .optional(),
  status: z.enum(["active", "inactive", "out_of_stock"]),
  isFeatured: z.boolean().optional(),
  description: z.string().optional(),
  image: z.any().optional(),
});

export default function ProductForm({ initial, onSave, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initial || {
      name: "",
      category: "",
      price: "",
      measurement: 1,
      unit: "pcs",
      stock: "",
      lowStockThreshold: 5,
      status: "active",
      isFeatured: false,
      description: "",
      image: null,
    },
  });

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");

  useEffect(() => {
    // If there's initial data, reset the form with it
    if (initial) {
      reset({
        ...initial,
        category: initial.category._id || initial.category, // Handle populated category
      });
    }
  }, [initial, reset]);

  useEffect(() => {
    async function fetchCategories() {
      setCatLoading(true);
      try {
        const data = await getResourceList("category");
        setCategories(data.categories || data);
      } catch (err) {
        setCatError(err.message || "Failed to load categories");
      }
      setCatLoading(false);
    }
    fetchCategories();
  }, []);

  function onSubmit(data) {
    const formData = { ...data };
    if (data.image && data.image[0]) {
      formData.image = data.image[0]; // Extract the file from the FileList
    } else {
      delete formData.image; // Don't send empty image field
    }
    onSave?.(formData);
  }

  const Input = ({ name, label, error, ...props }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        {...register(name)}
        {...props}
        className={`w-full border px-3 py-2 rounded ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && (
        <span className="text-red-600 text-sm mt-1">{error.message}</span>
      )}
    </div>
  );

  return (
    <form
      className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-bold mb-4">
        {initial ? "Edit Product" : "Add New Product"}
      </h2>

      {initial?.sku && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <input
            type="text"
            value={initial.sku}
            readOnly
            className="w-full bg-gray-100 border-gray-300 px-3 py-2 rounded"
          />
        </div>
      )}

      <Input
        name="name"
        label="Product Name"
        placeholder="e.g., Organic Honey"
        error={errors.name}
      />

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        {catLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : catError ? (
          <div className="text-red-600">{catError}</div>
        ) : (
          <select
            id="category"
            {...register("category")}
            className={`w-full border px-3 py-2 rounded ${errors.category ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
         {errors.category && (
           <span className="text-red-600 text-sm mt-1">
             {errors.category.message as string}
           </span>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="measurement"
          type="number"
          label="Measurement"
          placeholder="e.g., 500"
          error={errors.measurement}
        />
        <div>
          <label
            htmlFor="unit"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Unit
          </label>
          <select
            id="unit"
            {...register("unit")}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="pcs">Pieces (pcs)</option>
            <option value="kg">Kilograms (kg)</option>
            <option value="g">Grams (g)</option>
            <option value="l">Liters (l)</option>
            <option value="ml">Milliliters (ml)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="price"
          type="number"
          label="Price"
          placeholder="99.99"
          step="0.01"
          error={errors.price}
        />
        <Input
          name="stock"
          type="number"
          label="Stock Quantity"
          placeholder="100"
          error={errors.stock}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="lowStockThreshold"
          type="number"
          label="Low Stock Threshold"
          placeholder="5"
          error={errors.lowStockThreshold}
        />
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="isFeatured"
          type="checkbox"
          {...register("isFeatured")}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label
          htmlFor="isFeatured"
          className="ml-2 block text-sm text-gray-700"
        >
          Mark as Featured Product
        </label>
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {initial?._id ? "Replace Product Image" : "Product Image"}
        </label>
        {initial?.image && (
          <div className="my-2">
            <img
              src={initial.image}
              alt="Current product"
              className="w-32 h-32 object-cover rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Current image. Upload a new file to replace it.
            </p>
          </div>
        )}
        <input
          id="image"
          {...register("image")}
          type="file"
          accept="image/*"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
        {errors.image && (
          <span className="text-red-600 text-sm mt-1">
            {errors.image.message as string}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Detailed product description..."
          className="w-full border border-gray-300 px-3 py-2 rounded"
          rows={4}
        />
      </div>

      <div className="flex gap-4 justify-end pt-4">
        <button
          type="button"
          onClick={() => reset()}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Reset
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading
            ? initial
              ? "Updating..."
              : "Saving..."
            : initial
              ? "Update Product"
              : "Save Product"}
        </button>
      </div>
    </form>
  );
}
