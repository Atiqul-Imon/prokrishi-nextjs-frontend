"use client";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import FeaturedCategories from "@/components/FeaturedCategories";
import { Product, Category } from "@/types/models";
import { useStaticData } from "@/hooks/useSWRWithConfig";


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
  // Use SWR for featured products only
  // These are cached for 30 minutes since they don't change frequently
  const { data: featuredData, error: featuredError } = useStaticData<{ products: Product[] }>("/product/featured");

  const featuredProducts = featuredData?.products || [];

  // Show error state if needed (optional - could also fail silently)
  if (featuredError) {
    console.error("Error loading homepage data");
  }

  return (
    <main>
      <HeroSection />

      <FeaturedCategories />

      {/* Featured Products Section - Titleless */}
      <section className="py-6 sm:py-8 lg:py-12 bg-gray-50 w-full">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 w-full">
          {featuredProducts.length > 0 ? (
            <div className="product-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-4 lg:gap-6 items-stretch">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
              <p className="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-base">Loading products...</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

