'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Bug } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-red-600 opacity-20">!</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! Something Went Wrong
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            We encountered an unexpected error.
          </p>
          <p className="text-gray-500">
            Don't worry, our team has been notified and we're working to fix it.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Error Details (Development)
            </h3>
            <div className="text-sm text-red-700">
              <p className="font-medium">Error: {error.message}</p>
              {error.digest && (
                <p className="mt-1 text-xs text-red-600">
                  Digest: {error.digest}
                </p>
              )}
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-32">
                {error.stack}
              </pre>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need Help?
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              If this error persists, please try:
            </p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Refreshing the page</li>
              <li>Clearing your browser cache</li>
              <li>Checking your internet connection</li>
              <li>Contacting our support team</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Error ID: {Date.now().toString(36)}
            {process.env.NODE_ENV === 'development' && (
              <span className="ml-2 text-orange-600">
                (Development Mode)
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
