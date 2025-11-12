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
  onFormChange?: (data: AddressFormData | null, isValid: boolean) => void;
}

export default function InlineAddressForm({
  initial,
  onClose,
  onSave,
  compact = false,
  onFormChange,
}: InlineAddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
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

  // Watch form values
  const watchedName = watch("name");
  const watchedPhone = watch("phone");
  const watchedAddress = watch("address");
  const watchedDivision = watch("division");
  const watchedDistrict = watch("district");
  const watchedUpazila = watch("upazila");
  const watchedPostalCode = watch("postalCode");

  // Memoize validation result to prevent infinite loops
  const validationResult = React.useMemo(() => {
    const nameValue = watchedName?.trim() || "";
    const phoneValue = watchedPhone?.trim() || "";
    const addressValue = watchedAddress?.trim() || "";
    
    const hasName = nameValue.length >= 1;
    const hasPhone = phoneValue.length > 0 && /^(\+880|880|0)?1[3-9]\d{8}$/.test(phoneValue);
    const hasAddress = addressValue.length >= 2;
    
    const isValid = hasName && hasPhone && hasAddress;
    
    if (isValid) {
      return {
        isValid: true,
        addressData: {
          name: nameValue,
          phone: phoneValue,
          address: addressValue,
          division: watchedDivision || "",
          district: watchedDistrict || "",
          upazila: watchedUpazila || "",
          postalCode: watchedPostalCode || "",
        }
      };
    }
    
    return { isValid: false, addressData: null };
  }, [watchedName, watchedPhone, watchedAddress, watchedDivision, watchedDistrict, watchedUpazila, watchedPostalCode]);

  // Track previous validation result and callback to prevent unnecessary updates
  const prevValidationRef = React.useRef<{ isValid: boolean; addressData: any } | null>(null);
  const onFormChangeRef = React.useRef(onFormChange);

  // Update callback ref when it changes
  React.useEffect(() => {
    onFormChangeRef.current = onFormChange;
  }, [onFormChange]);

  // Notify parent component of form changes (single effect to prevent loops)
  React.useEffect(() => {
    const callback = onFormChangeRef.current;
    if (callback) {
      const prev = prevValidationRef.current;
      const current = {
        isValid: validationResult.isValid,
        addressData: validationResult.addressData,
      };

      // Only update if validation result actually changed
      if (
        !prev ||
        prev.isValid !== current.isValid ||
        (current.isValid && JSON.stringify(prev.addressData) !== JSON.stringify(current.addressData))
      ) {
        prevValidationRef.current = current;
        if (current.isValid && current.addressData) {
          callback(current.addressData, true);
        } else {
          callback(null, false);
        }
      }
    }
  }, [validationResult]);

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
          {initial ? "Edit Address" : "Shipping Address"}
        </h4>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close form"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            placeholder="Enter your full name"
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

        {/* Street Address */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Full Address <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("address")}
            placeholder="House number, road, area, district, upazila, landmarks..."
            rows={3}
            className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:border-green-500 resize-none ${
              errors.address ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Include district, upazila, and postal code if known
          </p>
        </div>

        {/* Optional Fields - Collapsible */}
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium mb-2">
            Additional Details (Optional)
          </summary>
          <div className="space-y-3 pt-2">
            {/* Division */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Division
              </label>
              <select
                {...register("division")}
                className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              >
                <option value="">Select Division (Optional)</option>
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            {watchedDivision && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  District
                </label>
                <select
                  {...register("district")}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="">Select District (Optional)</option>
                  {divisionDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Upazila */}
            {watchedDistrict && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Upazila/Thana
                </label>
                <select
                  {...register("upazila")}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="">Select Upazila/Thana (Optional)</option>
                  {districtUpazilas.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Postal Code */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                {...register("postalCode")}
                placeholder="e.g., 1205 (Optional)"
                className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </details>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`${onClose ? 'flex-1' : 'w-full'} bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
}

