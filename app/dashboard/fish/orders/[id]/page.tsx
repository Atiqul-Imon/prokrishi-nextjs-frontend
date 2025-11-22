"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fishOrderApi } from "@/app/utils/fishApi";
import { Card, CardHeader, CardContent } from "../../../components/Card";
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar } from "lucide-react";
import { FishOrder } from "@/types/models";

export default function ViewFishOrderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<FishOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const result: any = await fishOrderApi.getById(id);
        setOrder(result.fishOrder);
      } catch (err: any) {
        setError(err.message || "Failed to load fish order");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchOrder();
    }
  }, [id]);

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "prepared":
        return "bg-indigo-100 text-indigo-800";
      case "shipped":
        return "bg-cyan-100 text-cyan-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <p className="mt-2 text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "Order not found"}</p>
        <Link
          href="/dashboard/fish/orders"
          className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:text-amber-700"
        >
          <ArrowLeft size={18} />
          Back to Fish Orders
        </Link>
      </div>
    );
  }

  const customerName = order.isGuestOrder
    ? order.guestInfo?.name
    : typeof order.user === "object"
    ? order.user.name
    : "N/A";
  const customerPhone = order.isGuestOrder
    ? order.guestInfo?.phone
    : typeof order.user === "object"
    ? order.user.phone
    : "N/A";
  const customerEmail = order.isGuestOrder
    ? order.guestInfo?.email
    : typeof order.user === "object"
    ? order.user.email
    : undefined;

  const totalWeight = order.orderItems.reduce(
    (sum, item) => sum + (item.actualWeight || item.requestedWeight),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/fish/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Fish Orders
        </Link>
      </div>

      <Card>
        <CardHeader
          title={`Order #${order.orderNumber}`}
          description={`Placed on ${new Date(order.createdAt).toLocaleString()}`}
          actions={
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 text-sm rounded ${getStatusColor(order.status)}`}
              >
                {order.status}
              </span>
              <span
                className={`px-3 py-1 text-sm rounded ${
                  order.paymentStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.paymentStatus === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                Payment: {order.paymentStatus}
              </span>
            </div>
          }
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <User size={18} className="text-gray-500" />
                <h3 className="font-semibold text-gray-900">Customer Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>{" "}
                  <span className="font-medium text-gray-900">{customerName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>{" "}
                  <span className="font-medium text-gray-900">{customerPhone}</span>
                </div>
                {customerEmail && (
                  <div>
                    <span className="text-gray-500">Email:</span>{" "}
                    <span className="font-medium text-gray-900">{customerEmail}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Order Type:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {order.isGuestOrder ? "Guest Order" : "Registered User"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-gray-500" />
                <h3 className="font-semibold text-gray-900">Shipping Address</h3>
              </div>
              <div className="space-y-1 text-sm text-gray-900">
                <div className="font-medium">{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.phone}</div>
                <div>{order.shippingAddress.address}</div>
                {order.shippingAddress.district && (
                  <div>
                    {order.shippingAddress.district}
                    {order.shippingAddress.upazila && `, ${order.shippingAddress.upazila}`}
                  </div>
                )}
                {order.shippingAddress.division && (
                  <div>{order.shippingAddress.division}</div>
                )}
                {order.shippingAddress.postalCode && (
                  <div>Postal Code: {order.shippingAddress.postalCode}</div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
            </div>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.fishProductName}</h4>
                      <p className="text-sm text-gray-500">Size: {item.sizeCategoryLabel}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ৳{item.totalPrice.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ৳{item.pricePerKg.toFixed(2)}/kg
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Requested Weight:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {item.requestedWeight} kg
                      </span>
                    </div>
                    {item.actualWeight && (
                      <div>
                        <span className="text-gray-500">Actual Weight:</span>{" "}
                        <span className="font-medium text-gray-900">
                          {item.actualWeight} kg
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Price per kg:</span>{" "}
                      <span className="font-medium text-gray-900">
                        ৳{item.pricePerKg.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>{" "}
                      <span className="font-medium text-gray-900">
                        ৳{item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {item.notes && (
                    <div className="mt-2 pt-2 border-t text-sm">
                      <span className="text-gray-500">Notes:</span>{" "}
                      <span className="text-gray-900">{item.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Weight:</span>
                  <span className="font-semibold text-gray-900">{totalWeight.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Price:</span>
                  <span className="font-semibold text-gray-900">৳{order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                {order.deliveredAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivered Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(order.deliveredAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {order.cancelledAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cancelled Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(order.cancelledAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {order.notes && (
              <div className="mt-4 pt-4 border-t">
                <span className="text-sm text-gray-500">Order Notes:</span>
                <p className="mt-1 text-sm text-gray-900">{order.notes}</p>
              </div>
            )}
            {order.cancellationReason && (
              <div className="mt-4 pt-4 border-t">
                <span className="text-sm text-gray-500">Cancellation Reason:</span>
                <p className="mt-1 text-sm text-red-600">{order.cancellationReason}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

