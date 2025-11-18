"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getFeaturedCategories } from "@/app/utils/api";
import { getCategoryImageUrl } from "@/utils/imageOptimizer";

const CategoryCard = ({ category }) => (
  <Link
    href={`/products/category/${category.slug}`}
    className="group block text-center p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
  >
    <div className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 md:mb-5 overflow-hidden rounded-xl sm:rounded-2xl border-2 border-green-100 group-hover:border-green-300 transition-colors duration-300">
      <img
        src={getCategoryImageUrl(category.image)}
        alt={category.name}
        loading="lazy"
        width={200}
        height={200}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
    </div>
    <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-green-600 capitalize transition-colors duration-300 line-clamp-2">
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
      <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-br from-amber-20 to-yellow-20 w-full">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 w-full">
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
      <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-br from-amber-20 to-yellow-20 w-full">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 w-full">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-br from-amber-20 to-yellow-20 w-full">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-5 md:gap-6 justify-center">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
