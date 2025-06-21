'use client';

import React, { useState } from 'react';

export default function RegisterForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Call parent handler or API here
    await onSubmit?.(form);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-md w-full mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-2 text-center">Register</h2>
      <input
        name="name"
        type="text"
        placeholder="Full Name"
        required
        value={form.name}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        autoComplete="name"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        autoComplete="email"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        value={form.password}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        autoComplete="new-password"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white rounded py-2 font-semibold hover:bg-green-700 transition"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}