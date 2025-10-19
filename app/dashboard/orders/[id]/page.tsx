"use client";
import { useState, useEffect } from "react";
import { getOrderDetails } from "@/app/utils/api";
import { format } from "date-fns";

interface PageProps {
  params: Promise<{ id: string }>
}

const OrderDetailsPage = ({ params }: PageProps) => {
  const [id, setId] = useState<string>("");
  
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchOrderDetails = async () => {
        try {
          setLoading(true);
          const response = await getOrderDetails(id);
          if (response.success) {
            setOrder(response.data);
          } else {
            setError(response.message);
          }
        } catch (err) {
          setError("Failed to fetch order details.");
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Order not found.</div>
      </div>
    );
  }

  const {
    _id,
    user,
    products,
    totalAmount,
    shippingAddress,
    status,
    paymentDetails,
    createdAt,
  } = order;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
            <p className="text-gray-500">
              Order ID: <span className="font-mono">{_id}</span>
            </p>
            <p className="text-gray-500">
              Placed on:{" "}
              <span className="font-medium">
                {format(new Date(createdAt), "MMMM d, yyyy, h:mm a")}
              </span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "Processing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Customer Information
            </h2>
            <div className="text-gray-600">
              <p className="font-medium">{user.name}</p>
              <p>{user.email}</p>
              <p>{user.phone}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Shipping Address
            </h2>
            <div className="text-gray-600">
              <p>{shippingAddress.street}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.state}
              </p>
              <p>
                {shippingAddress.country} - {shippingAddress.postalCode}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Order Items
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">
                    Product
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-gray-600 uppercase">
                    Quantity
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600 uppercase">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {products.map(({ product, quantity }) => (
                  <tr key={product._id} className="border-b">
                    <td className="py-4 px-4 flex items-center">
                      <img
                        src={product.images[0]?.url || "/placeholder.png"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {product._id}
                        </p>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 text-gray-700">
                      {quantity}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-800 font-semibold">
                      ${(product.price * quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Order Summary
              </h3>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between text-gray-800 font-bold text-xl">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg mt-4 border">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Payment Details
              </h3>
              <div className="text-gray-600">
                <p>
                  Method:{" "}
                  <span className="font-medium">
                    {paymentDetails?.method || "N/A"}
                  </span>
                </p>
                <p>
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      paymentDetails?.status === "Paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {paymentDetails?.status || "N/A"}
                  </span>
                </p>
                {paymentDetails?.transactionId && (
                  <p>
                    Transaction ID:{" "}
                    <span className="font-mono text-sm">
                      {paymentDetails.transactionId}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
