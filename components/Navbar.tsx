"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
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

  // Close dropdown when clicking outside - Use passive event listener and memoize handler
  useEffect(() => {
    if (!showDropdown) return; // Only add listener when dropdown is open
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        searchRef.current &&
        !searchRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    // Use setTimeout to avoid blocking main thread
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside, { passive: true });
    }, 0);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]); // Only re-run when showDropdown changes

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

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  }, [searchQuery, router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [showDropdown, searchResults, selectedIndex, router, handleSearch]);

  const handleResultClick = useCallback((product: any) => {
    router.push(`/products/${product._id}`);
    setSearchQuery("");
    setShowDropdown(false);
    setSelectedIndex(-1);
  }, [router]);

  const handleMobileSearch = useCallback(() => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setDrawerOpen(false);
    }
  }, [searchQuery, router]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-white/95 via-green-50/40 to-white/95 backdrop-blur-lg border-b border-green-200/60 shadow-xl shadow-green-100/30 transition-all duration-300">
        {/* Container with consistent viewport width */}
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 w-full">
          <div className="flex items-center justify-between py-4">
        {/* Left: Logo and Mobile Menu Icon */}
        <div className="flex items-center space-x-4 flex-1 basis-0 min-w-0">
          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-gray-700 hover:text-green-600 p-2.5 rounded-xl hover:bg-green-100/80 transition-all duration-300 shadow-sm hover:shadow-md"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center whitespace-nowrap group"
          >
            <div className="relative">
              <img 
                src="/logo/prokrishihublogo.png" 
                alt="Prokrishi Logo" 
                className="h-7 sm:h-8 w-auto object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-green-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Menu (centered) */}
        <div className="hidden md:flex flex-1 basis-0 min-w-0 justify-center">
          <nav className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-green-100/50">
            <Link href="/" className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-xl hover:bg-green-100/80 transition-all duration-300 font-medium">
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-xl hover:bg-green-100/80 transition-all duration-300 font-medium"
            >
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-xl hover:bg-green-100/80 transition-all duration-300 font-medium">
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-xl hover:bg-green-100/80 transition-all duration-300 font-medium"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right: Search Bar (conditional) & Icons */}
        <div className="flex items-center flex-1 basis-0 min-w-0 justify-end space-x-6">
          {/* Search Bar with Dropdown - Hidden for Admin */}
          {!isAdmin && (
            <div
              className="hidden md:block relative max-w-md w-full mr-4"
              ref={searchRef}
            >
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for products..."
                  className="w-full pl-4 pr-12 py-3 border border-green-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-600 to-green-700 text-white p-2 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Search Dropdown */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto mt-1"
              >
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product, index) => (
                      <div
                        key={product._id}
                        onClick={() => handleResultClick(product)}
                        className={`p-4 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${
                          index === selectedIndex ? "bg-green-50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image || "/img/placeholder.png"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg shadow-sm"
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
                    <div className="p-3 border-t border-gray-200 bg-green-50">
                      <button
                        onClick={handleSearch}
                        className="w-full text-sm text-green-600 hover:text-green-700 font-medium py-2 px-3 rounded-md hover:bg-green-100 transition-colors duration-150"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">No products found</p>
                    <p className="text-xs text-gray-400">
                      Try different keywords or check spelling
                    </p>
                  </div>
                ) : null}
              </div>
            )}
            </div>
          )}

          {/* Dashboard Button (Admin Only) */}
          {isAdmin && (
            <Link
              href="/dashboard"
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              <Settings size={16} />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Icons */}
          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/account"
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 px-3 py-2.5 rounded-xl hover:bg-green-100/80 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
              >
                <User size={18} />
                <span className="hidden sm:inline text-sm">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 text-sm px-3 py-2.5 rounded-xl hover:bg-red-100/80 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 px-3 py-2.5 rounded-xl hover:bg-green-100/80 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
            >
              <User size={18} />
              <span className="hidden sm:inline text-sm">Login</span>
            </Link>
          )}

          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-green-600 p-2.5 rounded-xl hover:bg-green-100/80 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs rounded-full px-2 py-1 flex items-center justify-center min-w-[20px] font-medium shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="bg-white w-72 sm:w-80 h-full p-6"
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
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                />
                <button
                  onClick={handleMobileSearch}
                  className="bg-green-600 text-white px-4 py-3 rounded-r-md hover:bg-green-700 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Drawer menu items */}
            <nav className="flex flex-col space-y-4 px-2">
              <Link href="/" className="text-lg text-gray-700 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-colors" onClick={() => setDrawerOpen(false)}>Home</Link>
              <Link href="/products" className="text-lg text-gray-700 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-colors" onClick={() => setDrawerOpen(false)}>Products</Link>
              <Link href="/about" className="text-lg text-gray-700 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-colors" onClick={() => setDrawerOpen(false)}>About</Link>
              <Link href="/contact" className="text-lg text-gray-700 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-colors" onClick={() => setDrawerOpen(false)}>Contact</Link>

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

// Memoize Navbar to prevent unnecessary re-renders
export default memo(Navbar);
