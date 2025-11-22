"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { createPortal } from "react-dom";
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { cartCount, openSidebar } = useCart();
  const router = useRouter();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Ensure component is mounted before using portal
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Update dropdown position on scroll/resize
  useEffect(() => {
    if (!showDropdown || !searchRef.current || !dropdownRef.current) return;

    const updatePosition = () => {
      if (searchRef.current && dropdownRef.current) {
        const rect = searchRef.current.getBoundingClientRect();
        dropdownRef.current.style.top = `${rect.bottom + window.scrollY + 4}px`;
        dropdownRef.current.style.left = `${rect.left + window.scrollX}px`;
        dropdownRef.current.style.width = `${rect.width}px`;
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showDropdown]);

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
        if (mobileSearchOpen) {
          setMobileSearchOpen(false);
          setShowDropdown(false);
          setSelectedIndex(-1);
        } else {
          setShowDropdown(false);
          setSelectedIndex(-1);
        }
        break;
    }
  }, [showDropdown, searchResults, selectedIndex, router, handleSearch, mobileSearchOpen]);

  const handleResultClick = useCallback((product: any) => {
    if (product?._id) {
      router.push(`/products/${product._id}`);
      setSearchQuery("");
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
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
      <header className="sticky top-0 z-[100] bg-white border-b border-green-200 shadow-md transition-all duration-300" style={{ position: 'sticky', top: 0 }}>
        {/* Container with consistent viewport width */}
        <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 w-full 3xl:max-w-7xl 3xl:mx-auto">
          <div className="flex items-center justify-between py-0.5 sm:py-1 gap-2 sm:gap-3">
        {/* Left: Logo and Mobile Menu Icon */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-gray-700 hover:text-green-600 p-1.5 sm:p-2 rounded-lg hover:bg-green-100/80 transition-all duration-300 touch-manipulation"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={18} className="sm:w-4 sm:h-4" />
          </button>

          {/* Mobile Search Icon - Hidden for Admin */}
          {!isAdmin && (
            <button
              className="md:hidden text-gray-700 hover:text-green-600 p-1.5 sm:p-2 rounded-lg hover:bg-green-100/80 transition-all duration-300 touch-manipulation"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open Search"
            >
              <Search size={18} className="sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center whitespace-nowrap group flex-shrink-0"
          >
            <div className="relative">
              <img 
                src="/logo/prokrishihublogo.png" 
                alt="Prokrishi Logo" 
                className="h-5 sm:h-6 md:h-7 w-auto object-cover object-center transition-transform duration-300 group-hover:scale-105 max-w-[100px] sm:max-w-[120px] md:max-w-none"
              />
              <div className="absolute inset-0 bg-green-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Menu (centered) */}
        <div className="hidden md:flex flex-1 justify-center px-2">
          <nav className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 md:px-4 py-1.5 shadow-sm border border-gray-100/50 font-poppins">
            <Link href="/" className="text-gray-700 hover:text-gray-900 px-4 md:px-5 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-300 font-semibold text-sm md:text-base whitespace-nowrap">
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 px-4 md:px-5 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-300 font-semibold text-sm md:text-base whitespace-nowrap"
            >
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 px-4 md:px-5 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-300 font-semibold text-sm md:text-base whitespace-nowrap">
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-gray-900 px-4 md:px-5 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-300 font-semibold text-sm md:text-base whitespace-nowrap"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right: Search Bar (conditional) & Icons */}
        <div className="flex items-center flex-shrink-0 justify-end gap-2 sm:gap-3 md:gap-4 lg:gap-6 min-w-0">
          {/* Search Bar with Dropdown - Hidden for Admin */}
          {!isAdmin && (
            <div
              className="hidden md:block relative max-w-md w-full"
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
                  className="w-full pl-3 md:pl-4 pr-9 md:pr-10 py-1.5 md:py-2 border border-green-200/60 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 placeholder:text-gray-500 font-poppins text-xs md:text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1 md:right-1.5 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-600 to-green-700 text-white p-1 md:p-1.5 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 touch-manipulation"
                >
                  <Search size={12} className="md:w-3.5 md:h-3.5" />
                </button>
              </div>
            </form>

            {/* Search Dropdown - Using Portal to render at body level */}
            {showDropdown && mounted && createPortal(
              <div
                ref={dropdownRef}
                className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[10001] max-h-96 overflow-y-auto"
                style={{
                  position: 'fixed',
                  zIndex: 10001,
                  transform: 'translateZ(0)',
                  isolation: 'isolate',
                  top: searchRef.current ? `${searchRef.current.getBoundingClientRect().bottom + window.scrollY + 4}px` : '0px',
                  left: searchRef.current ? `${searchRef.current.getBoundingClientRect().left + window.scrollX}px` : '0px',
                  width: searchRef.current ? `${searchRef.current.getBoundingClientRect().width}px` : 'auto',
                  minWidth: '300px',
                  maxWidth: '500px',
                }}
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
              </div>,
              document.body
            )}
            </div>
          )}

          {/* Dashboard Button (Admin Only) */}
          {isAdmin && (
            <Link
              href="/dashboard"
              className="hidden md:flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-sm md:text-base whitespace-nowrap touch-manipulation"
            >
              <Settings size={14} className="md:w-4 md:h-4" />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Icons */}
          {user ? (
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
              <Link
                href="/account"
                className="flex items-center gap-1 text-gray-700 hover:text-green-600 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg hover:bg-green-100/80 transition-all duration-300 font-medium font-poppins touch-manipulation"
              >
                <User size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden lg:inline text-xs truncate max-w-[80px] md:max-w-none">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 text-xs px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg hover:bg-red-100/80 transition-all duration-300 font-medium font-poppins touch-manipulation whitespace-nowrap"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 text-gray-700 hover:text-green-600 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg hover:bg-green-100/80 transition-all duration-300 font-medium font-poppins touch-manipulation"
            >
              <User size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden lg:inline text-xs">Login</span>
            </Link>
          )}

          <button
            onClick={openSidebar}
            className="relative text-gray-700 hover:text-green-600 p-1.5 sm:p-2 rounded-lg hover:bg-green-100/80 transition-all duration-300 touch-manipulation flex-shrink-0"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <ShoppingCart size={16} className="sm:w-4 sm:h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-[10px] sm:text-xs rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] font-medium shadow-lg animate-pulse">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer - Using Portal to render at body level */}
      {drawerOpen && mounted && createPortal(
        <div
          className="mobile-drawer-overlay fixed inset-0 z-[9998] backdrop-blur-sm"
          style={{ 
            position: 'fixed', 
            zIndex: 9998, 
            transform: 'translateZ(0)',
            contain: 'none',
            isolation: 'isolate',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="mobile-drawer bg-white w-[85vw] max-w-sm h-full p-4 sm:p-6 shadow-2xl overflow-y-auto"
            style={{ 
              position: 'relative', 
              zIndex: 9999, 
              transform: 'translateZ(0)',
              contain: 'none',
              isolation: 'isolate'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Menu</h2>
              <button
                className="text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-green-100/80 transition-colors touch-manipulation"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
            </div>


            {/* Drawer menu items */}
            <nav className="flex flex-col gap-2">
              <Link 
                href="/" 
                className="text-base sm:text-lg text-gray-700 hover:text-green-600 py-3 px-4 rounded-lg hover:bg-green-50 transition-colors touch-manipulation font-medium" 
                onClick={() => setDrawerOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-base sm:text-lg text-gray-700 hover:text-green-600 py-3 px-4 rounded-lg hover:bg-green-50 transition-colors touch-manipulation font-medium" 
                onClick={() => setDrawerOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/about" 
                className="text-base sm:text-lg text-gray-700 hover:text-green-600 py-3 px-4 rounded-lg hover:bg-green-50 transition-colors touch-manipulation font-medium" 
                onClick={() => setDrawerOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-base sm:text-lg text-gray-700 hover:text-green-600 py-3 px-4 rounded-lg hover:bg-green-50 transition-colors touch-manipulation font-medium" 
                onClick={() => setDrawerOpen(false)}
              >
                Contact
              </Link>

              {/* Dashboard Link (Admin Only) */}
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold py-3 px-4 rounded-lg hover:bg-green-50 transition-colors touch-manipulation text-base sm:text-lg"
                  onClick={() => setDrawerOpen(false)}
                >
                  <Settings size={18} className="sm:w-5 sm:h-5" />
                  <span>Dashboard</span>
                </Link>
              )}

              <div className="border-t border-gray-200 my-2"></div>

              {user ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-3 px-4 rounded-lg hover:bg-green-50 transition-colors touch-manipulation text-base sm:text-lg font-medium"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <User size={18} className="sm:w-5 sm:h-5" />
                    <span className="truncate">{user.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDrawerOpen(false);
                    }}
                    className="text-left text-red-600 hover:text-red-700 py-3 px-4 rounded-lg hover:bg-red-50 transition-colors touch-manipulation text-base sm:text-lg font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-3 px-4 rounded-lg hover:bg-green-50 transition-colors touch-manipulation text-base sm:text-lg font-medium"
                  onClick={() => setDrawerOpen(false)}
                >
                  <User size={18} className="sm:w-5 sm:h-5" />
                  <span>Login</span>
                </Link>
              )}
            </nav>
          </div>
        </div>,
        document.body
      )}

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[10002] bg-black/50 backdrop-blur-sm"
          style={{
            position: 'fixed',
            zIndex: 10002,
            transform: 'translateZ(0)',
            isolation: 'isolate',
          }}
          onClick={() => setMobileSearchOpen(false)}
        >
          <div
            className="bg-white w-full p-4 sm:p-6 shadow-2xl"
            style={{
              position: 'relative',
              zIndex: 10003,
              transform: 'translateZ(0)',
              isolation: 'isolate',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Search Products</h2>
              <button
                className="text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-green-100/80 transition-colors touch-manipulation"
                onClick={() => setMobileSearchOpen(false)}
                aria-label="Close Search"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4" ref={mobileSearchRef}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for products..."
                  className="w-full pl-4 pr-12 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white text-base"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-600 to-green-700 text-white p-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-sm hover:shadow-md touch-manipulation"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Search Results */}
            {showDropdown && (
              <div className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-lg">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product, index) => (
                      <div
                        key={product._id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleResultClick(product);
                          // Close overlay after navigation starts
                          setTimeout(() => {
                            setMobileSearchOpen(false);
                          }, 100);
                        }}
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
                        </div>
                      </div>
                    ))}
                    <div className="p-3 border-t border-gray-200 bg-green-50">
                      <button
                        onClick={() => {
                          handleSearch({ preventDefault: () => {} } as React.FormEvent);
                          setMobileSearchOpen(false);
                        }}
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
        </div>,
        document.body
      )}
    </>
  );
}

// Memoize Navbar to prevent unnecessary re-renders
export default memo(Navbar);
