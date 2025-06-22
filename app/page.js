"use client";
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { apiRequest } from "@/app/utils/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FeaturedCategories from "@/components/FeaturedCategories";

const Section = ({ title, children, href }) => (
  <section className="py-8 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm text-primary font-semibold hover:text-primary-dark flex items-center"
          >
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>
      {children}
    </div>
  </section>
);

const CategoryCard = ({ category }) => (
  <Link href={`/products/category/${category._id}`}>
    <div className="group block text-center">
      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary transition-all duration-300">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-700 group-hover:text-primary transition-colors">
        {category.name}
      </h3>
    </div>
  </Link>
);

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, popRes] = await Promise.all([
          apiRequest("/product/featured"),
          apiRequest("/product/popular"),
        ]);
        setFeaturedProducts(featRes.products || []);
        setPopularProducts(popRes.products || []);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main>
      <HeroSection />

      <FeaturedCategories />

      <Section title="Featured Products" href="/products">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </Section>

      <Section title="Popular Products" href="/products">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </Section>
    </main>
  );
}
