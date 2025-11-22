"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fishInventoryApi, fishProductApi } from "@/app/utils/fishApi";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { Card, CardHeader, CardContent } from "../../../../components/Card";

export default function EditFishInventoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [inventoryItem, setInventoryItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    actualWeight: "",
    status: "available",
    purchaseDate: "",
    expiryDate: "",
    location: "",
    costPrice: "",
    notes: "",
  });
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

  useEffect(() => {
    async function fetchInventoryItem() {
      try {
        const result: any = await fishInventoryApi.getAll({ limit: 1000 });
        const item = result.inventoryItems.find((i: any) => i._id === id);
        if (item) {
          setInventoryItem(item);
          setFormData({
            actualWeight: item.actualWeight?.toString() || "",
            status: item.status || "available",
            purchaseDate: item.purchaseDate
              ? new Date(item.purchaseDate).toISOString().split("T")[0]
              : "",
            expiryDate: item.expiryDate
              ? new Date(item.expiryDate).toISOString().split("T")[0]
              : "",
            location: item.location || "",
            costPrice: item.costPrice?.toString() || "",
            notes: item.notes || "",
          });
        } else {
          showError("Inventory item not found");
        }
      } catch (err: any) {
        showError(err.message || "Failed to load inventory item");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchInventoryItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await fishInventoryApi.update(id, {
        actualWeight: formData.actualWeight ? parseFloat(formData.actualWeight) : undefined,
        status: formData.status,
        purchaseDate: formData.purchaseDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        location: formData.location || undefined,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        notes: formData.notes || undefined,
      });
      success("Inventory item updated successfully");
      setTimeout(() => {
        router.push("/dashboard/fish/inventory");
      }, 1000);
    } catch (err: any) {
      showError(err.message || "Failed to update inventory item");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <p className="mt-2 text-gray-500">Loading inventory item...</p>
      </div>
    );
  }

  if (!inventoryItem) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Inventory item not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Edit Inventory Item"
          description="Update fish inventory information"
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

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Fish Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Product:</span>{" "}
                <span className="font-medium text-gray-900">
                  {typeof inventoryItem.fishProduct === "object"
                    ? inventoryItem.fishProduct.name
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Size Category:</span>{" "}
                <span className="font-medium text-gray-900">
                  {inventoryItem.sizeCategory?.label || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="expired">Expired</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                disabled={saving}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Updating..." : "Update Inventory Item"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

