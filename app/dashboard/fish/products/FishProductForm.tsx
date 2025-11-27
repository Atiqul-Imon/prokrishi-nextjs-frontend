"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getResourceList } from "@/app/utils/api";
import { Plus, X, Trash2 } from "lucide-react";
import { FishSizeCategory } from "@/types/models";

interface FishProductFormData {
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  image: FileList | null;
  sizeCategories: FishSizeCategory[];
  status: "active" | "inactive";
  isFeatured: boolean;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
}

export default function FishProductForm({
  initial,
  onSave,
  loading,
}: {
  initial?: any;
  onSave: (data: FormData) => Promise<void>;
  loading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FishProductFormData>({
    defaultValues: {
      name: "",
      category: "",
      description: "",
      shortDescription: "",
      image: null,
      sizeCategories: [],
      status: "active",
      isFeatured: false,
      tags: [],
      metaTitle: "",
      metaDescription: "",
    },
  });

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [sizeCategories, setSizeCategories] = useState<FishSizeCategory[]>([]);
  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (initial && initial._id && !formInitialized) {
      const formData = {
        name: initial.name || "",
        category: initial.category?._id || initial.category || "",
        description: initial.description || "",
        shortDescription: initial.shortDescription || "",
        status: initial.status || "active",
        isFeatured: initial.isFeatured || false,
        tags: initial.tags || [],
        metaTitle: initial.metaTitle || "",
        metaDescription: initial.metaDescription || "",
      };
      reset(formData);
      if (initial.sizeCategories && initial.sizeCategories.length > 0) {
        setSizeCategories(initial.sizeCategories.map((cat: any) => ({
          _id: cat._id || undefined,
          label: cat.label,
          pricePerKg: cat.pricePerKg,
          stock: cat.stock !== undefined ? cat.stock : 0,
          minWeight: cat.minWeight,
          maxWeight: cat.maxWeight,
          sku: cat.sku,
          status: cat.status || "active",
          isDefault: cat.isDefault || false,
        })));
      }
      setFormInitialized(true);
    }
  }, [initial, reset, formInitialized]);

  useEffect(() => {
    async function fetchCategories() {
      setCatLoading(true);
      try {
        const data = await getResourceList("category");
        const categoriesList = data.categories || data;
        setCategories(categoriesList);
        
        // Auto-select "মাছ" category if not editing
        if (!initial?._id) {
          const machhCategory = categoriesList.find((cat: any) => cat.name === "মাছ");
          if (machhCategory) {
            setValue("category", machhCategory._id);
          }
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
      setCatLoading(false);
    }
    fetchCategories();
  }, [initial, setValue]);

  function addSizeCategory() {
    setSizeCategories([
      ...sizeCategories,
      {
        _id: undefined,
        label: "",
        pricePerKg: 0,
        stock: 0,
        status: "active",
        isDefault: sizeCategories.length === 0,
      },
    ]);
  }

  function removeSizeCategory(index: number) {
    const newCategories = sizeCategories.filter((_, i) => i !== index);
    if (newCategories.length > 0 && newCategories[0].isDefault !== true) {
      newCategories[0].isDefault = true;
    }
    setSizeCategories(newCategories);
  }

  function updateSizeCategory(index: number, field: keyof FishSizeCategory, value: any) {
    const newCategories = [...sizeCategories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setSizeCategories(newCategories);
  }

  function onSubmit(data: FishProductFormData) {
    if (loading) return;

    if (sizeCategories.length === 0) {
      alert("Please add at least one size category");
      return;
    }

    for (let i = 0; i < sizeCategories.length; i++) {
      const cat = sizeCategories[i];
      if (!cat.label || !cat.label.trim()) {
        alert(`Size category ${i + 1} must have a label`);
        return;
      }
      if (!cat.pricePerKg || cat.pricePerKg <= 0) {
        alert(`Size category ${i + 1} must have a valid price per kg`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("description", data.description || "");
    formData.append("shortDescription", data.shortDescription || "");
    formData.append("status", data.status);
    formData.append("isFeatured", String(data.isFeatured));
    if (data.metaTitle) formData.append("metaTitle", data.metaTitle);
    if (data.metaDescription) formData.append("metaDescription", data.metaDescription);
    if (data.tags && data.tags.length > 0) {
      formData.append("tags", JSON.stringify(data.tags));
    }

    formData.append(
      "sizeCategories",
      JSON.stringify(
        sizeCategories.map((cat) => ({
        label: cat.label.trim(),
        pricePerKg: Number(cat.pricePerKg),
        stock: cat.stock !== undefined ? Number(cat.stock) : 0,
        minWeight: cat.minWeight ? Number(cat.minWeight) : undefined,
        maxWeight: cat.maxWeight ? Number(cat.maxWeight) : undefined,
        sku: cat.sku?.trim() || undefined,
        status: cat.status,
        isDefault: cat.isDefault || false,
        }))
      )
    );

    if (data.image && data.image[0] && data.image[0] instanceof File) {
      formData.append("image", data.image[0]);
    } else if (initial?.image && !data.image) {
      formData.append("image", initial.image);
    }

    onSave(formData);
  }

  const imageFile = watch("image");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            {...register("name", { required: "Product name is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          {catLoading ? (
            <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
              Loading categories...
            </div>
          ) : (
            <select
              {...register("category", { required: "Category is required" })}
              disabled={!initial?._id}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a category</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
          {!initial?._id && (
            <p className="mt-1 text-xs text-gray-500">Automatically set to "মাছ" category</p>
          )}
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description
        </label>
        <input
          type="text"
          {...register("shortDescription")}
          maxLength={100}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[180px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        {initial?.image && !imageFile?.[0] && (
          <div className="mt-2">
            <img
              src={initial.image}
              alt="Current"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Size Categories *</h3>
          <button
            type="button"
            onClick={addSizeCategory}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus size={18} />
            Add Size Category
          </button>
        </div>

        {sizeCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            No size categories added. Click "Add Size Category" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {sizeCategories.map((cat, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {cat.isDefault && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                        Default
                      </span>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      Size Category {index + 1}
                    </span>
                  </div>
                  {sizeCategories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeCategory(index)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Label *
                    </label>
                    <input
                      type="text"
                      value={cat.label}
                      onChange={(e) =>
                        updateSizeCategory(index, "label", e.target.value)
                      }
                      placeholder="e.g., 2kg size"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Price per kg (৳) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={cat.pricePerKg || ""}
                      onChange={(e) =>
                        updateSizeCategory(
                          index,
                          "pricePerKg",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={cat.stock !== undefined ? cat.stock : ""}
                      onChange={(e) =>
                        updateSizeCategory(
                          index,
                          "stock",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Min Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={cat.minWeight || ""}
                      onChange={(e) =>
                        updateSizeCategory(
                          index,
                          "minWeight",
                          e.target.value ? parseFloat(e.target.value) : undefined
                        )
                      }
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Max Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={cat.maxWeight || ""}
                      onChange={(e) =>
                        updateSizeCategory(
                          index,
                          "maxWeight",
                          e.target.value ? parseFloat(e.target.value) : undefined
                        )
                      }
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={cat.sku || ""}
                      onChange={(e) =>
                        updateSizeCategory(index, "sku", e.target.value)
                      }
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Status
                    </label>
                    <select
                      value={cat.status || "active"}
                      onChange={(e) =>
                        updateSizeCategory(
                          index,
                          "status",
                          e.target.value as "active" | "inactive" | "out_of_stock"
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-gray-700">Featured Product</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving..." : initial ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

