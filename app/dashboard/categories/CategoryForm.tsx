"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define a schema for validation
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  image: z.any().optional(),
  isFeatured: z.boolean().optional(),
});

export default function CategoryForm({ initial, onSave, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: initial || {
      name: "",
      description: "",
      image: null,
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (initial) {
      reset(initial);
    }
  }, [initial, reset]);

  function onSubmit(data) {
    const formData = { ...data };
    if (data.image && data.image[0]) {
      formData.image = data.image[0]; // Extract the file
    } else {
      delete formData.image; // Don't send empty image field
    }
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
        className={`w-full border px-3 py-2 rounded ${
          multilang ? 'bangla-text' : ''
        } ${error ? "border-red-500" : "border-gray-300"}`}
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
        {initial ? "Edit Category" : "Add New Category"}
      </h2>

      <Input
        name="name"
        label="Category Name"
        placeholder="e.g., Organic Vegetables"
        error={errors.name}
      />

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category Image
        </label>
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
          placeholder="Detailed category description..."
          className="w-full border border-gray-300 px-3 py-2 rounded"
          rows={4}
        />
      </div>

      <div className="flex items-center gap-4">
        <input
          id="isFeatured"
          type="checkbox"
          {...register("isFeatured")}
          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label
          htmlFor="isFeatured"
          className="text-sm font-medium text-gray-700"
        >
          Mark as Featured Category
        </label>
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
              ? "Update Category"
              : "Save Category"}
        </button>
      </div>
    </form>
  );
}
