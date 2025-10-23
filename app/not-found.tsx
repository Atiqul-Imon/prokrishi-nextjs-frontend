'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-green-600 opacity-20">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Don't worry, even the best farmers sometimes lose their way in the fields!
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
            href="/"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 text-left"
            >
              <Home className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Home</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 text-left"
            >
              <Search className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Products</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 text-left"
            >
              <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">?</span>
              </div>
              <span className="text-gray-700">About Us</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 text-left"
            >
              <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">@</span>
              </div>
              <span className="text-gray-700">Contact</span>
            </Link>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-green-600 hover:text-green-700 underline">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
