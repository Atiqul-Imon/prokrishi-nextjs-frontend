'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Settings, RefreshCw, BarChart3 } from 'lucide-react';

export default function DashboardNotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-green-600 opacity-20">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dashboard Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            The dashboard page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Let's get you back to managing your farm efficiently!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Home className="w-5 h-5" />
            Dashboard Home
          </Link>
          
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* Dashboard Links */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Dashboard Sections
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 text-left"
            >
              <BarChart3 className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Dashboard Overview</span>
            </Link>
            <Link
              href="/dashboard/products"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 text-left"
            >
              <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">P</span>
              </div>
              <span className="text-gray-700">Products</span>
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 text-left"
            >
              <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">O</span>
              </div>
              <span className="text-gray-700">Orders</span>
            </Link>
            <Link
              href="/dashboard/customers"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 text-left"
            >
              <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">C</span>
              </div>
              <span className="text-gray-700">Customers</span>
            </Link>
            <Link
              href="/dashboard/categories"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 text-left"
            >
              <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">T</span>
              </div>
              <span className="text-gray-700">Categories</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 text-left"
            >
              <Settings className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Settings</span>
            </Link>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Need help? Check our{' '}
            <Link href="/dashboard/settings" className="text-green-600 hover:text-green-700 underline">
              settings
            </Link>
            {' '}or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
