"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fishInventoryApi, fishProductApi } from "@/app/utils/fishApi";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { Card, CardHeader, CardContent } from "../../../components/Card";
import { Plus, Trash2, X } from "lucide-react";

interface FishItem {
  sizeCategoryId: string;
  actualWeight: string;
  costPrice: string;
}

export default function AddFishInventoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fishProducts, setFishProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [fishItems, setFishItems] = useState<FishItem[]>([
    { sizeCategoryId: "", actualWeight: "", costPrice: "" },
  ]);
  const [commonFields, setCommonFields] = useState({
    purchaseDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    location: "",
    notes: "",
  });
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

  useEffect(() => {
    async function fetchFishProducts() {
      try {
        const result: any = await fishProductApi.getAll({ limit: 1000 });
        setFishProducts(result.fishProducts || []);
      } catch (err) {
        showError("Failed to load fish products");
      }
    }
    fetchFishProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedProductData = fishProducts.find((p) => p._id === selectedProduct);
  const sizeCategories = selectedProductData?.sizeCategories || [];

  const addFishItem = () => {
    setFishItems([...fishItems, { sizeCategoryId: "", actualWeight: "", costPrice: "" }]);
  };

  const removeFishItem = (index: number) => {
    if (fishItems.length > 1) {
      setFishItems(fishItems.filter((_, i) => i !== index));
    }
  };

  const updateFishItem = (index: number, field: keyof FishItem, value: string) => {
    const updated = [...fishItems];
    updated[index] = { ...updated[index], [field]: value };
    setFishItems(updated);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!selectedProduct) {
      showError("Please select a fish product");
      setLoading(false);
      return;
    }

    // Validate all items
    const invalidItems = fishItems.filter(
      (item) => !item.sizeCategoryId || !item.actualWeight || parseFloat(item.actualWeight) <= 0
    );

    if (invalidItems.length > 0) {
      showError("Please fill in all required fields (size category and weight) for all fish items");
      setLoading(false);
      return;
    }

    try {
      // Prepare items for bulk add
      const items = fishItems.map((item) => ({
        fishProduct: selectedProduct,
        sizeCategoryId: item.sizeCategoryId,
        actualWeight: parseFloat(item.actualWeight),
        purchaseDate: commonFields.purchaseDate || undefined,
        expiryDate: commonFields.expiryDate || undefined,
        location: commonFields.location || undefined,
        costPrice: item.costPrice ? parseFloat(item.costPrice) : undefined,
        notes: commonFields.notes || undefined,
      }));

      const result: any = await fishInventoryApi.bulkAdd(items);
      success(
        `Successfully added ${result.added} fish item${result.added !== 1 ? "s" : ""} to inventory`
      );
      if (result.errors && result.errors.length > 0) {
        showError(`Some items failed: ${result.errors.map((e: any) => e.error).join(", ")}`);
      }
      setTimeout(() => {
        router.push("/dashboard/fish/inventory");
      }, 1500);
    } catch (err: any) {
      showError(err.message || "Failed to add fish to inventory");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Add Fish to Inventory"
          description="Add multiple fish items with different variants in one go"
        />
        <CardContent>
          <div className="space-y-2">
            {messages.map((msg) => (
              <InlineMessage
                key={msg.id}
                type={msg.type}
                message={msg.message}
                onClose={() => removeMessage(msg.id)}
              />
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fish Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fish Product *
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  // Reset all items when product changes
                  setFishItems([{ sizeCategoryId: "", actualWeight: "", costPrice: "" }]);
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Select a fish product</option>
                {fishProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Multiple Fish Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Fish Items *
                </label>
                <button
                  type="button"
                  onClick={addFishItem}
                  disabled={!selectedProduct}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {fishItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Fish Item #{index + 1}
                      </span>
                      {fishItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFishItem(index)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Size Category *
                        </label>
                        <select
                          value={item.sizeCategoryId}
                          onChange={(e) =>
                            updateFishItem(index, "sizeCategoryId", e.target.value)
                          }
                          required
                          disabled={!selectedProduct}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                        >
                          <option value="">Select size category</option>
                          {sizeCategories.map((cat: any) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.label} (৳{cat.pricePerKg.toFixed(2)}/kg)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Actual Weight (kg) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={item.actualWeight}
                          onChange={(e) =>
                            updateFishItem(index, "actualWeight", e.target.value)
                          }
                          required
                          placeholder="e.g., 2.5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cost Price (৳)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.costPrice}
                          onChange={(e) =>
                            updateFishItem(index, "costPrice", e.target.value)
                          }
                          placeholder="Price for this fish"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Fields */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Common Fields (Applied to all items)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={commonFields.purchaseDate}
                    onChange={(e) =>
                      setCommonFields({ ...commonFields, purchaseDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={commonFields.expiryDate}
                    onChange={(e) =>
                      setCommonFields({ ...commonFields, expiryDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={commonFields.location}
                  onChange={(e) =>
                    setCommonFields({ ...commonFields, location: e.target.value })
                  }
                  placeholder="Storage location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={commonFields.notes}
                  onChange={(e) =>
                    setCommonFields({ ...commonFields, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Additional notes (applied to all items)..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
              >
                {loading ? "Adding..." : (
                  <>
                    <Plus size={18} />
                    Add Fish
                  </>
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

