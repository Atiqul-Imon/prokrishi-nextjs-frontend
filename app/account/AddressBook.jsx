"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  MapPin,
  Home,
  Building,
  User,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddressForm from "./AddressForm";
import {
  updateUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AddressBook() {
  const { user, loading, error, refreshUser } = useAuth();
  const [openForm, setOpenForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const addresses = user?.addresses || [];

  const handleAddNew = () => {
    setEditAddress(null);
    setOpenForm(true);
  };

  const handleEdit = (address) => {
    setEditAddress(address);
    setOpenForm(true);
  };

  const handleSave = async (addressData) => {
    const toastId = toast.loading(
      editAddress ? "Updating address..." : "Adding address...",
    );
    try {
      if (editAddress) {
        // Edit existing address
        await updateAddress(editAddress._id, addressData);
      } else {
        // Add new address
        await addAddress(addressData);
      }

      await refreshUser(); // Refresh user data from context

      toast.success(
        editAddress
          ? "Address updated successfully!"
          : "Address added successfully!",
        { id: toastId },
      );
      setOpenForm(false);
      setEditAddress(null);
    } catch (err) {
      toast.error(err.message || "Failed to save address", { id: toastId });
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const toastId = toast.loading("Deleting address...");
      try {
        await deleteAddress(addressId);
        await refreshUser();
        toast.success("Address deleted successfully!", { id: toastId });
      } catch (err) {
        toast.error("Failed to delete address.", { id: toastId });
      }
    }
  };

  const getAddressIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("home")) return Home;
    if (lowerName.includes("office") || lowerName.includes("work"))
      return Building;
    return MapPin;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Addresses
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Saved Addresses
          </h3>
          <p className="text-sm text-gray-600">
            Manage your delivery addresses for quick checkout
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50 transform hover:scale-105"
          onClick={handleAddNew}
        >
          <Plus size={16} />
          Add New Address
        </motion.button>
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No addresses saved
          </h3>
          <p className="text-gray-600 mb-4">
            Add your first delivery address to make checkout faster
          </p>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50 transform hover:scale-105"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {addresses.map((addr, index) => {
              const Icon = getAddressIcon(addr.name);
              return (
                <motion.div
                  key={addr._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary-300 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Icon size={16} className="text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {addr.name}
                        </h4>
                        <p className="text-xs text-gray-500 capitalize">
                          {addr.division}, {addr.district}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(addr)}
                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit address"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(addr._id)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete address"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-start gap-2">
                      <User
                        size={14}
                        className="text-gray-400 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700">{addr.name}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin
                        size={14}
                        className="text-gray-400 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700">
                        {addr.address}, {addr.upazila}, {addr.district},{" "}
                        {addr.division}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-gray-700">{addr.phone}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Address Form Modal */}
      <AnimatePresence>
        {openForm && (
          <AddressForm
            initial={editAddress}
            onClose={() => {
              setOpenForm(false);
              setEditAddress(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
