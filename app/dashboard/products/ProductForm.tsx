"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getResourceList } from "@/app/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define a schema for validation
const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100, "Product name must be less than 100 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be a positive number").max(999999, "Price is too high"),
  measurement: z.coerce
    .number()
    .positive("Measurement must be a positive number")
    .max(999999, "Measurement is too high"),
  unit: z.enum(["pcs", "kg", "g", "l", "ml"]),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").max(999999, "Stock is too high"),
  lowStockThreshold: z.coerce
    .number()
    .int()
    .min(0, "Threshold must be a non-negative number")
    .max(999999, "Threshold is too high")
    .optional(),
  status: z.enum(["active", "inactive", "out_of_stock"]),
  isFeatured: z.boolean().optional(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  shortDescription: z.string().max(100, "Short description must be less than 100 characters").optional(),
  image: z.any().optional(),
});

export default function ProductForm({ initial, onSave, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      measurement: 1,
      unit: "pcs",
      stock: 0,
      lowStockThreshold: 5,
      status: "active",
      isFeatured: false,
      description: "",
      shortDescription: "",
      image: null,
    },
  });

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");
  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    // If there's initial data, reset the form with it (only once)
    if (initial && initial._id && !formInitialized) {
      console.log("Setting form data with initial:", initial);
      const formData = {
        ...initial,
        category: initial.category?._id || initial.category || "", // Handle populated category safely
      };
      console.log("Form data to set:", formData);
      reset(formData);
      setFormInitialized(true);
    }
  }, [initial, reset, formInitialized]);

  useEffect(() => {
    async function fetchCategories() {
      setCatLoading(true);
      try {
        // Add cache-busting timestamp to ensure fresh data
        const timestamp = Date.now();
        const data = await getResourceList("category", `t=${timestamp}`);
        setCategories(data.categories || data);
      } catch (err) {
        setCatError(err.message || "Failed to load categories");
      }
      setCatLoading(false);
    }
    fetchCategories();
  }, []);

  function onSubmit(data) {
    console.log("Form submitted with data:", data);
    const formData = { ...data };
    
    // Handle image file
    if (data.image && data.image[0]) {
      formData.image = data.image[0]; // Extract the file from the FileList
    } else {
      delete formData.image; // Don't send empty image field
    }
    
    // Clean up form data
    Object.keys(formData).forEach(key => {
      if (formData[key] === '' || formData[key] === null) {
        delete formData[key];
      }
    });
    
    console.log("Submitting form data:", formData);
    onSave?.(formData);
  }

  const Input = ({ name, label, error, multilang = false, ...props }) => (
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
        className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${
          multilang ? 'bangla-text' : ''
        } ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <span className="text-red-600 text-sm mt-1 block">{error.message}</span>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm w-full max-w-5xl mx-auto">
      <form
        className="p-4 md:p-6 space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >

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

        {/* Basic Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Basic Information
          </h3>
          
          <Input
            name="name"
            label="Product Name"
            placeholder="e.g., Organic Honey বা চাল, ডাল, তেল (supports both English and Bangla)"
            error={errors.name}
            multilang={true}
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
                className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.category ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
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

          <div>
            <label
              htmlFor="shortDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Short Description (Optional)
            </label>
            <input
              id="shortDescription"
              {...register("shortDescription")}
              placeholder="Brief product summary... বা পণ্যের সংক্ষিপ্ত বর্ণনা... (max 100 characters, supports both English and Bangla)"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bangla-text"
              maxLength={100}
            />
            {errors.shortDescription && (
              <span className="text-red-600 text-sm mt-1 block">{errors.shortDescription.message}</span>
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
              placeholder="Detailed product description... বা পণ্যের বিস্তারিত বর্ণনা... (supports both English and Bangla)"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bangla-text"
              rows={3}
            />
          </div>
        </div>

        {/* Pricing & Inventory Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Pricing & Inventory
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              name="price"
              type="number"
              label="Price (৳)"
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="pcs">Pieces (pcs)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="l">Liters (l)</option>
                <option value="ml">Milliliters (ml)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Options Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Product Options
          </h3>
          
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
        </div>

        {/* Product Image Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Product Image
          </h3>
          
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {initial?._id ? "Replace Product Image" : "Product Image"}
            </label>
            {initial?.image && (
              <div className="my-2">
                <div className="relative inline-block">
                  <img
                    src={initial.image}
                    alt="Current product"
                    className="w-32 h-32 object-cover rounded-md border border-gray-200"
                  />
                  <div className="absolute top-1 right-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Current
                  </div>
                </div>
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
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 border border-gray-300 rounded-lg p-2"
            />
            {errors.image && (
              <span className="text-red-600 text-sm mt-1">
                {errors.image.message as string}
              </span>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              if (initial) {
                // Reset to original data in edit mode
                console.log("Resetting to original data:", initial);
                reset({
                  ...initial,
                  category: initial.category?._id || initial.category || "",
                });
                setFormInitialized(true);
              } else {
                // Reset to default values in create mode
                console.log("Resetting to default values");
                reset();
                setFormInitialized(false);
              }
            }}
            className="w-full sm:w-auto bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {initial ? "Reset to Original" : "Reset Form"}
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {initial ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                {initial ? "Update Product" : "Save Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
