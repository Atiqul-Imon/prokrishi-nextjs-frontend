"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, User, Phone, Home } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// TODO: Replace these with full lists or fetch dynamically
const divisions = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];
const districts = {
  Dhaka: [
    "Dhaka",
    "Gazipur",
    "Narayanganj",
    "Tangail",
    "Narsingdi",
    "Munshiganj",
    "Rajbari",
    "Madaripur",
    "Gopalganj",
    "Faridpur",
    "Shariatpur",
    "Kishoreganj",
    "Manikganj",
    "Netrokona",
    "Jamalpur",
    "Sherpur",
    "Mymensingh",
  ],
  Chattogram: [
    "Chattogram",
    "Cox's Bazar",
    "Rangamati",
    "Bandarban",
    "Khagrachari",
    "Feni",
    "Lakshmipur",
    "Chandpur",
    "Comilla",
    "Noakhali",
    "Chittagong",
  ],
  Khulna: [
    "Khulna",
    "Bagerhat",
    "Satkhira",
    "Jessore",
    "Magura",
    "Jhenaidah",
    "Narail",
    "Kushtia",
    "Meherpur",
    "Chuadanga",
  ],
  Rajshahi: [
    "Rajshahi",
    "Natore",
    "Naogaon",
    "Chapainawabganj",
    "Pabna",
    "Bogura",
    "Sirajganj",
    "Joypurhat",
  ],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Barishal: [
    "Barishal",
    "Bhola",
    "Pirojpur",
    "Barguna",
    "Patuakhali",
    "Jhalokati",
  ],
  Rangpur: [
    "Rangpur",
    "Dinajpur",
    "Kurigram",
    "Gaibandha",
    "Nilphamari",
    "Panchagarh",
    "Thakurgaon",
    "Lalmonirhat",
  ],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};
const upazilas = {
  Dhaka: [
    "Dhanmondi",
    "Gulshan",
    "Mirpur",
    "Uttara",
    "Banani",
    "Baridhara",
    "Wari",
    "Lalbagh",
    "Kotwali",
    "Ramna",
    "Paltan",
    "Motijheel",
    "Shahbagh",
    "New Market",
    "Mohammadpur",
    "Adabar",
    "Sher-e-Bangla Nagar",
    "Tejgaon",
    "Sabujbagh",
    "Demra",
    "Shyampur",
    "Sutrapur",
    "Jatrabari",
    "Kadamtali",
    "Kamrangirchar",
    "Keraniganj",
    "Nawabganj",
    "Dohar",
    "Savar",
    "Dhamrai",
    "Tangail Sadar",
    "Basail",
    "Bhuapur",
    "Delduar",
    "Ghatail",
    "Gopalpur",
    "Kalihati",
    "Madhupur",
    "Mirzapur",
    "Nagarpur",
    "Sakhipur",
  ],
  Gazipur: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
  Narayanganj: [
    "Narayanganj Sadar",
    "Bandar",
    "Araihazar",
    "Sonargaon",
    "Siddhirganj",
    "Fatullah",
    "Rupganj",
  ],
};

const schema = yup
  .object({
    name: yup.string().required("Address label is required"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^(\+880|880|0)?1[3-9]\d{8}$/,
        "Please enter a valid Bangladeshi phone number",
      ),
    division: yup.string().required("Please select a division"),
    district: yup.string().required("Please select a district"),
    upazila: yup.string().required("Please select an upazila"),
    postalCode: yup
      .string()
      .required("Postal code is required")
      .matches(/^\d{4}$/, "Please enter a valid 4-digit postal code"),
    address: yup
      .string()
      .required("Street address is required")
      .min(10, "Please provide a detailed address"),
  })
  .required();

/**
 * AddressForm for adding/editing an address.
 * For editing, pass initial (with _id if available).
 * onSave(form) is called with address object (including _id for edit).
 */
export default function AddressForm({ initial, onClose, onSave }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initial || {
      name: "",
      phone: "",
      division: "",
      district: "",
      upazila: "",
      postalCode: "",
      address: "",
    },
    mode: "onChange",
  });

  const watchedDivision = watch("division");
  const watchedDistrict = watch("district");

  // For dynamic selects
  const divisionDistricts = React.useMemo(
    () => (watchedDivision ? districts[watchedDivision] || [] : []),
    [watchedDivision],
  );
  const districtUpazilas = React.useMemo(
    () => (watchedDistrict ? upazilas[watchedDistrict] || [] : []),
    [watchedDistrict],
  );

  // Reset dependent fields when parent changes
  React.useEffect(() => {
    if (watchedDivision && !divisionDistricts.includes(watchedDistrict)) {
      setValue("district", "");
      setValue("upazila", "");
    }
  }, [watchedDivision, watchedDistrict, setValue, divisionDistricts]);

  React.useEffect(() => {
    const currentUpazila = watch("upazila");
    if (watchedDistrict && !districtUpazilas.includes(currentUpazila)) {
      setValue("upazila", "");
    }
  }, [watchedDistrict, watch, setValue, districtUpazilas]);

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      // Pass _id if editing, so backend knows which address to edit
      const result =
        initial && initial._id ? { ...data, _id: initial._id } : data;
      await onSave(result);
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {initial ? "Edit Address" : "Add New Address"}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Address Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Address Label
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g., Home, Office, Farm"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  {...register("phone")}
                  placeholder="01XXXXXXXXX"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Division */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Division
                </label>
                <select
                  {...register("division")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.division ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Division</option>
                  {divisions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.division && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.division.message}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  {...register("district")}
                  disabled={!watchedDivision}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.district ? "border-red-300" : "border-gray-300"
                  } ${!watchedDivision ? "bg-gray-100" : ""}`}
                >
                  <option value="">Select District</option>
                  {divisionDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.district.message}
                  </p>
                )}
              </div>

              {/* Upazila */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upazila/Thana
                </label>
                <select
                  {...register("upazila")}
                  disabled={!watchedDistrict}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.upazila ? "border-red-300" : "border-gray-300"
                  } ${!watchedDistrict ? "bg-gray-100" : ""}`}
                >
                  <option value="">Select Upazila/Thana</option>
                  {districtUpazilas.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                {errors.upazila && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.upazila.message}
                  </p>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  {...register("postalCode")}
                  placeholder="e.g., 1205"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.postalCode ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home className="w-4 h-4 inline mr-1" />
                  Street Address
                </label>
                <textarea
                  {...register("address")}
                  placeholder="House number, road, area, landmarks..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                    errors.address ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-green-500/50 transform hover:scale-105"
                >
                  {isSubmitting ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
