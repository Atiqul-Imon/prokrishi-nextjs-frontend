'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import AddressForm from './AddressForm';
import { fetchProfile, updateUserAddresses } from '../utils/api';

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch addresses from backend on mount (and after add/edit)
  useEffect(() => {
    async function fetchAddresses() {
      setLoading(true);
      setError('');
      try {
        const user = await fetchProfile();
        setAddresses(user.addresses || []);
      } catch (err) {
        setError(err.message || 'Failed to load addresses');
      }
      setLoading(false);
    }
    fetchAddresses();
  }, [openForm]);

  // Save (add or edit) address
  const handleSave = async (addr) => {
    try {
      let updated;
      if (editAddress) {
        // edit
        updated = addresses.map(a =>
          (a._id === addr._id) ? addr : a
        );
      } else {
        // add
        updated = [...addresses, addr];
      }
      await updateUserAddresses(updated);
      setOpenForm(false);
      setEditAddress(null);
      // No need to manually setAddresses: fetches after openForm changes
    } catch (err) {
      alert(err.message || 'Failed to save address');
    }
  };

  const handleEdit = (addr) => {
    setEditAddress(addr);
    setOpenForm(true);
  };

  const handleDelete = async (_id) => {
    try {
      const updated = addresses.filter(a => a._id !== _id);
      await updateUserAddresses(updated);
      // No need to manually setAddresses, effect will fetch
    } catch (err) {
      alert(err.message || 'Failed to delete address');
    }
  };

  if (loading) return <div>Loading addresses...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="font-semibold mb-4">Saved Addresses</h2>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 flex items-center gap-1"
        onClick={() => { setEditAddress(null); setOpenForm(true); }}
      >
        <Plus size={16} /> Add New Address
      </button>
      {addresses.length === 0 && <div>No addresses saved yet.</div>}
      <ul className="space-y-4">
        {addresses.map(addr => (
          <li key={addr._id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{addr.name}</div>
              <div className="text-sm">{addr.address}</div>
              <div className="text-xs text-gray-500">{addr.upazila}, {addr.district}, {addr.division}</div>
              <div className="text-xs">Phone: {addr.phone}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600" onClick={() => handleEdit(addr)}>
                <Pencil size={18} />
              </button>
              <button className="text-red-600" onClick={() => handleDelete(addr._id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {openForm && (
        <AddressForm
          initial={editAddress}
          onClose={() => { setOpenForm(false); setEditAddress(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}