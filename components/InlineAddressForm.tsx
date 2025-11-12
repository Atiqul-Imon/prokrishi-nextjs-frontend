"use client";

import React, { useState } from "react";
import { MapPin, User, Phone, Home, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormData } from "@/types/forms";

// Division, District, Upazila data (same as AddressForm)
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
    "Dhaka", "Gazipur", "Narayanganj", "Tangail", "Narsingdi", "Munshiganj",
    "Rajbari", "Madaripur", "Gopalganj", "Faridpur", "Shariatpur", "Kishoreganj",
    "Manikganj", "Netrokona", "Jamalpur", "Sherpur", "Mymensingh",
  ],
  Chattogram: [
    "Chattogram", "Cox's Bazar", "Rangamati", "Bandarban", "Khagrachari",
    "Feni", "Lakshmipur", "Chandpur", "Comilla", "Noakhali", "Chittagong",
  ],
  Khulna: [
    "Khulna", "Bagerhat", "Satkhira", "Jessore", "Magura", "Jhenaidah",
    "Narail", "Kushtia", "Meherpur", "Chuadanga",
  ],
  Rajshahi: [
    "Rajshahi", "Natore", "Naogaon", "Chapainawabganj", "Pabna", "Bogura",
    "Sirajganj", "Joypurhat",
  ],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Barishal: [
    "Barishal", "Bhola", "Pirojpur", "Barguna", "Patuakhali", "Jhalokati",
  ],
  Rangpur: [
    "Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari", "Panchagarh",
    "Thakurgaon", "Lalmonirhat",
  ],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

const upazilas = {
  Dhaka: [
    "Dhanmondi", "Gulshan", "Mirpur", "Uttara", "Banani", "Baridhara", "Wari",
    "Lalbagh", "Kotwali", "Ramna", "Paltan", "Motijheel", "Shahbagh",
    "New Market", "Mohammadpur", "Adabar", "Sher-e-Bangla Nagar", "Tejgaon",
    "Sabujbagh", "Demra", "Shyampur", "Sutrapur", "Jatrabari", "Kadamtali",
    "Kamrangirchar", "Keraniganj", "Nawabganj", "Dohar", "Savar", "Dhamrai",
    "Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Ghatail", "Gopalpur",
    "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur",
  ],
  Gazipur: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
  Narayanganj: [
    "Narayanganj Sadar", "Bandar", "Araihazar", "Sonargaon", "Siddhirganj",
    "Fatullah", "Rupganj",
  ],
};

interface InlineAddressFormProps {
  initial?: (AddressFormData & { _id?: string }) | null;
  onClose: () => void;
  onSave: (data: AddressFormData & { _id?: string }) => Promise<void> | void;
  compact?: boolean;
}

export default function InlineAddressForm({
  initial,
  onClose,
  onSave,
  compact = false,
}: InlineAddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
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

  const divisionDistricts = React.useMemo(
    () => (watchedDivision ? districts[watchedDivision] || [] : []),
    [watchedDivision],
  );

  const districtUpazilas = React.useMemo(
    () => (watchedDistrict ? upazilas[watchedDistrict] || [] : []),
    [watchedDistrict],
  );

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

  async function onSubmit(data: AddressFormData) {
    setIsSubmitting(true);
    try {
      const result: AddressFormData & { _id?: string } = initial && initial._id 
        ? { ...data, _id: initial._id } 
        : data;
      await onSave(result);
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          {initial ? "Edit Address" : "Add New Address"}
        </h4>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Close form"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Address Label */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Address Label
          </label>
          <input
            {...register("name")}
            placeholder="e.g., Home, Office"
            className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:border-green-500 ${
              errors.name ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register("phone")}
            placeholder="01XXXXXXXXX"
            className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:border-green-500 ${
              errors.phone ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Division */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Division <span className="text-red-500">*</span>
          </label>
          <select
            {...register("division")}
            className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:border-green-500 ${
              errors.division ? "border-red-300" : "border-gray-200"
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
            <p className="mt-1 text-xs text-red-600">{errors.division.message}</p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            District <span className="text-red-500">*</span>
          </label>
          <select
            {...register("district")}
            disabled={!watchedDivision}
            className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:border-green-500 ${
              errors.district ? "border-red-300" : "border-gray-200"
            } ${!watchedDivision ? "bg-gray-50" : ""}`}
          >
            <option value="">Select District</option>
            {divisionDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="mt-1 text-xs text-red-600">{errors.district.message}</p>
          )}
        </div>

        {/* Upazila */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Upazila/Thana <span className="text-red-500">*</span>
          </label>
          <select
            {...register("upazila")}
            disabled={!watchedDistrict}
            className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:border-green-500 ${
              errors.upazila ? "border-red-300" : "border-gray-200"
            } ${!watchedDistrict ? "bg-gray-50" : ""}`}
          >
            <option value="">Select Upazila/Thana</option>
            {districtUpazilas.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {errors.upazila && (
            <p className="mt-1 text-xs text-red-600">{errors.upazila.message}</p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            {...register("postalCode")}
            placeholder="e.g., 1205"
            className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:border-green-500 ${
              errors.postalCode ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.postalCode && (
            <p className="mt-1 text-xs text-red-600">{errors.postalCode.message}</p>
          )}
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("address")}
            placeholder="House number, road, area, landmarks..."
            rows={2}
            className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:border-green-500 resize-none ${
              errors.address ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

