'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../utils/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerUser(form);
      router.push('/dashboard'); // Redirect to dashboard after registration & auto-login
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full mx-auto space-y-4"
      >
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
          name="phone"
          type="tel"
          placeholder="Phone"
          required
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          autoComplete="tel"
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
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white rounded py-2 font-semibold hover:bg-green-700 transition"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="text-center text-sm mt-2">
          Already have an account?{' '}
          <a href="/login" className="text-green-700 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}