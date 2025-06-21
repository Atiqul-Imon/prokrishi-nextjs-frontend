'use client';

import React, { useState } from 'react';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import Link from 'next/link';

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-md py-4 px-6 flex items-center justify-between">
        {/* Left: Logo and Mobile Menu Icon */}
        <div className="flex items-center space-x-4 flex-1 basis-0 min-w-0">
          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-gray-600 hover:text-green-600"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-green-600 whitespace-nowrap">
            Prokrishi
          </Link>
        </div>

        {/* Center: Desktop Menu (centered) */}
        <div className="hidden md:flex flex-1 basis-0 min-w-0 justify-center">
          <nav className="flex items-center space-x-8 font-semibold">
            <Link href="/" className="text-gray-700 hover:text-green-600">Home</Link>
            <Link href="/products" className="text-gray-700 hover:text-green-600">Products</Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600">Contact</Link>
          </nav>
        </div>

        {/* Right: Search Bar (hidden on small screens) & Icons */}
        <div className="flex items-center flex-1 basis-0 min-w-0 justify-end space-x-6">
          {/* Search Bar */}
          <div className="hidden md:flex max-w-md w-full mr-4">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded-r-md">
              <Search size={18} />
            </button>
          </div>
          {/* Icons */}
          <Link href="/login" className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
            <User size={20} />
            <span className="hidden md:inline">Login</span>
          </Link>
          <Link href="/cart" className="relative text-gray-600 hover:text-green-600">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1">
              2
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setDrawerOpen(false)}>
          <div
            className="bg-white w-64 h-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="mb-4 text-gray-600 hover:text-green-600"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>

            {/* Drawer menu items */}
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-green-600" onClick={() => setDrawerOpen(false)}>Home</Link>
              <Link href="/products" className="text-gray-700 hover:text-green-600" onClick={() => setDrawerOpen(false)}>Products</Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600" onClick={() => setDrawerOpen(false)}>About</Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600" onClick={() => setDrawerOpen(false)}>Contact</Link>
              <Link href="/account" className="text-gray-700 hover:text-green-600" onClick={() => setDrawerOpen(false)}>Login</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;