"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  Settings,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { searchProducts } from "@/app/utils/api";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const data = await searchProducts({
        q: searchQuery.trim(),
        limit: 5, // Limit to 5 suggestions
      });
      setSearchResults(data.products || []);
      setShowDropdown(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          router.push(`/products/${searchResults[selectedIndex]._id}`);
          setSearchQuery("");
          setShowDropdown(false);
          setSelectedIndex(-1);
        } else {
          handleSearch(e);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleResultClick = (product) => {
    router.push(`/products/${product._id}`);
    setSearchQuery("");
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleMobileSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setDrawerOpen(false);
    }
  };

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
          <Link
            href="/"
            className="text-xl font-bold text-green-600 whitespace-nowrap"
          >
            Prokrishi
          </Link>
        </div>

        {/* Center: Desktop Menu (centered) */}
        <div className="hidden md:flex flex-1 basis-0 min-w-0 justify-center">
          <nav className="flex items-center space-x-8 font-semibold">
            <Link href="/" className="text-gray-700 hover:text-green-600">
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-green-600"
            >
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600">
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-green-600"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right: Search Bar (hidden on small screens) & Icons */}
        <div className="flex items-center flex-1 basis-0 min-w-0 justify-end space-x-6">
          {/* Search Bar with Dropdown */}
          <div
            className="hidden md:block relative max-w-md w-full mr-4"
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition-colors"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Search Dropdown */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg z-50 max-h-96 overflow-y-auto"
              >
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-sm">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product, index) => (
                      <div
                        key={product._id}
                        onClick={() => handleResultClick(product)}
                        className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                          index === selectedIndex ? "bg-green-50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image || "/img/placeholder.png"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {product.category?.name}
                            </p>
                            <p className="text-sm font-semibold text-green-600">
                              ৳{product.price}
                            </p>
                          </div>
                          {index === selectedIndex && (
                            <ArrowUp size={16} className="text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={handleSearch}
                        className="w-full text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Search size={24} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No products found</p>
                    <p className="text-xs text-gray-400">
                      Try different keywords
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Dashboard Button (Admin Only) */}
          {isAdmin && (
            <Link
              href="/dashboard"
              className="hidden md:flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <Settings size={16} />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Icons */}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/account"
                className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
              >
                <User size={20} />
                <span className="hidden md:inline">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
            >
              <User size={20} />
              <span className="hidden md:inline">Login</span>
            </Link>
          )}

          <Link
            href="/cart"
            className="relative text-gray-600 hover:text-green-600"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5 flex items-center justify-center min-w-[20px]">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setDrawerOpen(false)}
        >
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

            {/* Mobile Search */}
            <div className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleMobileSearch}
                  className="bg-green-600 text-white px-3 py-2 rounded-r-md hover:bg-green-700 transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Drawer menu items */}
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600"
                onClick={() => setDrawerOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-green-600"
                onClick={() => setDrawerOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-green-600"
                onClick={() => setDrawerOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-green-600"
                onClick={() => setDrawerOpen(false)}
              >
                Contact
              </Link>

              {/* Dashboard Link (Admin Only) */}
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold"
                  onClick={() => setDrawerOpen(false)}
                >
                  <Settings size={16} />
                  <span>Dashboard</span>
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    href="/account"
                    className="text-gray-700 hover:text-green-600"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {user.name}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDrawerOpen(false);
                    }}
                    className="text-left text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-green-600"
                  onClick={() => setDrawerOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
