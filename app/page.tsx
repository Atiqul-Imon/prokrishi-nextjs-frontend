"use client";
import { ReactNode } from "react";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FeaturedCategories from "@/components/FeaturedCategories";
import { Product, Category } from "@/types/models";
import { useStaticData } from "@/hooks/useSWRWithConfig";

interface SectionProps {
  title: string;
  children: ReactNode;
  href?: string;
}

const Section = ({ title, children, href }: SectionProps) => (
  <section className="py-6 sm:py-8 lg:py-12 bg-gray-50">
    <div className="container mx-auto px-3 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-xs sm:text-sm text-primary font-semibold hover:text-primary-dark flex items-center self-start sm:self-auto"
          >
            View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </Link>
        )}
      </div>
      {children}
    </div>
  </section>
);

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => (
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
  // Use SWR for featured and popular products
  // These are cached for 30 minutes since they don't change frequently
  const { data: featuredData, error: featuredError } = useStaticData<{ products: Product[] }>("/product/featured");
  const { data: popularData, error: popularError } = useStaticData<{ products: Product[] }>("/product/popular");

  const featuredProducts = featuredData?.products || [];
  const popularProducts = popularData?.products || [];

  // Show error state if needed (optional - could also fail silently)
  if (featuredError || popularError) {
    console.error("Error loading homepage data");
  }

  return (
    <main>
      <HeroSection />

      <FeaturedCategories />

      <Section title="Featured Products" href="/products">
        {featuredProducts.length > 0 ? (
          <div className="product-grid grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
            <p className="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-base">Loading featured products...</p>
          </div>
        )}
      </Section>

      <Section title="Popular Products" href="/products">
        {popularProducts.length > 0 ? (
          <div className="product-grid grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
            <p className="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-base">Loading popular products...</p>
          </div>
        )}
      </Section>
    </main>
  );
}

