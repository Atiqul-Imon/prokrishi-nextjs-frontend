'use client';

import React, { useState } from 'react';

// TODO: Replace these with full lists or fetch dynamically
const divisions = ["Dhaka", "Chattogram", "Khulna", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];
const districts = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj"],
  // ... add all districts per division
};
const upazilas = {
  Dhaka: ["Dhanmondi", "Gulshan", "Mirpur"],
  // ... add upazilas per district
};

/**
 * AddressForm for adding/editing an address.
 * For editing, pass initial (with _id if available).
 * onSave(form) is called with address object (including _id for edit).
 */
export default function AddressForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || {
    name: '',
    phone: '',
    division: '',
    district: '',
    upazila: '',
    address: '',
  });

  // For dynamic selects
  const divisionDistricts = form.division ? districts[form.division] || [] : [];
  const districtUpazilas = form.district ? upazilas[form.district] || [] : [];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value,
      ...(name === 'division' ? { district: '', upazila: '' } : {}),
      ...(name === 'district' ? { upazila: '' } : {}),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Validate all fields
    if (form.name && form.phone && form.division && form.district && form.upazila && form.address) {
      // Pass _id if editing, so backend knows which address to edit
      const result = initial && initial._id
        ? { ...form, _id: initial._id }
        : form;
      onSave(result);
    } else {
      alert('Please fill all fields.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded-lg shadow w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h3 className="font-semibold mb-2">{initial ? 'Edit' : 'Add'} Address</h3>
        <input name="name" placeholder="Address label (e.g. Home, Office)" value={form.name} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
        <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
        <select name="division" value={form.division} onChange={handleChange} className="border px-3 py-2 rounded w-full">
          <option value="">Select Division</option>
          {divisions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select name="district" value={form.district} onChange={handleChange} className="border px-3 py-2 rounded w-full" disabled={!form.division}>
          <option value="">Select District</option>
          {divisionDistricts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select name="upazila" value={form.upazila} onChange={handleChange} className="border px-3 py-2 rounded w-full" disabled={!form.district}>
          <option value="">Select Upazila/Thana</option>
          {districtUpazilas.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <input name="address" placeholder="Street address, area, house etc." value={form.address} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
        <div className="flex gap-2 justify-end">
          <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">{initial ? 'Update' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}