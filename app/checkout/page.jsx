'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AddressForm from '../account/AddressForm';
import { useCart } from '@/app/context/CartContext';
import { fetchProfile, updateUserAddresses, placeOrder } from '../utils/api';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  // Fetch addresses on mount, and after add/edit/delete
 const fetchAndSetAddresses = async () => {
  setLoading(true);
  setError('');
  try {
    const data = await fetchProfile();
    setAddresses(data.user.addresses ?? []);
    setSelectedAddress(data.user.addresses?.[0]?._id ?? null);
  } catch (err) {
    setError(err.message || 'Failed to load addresses');
  }
  setLoading(false);
};

  useEffect(() => {
    fetchAndSetAddresses();
    // eslint-disable-next-line
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Add or edit address
  async function handleAddAddress(addr) {
    try {
      let updatedAddresses;
      if (editAddress && addr._id) {
        updatedAddresses = addresses.map(a => a._id === addr._id ? addr : a);
      } else {
        updatedAddresses = [...addresses, addr];
      }
      await updateUserAddresses(updatedAddresses);
      setOpenAddressForm(false);
      setEditAddress(null);
      // Refetch addresses to get newly assigned _id from backend
      await fetchAndSetAddresses();
    } catch (err) {
      alert(err.message || 'Failed to save address');
    }
  }

  // Edit address handler
  function handleEditAddress(addr) {
    setEditAddress(addr);
    setOpenAddressForm(true);
  }

  // Delete address
  async function handleDeleteAddress(_id) {
    try {
      const updatedAddresses = addresses.filter(a => a._id !== _id);
      await updateUserAddresses(updatedAddresses);
      // Refetch addresses after delete
      await fetchAndSetAddresses();
    } catch (err) {
      alert(err.message || 'Failed to delete address');
    }
  }

  // Place order
  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!selectedAddress) {
      alert('Please select a shipping address.');
      return;
    }
    setPlacingOrder(true);
    try {
      await placeOrder({
        addressId: selectedAddress,
        paymentMethod,
        instructions,
        cart,
      });
      clearCart();
      alert('Order placed!');
      // Optionally redirect, e.g. router.push('/orders')
    } catch (err) {
      alert(err.message || 'Failed to place order');
    }
    setPlacingOrder(false);
  }

  if (loading) return <div className="p-8 text-center">Loading addresses...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Address */}
        <div>
          <h2 className="font-semibold mb-4">Shipping Address</h2>
          {addresses.length === 0 ? (
            <div>
              <p className="text-gray-600 mb-2">No address saved.</p>
              <button
                type="button"
                onClick={() => { setEditAddress(null); setOpenAddressForm(true); }}
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Address
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {addresses.map(addr => (
                <li key={addr._id} className={`border rounded p-4 flex gap-2 items-center ${selectedAddress === addr._id ? 'border-green-600' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === addr._id}
                    onChange={() => setSelectedAddress(addr._id)}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{addr.name}</div>
                    <div className="text-xs">{addr.address}, {addr.upazila}, {addr.district}, {addr.division}</div>
                    <div className="text-xs">Phone: {addr.phone}</div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="text-blue-600" onClick={() => handleEditAddress(addr)}>Edit</button>
                    <button type="button" className="text-red-600" onClick={() => handleDeleteAddress(addr._id)}>Delete</button>
                  </div>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => { setEditAddress(null); setOpenAddressForm(true); }}
                  className="text-green-600 hover:underline text-sm"
                >
                  + Add new address
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <ul className="divide-y rounded bg-white shadow mb-4">
            {cart.map(item => (
              <li key={item.id || item._id} className="flex items-center gap-3 py-3 px-2">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded border" />
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-500">x{item.quantity}</div>
                </div>
                <div className="font-semibold">৳{item.price * item.quantity}</div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-lg mb-2">
            <span>Total</span>
            <span>৳{total}</span>
          </div>

          {/* Payment Method */}
          <h3 className="font-semibold mb-2 mt-4">Payment</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <span className="ml-2">Cash on Delivery</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="bkash"
                checked={paymentMethod === 'bkash'}
                onChange={() => setPaymentMethod('bkash')}
              />
              <span className="ml-2">bKash/Nagad (Coming Soon)</span>
            </label>
          </div>
          <textarea
            className="w-full border rounded mt-4 p-2"
            placeholder="Add delivery instructions (optional)"
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            rows={2}
          />
          <button
            className="w-full bg-green-600 text-white py-3 rounded mt-6 font-semibold hover:bg-green-700 transition"
            type="submit"
            disabled={placingOrder}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>

      {/* AddressForm modal rendered OUTSIDE the main form to avoid nested forms */}
      {openAddressForm && (
        <AddressForm
          initial={editAddress}
          onClose={() => { setOpenAddressForm(false); setEditAddress(null); }}
          onSave={handleAddAddress}
        />
      )}
    </div>
  );
}