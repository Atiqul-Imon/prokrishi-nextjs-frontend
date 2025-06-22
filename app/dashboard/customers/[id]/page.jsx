"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserById } from "@/app/utils/api";
import toast from "react-hot-toast";
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";
import Link from "next/link";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const InfoCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold border-b pb-2 mb-4">{title}</h3>
    {children}
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center text-sm text-gray-700 mb-3">
    {React.cloneElement(icon, { className: "w-5 h-5 mr-3 text-gray-400" })}
    <span className="font-medium mr-2">{label}:</span>
    <span>{value || "Not provided"}</span>
  </div>
);

export default function CustomerDetailPage() {
  const params = useParams();
  const { id } = params;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    async function fetchCustomer() {
      setLoading(true);
      try {
        const data = await getUserById(id);
        setCustomer(data.user);
      } catch (err) {
        setError("Failed to load customer details.");
        toast.error("Failed to load customer details.");
      }
      setLoading(false);
    }
    fetchCustomer();
  }, [id]);

  if (loading)
    return <div className="text-center py-20">Loading customer profile...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!customer)
    return <div className="text-center py-20">Customer not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link
          href="/dashboard/customers"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          &larr; Back to Customers
        </Link>
        <h1 className="text-3xl font-bold mt-2">{customer.name}</h1>
        <p className="text-gray-500">{customer.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <InfoCard title="Contact Information">
            <InfoItem icon={<Mail />} label="Email" value={customer.email} />
            <InfoItem icon={<Phone />} label="Phone" value={customer.phone} />
          </InfoCard>
          <div className="mt-6">
            <InfoCard title="Account Details">
              <InfoItem icon={<Shield />} label="Role" value={customer.role} />
              <InfoItem
                icon={<Calendar />}
                label="Joined"
                value={formatDate(customer.createdAt)}
              />
              <InfoItem
                icon={<Calendar />}
                label="Last Updated"
                value={formatDate(customer.updatedAt)}
              />
            </InfoCard>
          </div>
        </div>

        <div className="lg:col-span-2">
          <InfoCard title="Address Book">
            {customer.addresses && customer.addresses.length > 0 ? (
              <div className="space-y-4">
                {customer.addresses.map((addr, index) => (
                  <div key={index} className="border p-4 rounded-md bg-gray-50">
                    <p className="font-semibold">
                      {addr.name || `Address ${index + 1}`}
                    </p>
                    <p>
                      <strong>Address:</strong> {addr.address}
                    </p>
                    <p>
                      <strong>Location:</strong> {addr.upazila}, {addr.district}
                      , {addr.division}
                    </p>
                    <p>
                      <strong>Contact:</strong> {addr.phone}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No addresses on file.</p>
            )}
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
