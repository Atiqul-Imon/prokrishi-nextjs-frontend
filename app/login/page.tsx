"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, user } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    const { email, password } = form;
    if (!email || !password) {
      setFormError("Email and password are required.");
      return;
    }
    const res = await login(form);
    if (res.success) {
      // Redirect based on role
      if (user?.role === "admin" || user?.role === "super_admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    }
  }

  // If already authenticated, redirect
  if (user) {
    if (user.role === "admin" || user.role === "super_admin") {
      router.replace("/dashboard");
    } else {
      router.replace("/");
    }
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full mx-auto space-y-4"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
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
          autoComplete="current-password"
        />
        {(formError || error) && (
          <div className="text-red-600 text-sm text-center">
            {formError || error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white rounded py-2 font-semibold hover:bg-green-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center text-sm mt-4 flex justify-between items-center">
          <a href="/register" className="text-green-700 hover:underline">
            Don't have an account?
          </a>
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}
