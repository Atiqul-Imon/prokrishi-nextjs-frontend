"use client";

import React, { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MapPin,
} from "lucide-react";

// Mock order data - replace with real API calls
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-06-15",
    status: "delivered",
    total: 1250,
    items: [
      { name: "Organic Tomatoes", quantity: 2, price: 300 },
      { name: "Fresh Spinach", quantity: 1, price: 150 },
      { name: "Organic Carrots", quantity: 1, price: 200 },
    ],
    address: "Home - Dhanmondi, Dhaka",
    deliveryDate: "2024-06-16",
  },
  {
    id: "ORD-002",
    date: "2024-06-10",
    status: "shipped",
    total: 800,
    items: [
      { name: "Organic Bananas", quantity: 3, price: 180 },
      { name: "Fresh Lettuce", quantity: 1, price: 120 },
    ],
    address: "Office - Gulshan, Dhaka",
    deliveryDate: "2024-06-12",
  },
  {
    id: "ORD-003",
    date: "2024-06-05",
    status: "processing",
    total: 1500,
    items: [
      { name: "Organic Potatoes", quantity: 2, price: 400 },
      { name: "Fresh Onions", quantity: 1, price: 150 },
      { name: "Organic Garlic", quantity: 1, price: 200 },
    ],
    address: "Home - Dhanmondi, Dhaka",
    deliveryDate: "2024-06-08",
  },
];

const statusConfig = {
  processing: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    label: "Processing",
  },
  shipped: {
    icon: Truck,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Shipped",
  },
  delivered: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Delivered",
  },
  cancelled: {
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Cancelled",
  },
};

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.processing;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Your Orders</h3>
        <p className="text-sm text-gray-600">
          Track your orders and view order history
        </p>
      </div>

      {/* Orders List */}
      {mockOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start shopping to see your orders here
          </p>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order, index) => {
            const status = getStatusConfig(order.status);
            const StatusIcon = status.icon;

            return (
              <div
                key={order.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${status.bgColor} rounded-lg`}>
                      <StatusIcon size={20} className={status.color} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {order.id}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Ordered on {formatDate(order.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ৳{order.total}
                    </div>
                    <div className={`text-sm font-medium ${status.color}`}>
                      {status.label}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-900 font-medium">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span>{order.address}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedOrder(
                          selectedOrder === order.id ? null : order.id,
                        )
                      }
                      className="flex items-center gap-1 px-3 py-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors text-sm"
                    >
                      <Eye size={14} />
                      {selectedOrder === order.id ? "Hide" : "View"} Details
                    </button>
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                <div>
                  {selectedOrder === order.id && (
                    <div
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">
                            Delivery Information
                          </h5>
                          <div className="space-y-1 text-gray-600">
                            <div>
                              Expected Delivery:{" "}
                              {formatDate(order.deliveryDate)}
                            </div>
                            <div>Delivery Address: {order.address}</div>
                            <div>Payment Method: Cash on Delivery</div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">
                            Order Summary
                          </h5>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-gray-900">
                                ৳{order.total}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Delivery:</span>
                              <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between font-medium pt-1 border-t">
                              <span className="text-gray-900">Total:</span>
                              <span className="text-gray-900">
                                ৳{order.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {mockOrders.length}
          </div>
          <div className="text-sm text-blue-700">Total Orders</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {mockOrders.filter((o) => o.status === "delivered").length}
          </div>
          <div className="text-sm text-green-700">Delivered</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {
              mockOrders.filter(
                (o) => o.status === "processing" || o.status === "shipped",
              ).length
            }
          </div>
          <div className="text-sm text-yellow-700">In Progress</div>
        </div>
      </div>
    </div>
  );
}
