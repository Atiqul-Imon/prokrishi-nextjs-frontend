"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Edit,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

export default function ProfileInfo() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading profile...</p>
      </div>
    );
  }

  const stats = [
    {
      name: "Total Orders",
      value: user.orders?.length || 0,
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      name: "Total Spent",
      value: `৳${user.totalSpent || 0}`,
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: "Saved Addresses",
      value: user.addresses?.length || 0,
      icon: <MapPin className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <span className="mt-1 inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle size={12} />
              Active Member
            </span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
          <Edit size={14} />
          Edit Profile
        </button>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
          <Mail className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Email Address</p>
            <p className="font-semibold text-gray-800">{user.email}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
          <Phone className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Phone Number</p>
            <p className="font-semibold text-gray-800">
              {user.phone || "Not provided"}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 col-span-1 md:col-span-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Primary Location</p>
            <p className="font-semibold text-gray-800">
              {user.addresses && user.addresses.length > 0
                ? `${user.addresses[0].address}, ${user.addresses[0].upazila}, ${user.addresses[0].district}`
                : "No address saved"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-primary-50 p-4 rounded-lg flex flex-col items-center justify-center"
          >
            <div className="text-primary-600 mb-2">{stat.icon}</div>
            <h4 className="text-2xl font-bold text-primary-700">
              {stat.value}
            </h4>
            <p className="text-sm text-primary-600">{stat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
