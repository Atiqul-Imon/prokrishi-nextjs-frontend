"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fishInventoryApi, fishProductApi } from "@/app/utils/fishApi";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { Card, CardHeader, CardContent } from "../../../components/Card";
import { Plus } from "lucide-react";

export default function AddFishInventoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fishProducts, setFishProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [formData, setFormData] = useState({
    fishProduct: "",
    sizeCategoryId: "",
    actualWeight: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    location: "",
    costPrice: "",
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
  }, [showError]);

  const selectedProductData = fishProducts.find((p) => p._id === formData.fishProduct);
  const sizeCategories = selectedProductData?.sizeCategories || [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!formData.fishProduct || !formData.sizeCategoryId || !formData.actualWeight) {
      showError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      await fishInventoryApi.add({
        fishProduct: formData.fishProduct,
        sizeCategoryId: formData.sizeCategoryId,
        actualWeight: parseFloat(formData.actualWeight),
        purchaseDate: formData.purchaseDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        location: formData.location || undefined,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        notes: formData.notes || undefined,
      });
      success("Fish added to inventory successfully");
      setTimeout(() => {
        router.push("/dashboard/fish/inventory");
      }, 1000);
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
          description="Add individual fish with actual weight"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fish Product *
                </label>
                <select
                  value={formData.fishProduct}
                  onChange={(e) => {
                    setFormData({ ...formData, fishProduct: e.target.value, sizeCategoryId: "" });
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Category *
                </label>
                <select
                  value={formData.sizeCategoryId}
                  onChange={(e) => setFormData({ ...formData, sizeCategoryId: e.target.value })}
                  required
                  disabled={!formData.fishProduct}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select a size category</option>
                  {sizeCategories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.label} (৳{cat.pricePerKg.toFixed(2)}/kg)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.actualWeight}
                  onChange={(e) => setFormData({ ...formData, actualWeight: e.target.value })}
                  required
                  placeholder="e.g., 2.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Storage location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Price (৳)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                placeholder="Price paid for this fish"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
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

