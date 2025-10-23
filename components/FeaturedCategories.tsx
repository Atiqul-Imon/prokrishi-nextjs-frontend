"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getFeaturedCategories } from "@/app/utils/api";
import { getCategoryImageUrl } from "@/utils/imageOptimizer";

const CategoryCard = ({ category }) => (
  <Link
    href={`/products/category/${category.slug}`}
    className="group block text-center p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
  >
    <div className="relative w-20 h-20 mx-auto mb-4 overflow-hidden rounded-2xl border-2 border-green-100 group-hover:border-green-300 transition-colors duration-300">
      <img
        src={getCategoryImageUrl(category.image)}
        alt={category.name}
        loading="lazy"
        width={200}
        height={200}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
    </div>
    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-green-600 capitalize transition-colors duration-300">
      {category.name}
    </h3>
  </Link>
);

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const data = await getFeaturedCategories();
        // Show only first 8 categories on homepage
        setCategories((data.categories || []).slice(0, 8));
      } catch (err) {
        setError("Failed to load featured categories.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="text-gray-600 mt-4">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 justify-center">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>

        {/* View All Categories Link */}
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
          >
            সব বিভাগ দেখুন
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
