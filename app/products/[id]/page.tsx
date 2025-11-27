"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Package,
  Share2,
  ZoomIn,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { useProductData } from "@/hooks/useSWRWithConfig";
import { getProductImageUrl } from "@/utils/imageOptimizer";
import { getProductImageList } from "@/utils/productImages";
import { formatMeasurement, formatPricePerUnit, getMeasurementDisplayText } from "@/app/utils/measurement";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton";
import { getRelatedProducts } from "@/app/utils/api";
import { ProductVariant } from "@/types/models";

type ApiError = Error & { status?: number };

const normalizeMeasurement = (measurement: number, unit: string) => {
  if (unit === "g") {
    return { value: measurement / 1000, displayUnit: "kg" };
  }
  if (unit === "ml") {
    return { value: measurement / 1000, displayUnit: "l" };
  }
  return { value: measurement, displayUnit: unit };
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { messages, showMessage, removeMessage, success, error: showError } = useInlineMessage();

  // Fetch product data
  const { data, error, isLoading, mutate } = useProductData<any>(id ? `/product/${id}` : null);
  const product = data?.product;

  // Initialize selected variant when product loads
  React.useEffect(() => {
    if (product?.hasVariants && product.variants && product.variants.length > 0) {
      // Set default variant or first variant
      const defaultVariant = product.variants.find((v: ProductVariant) => v.isDefault) || product.variants[0];
      setSelectedVariant(defaultVariant);
      setQuantity(defaultVariant.measurementIncrement || 1);
    } else if (product && !product.hasVariants) {
      setSelectedVariant(null);
      setQuantity(product.measurementIncrement || 1);
    }
  }, [product]);

  const productImages = useMemo(() => getProductImageList(product, "/testp.webp"), [product]);
  const activeImage = productImages[activeImageIndex] || "/testp.webp";
  const hasGalleryImages = productImages.length > 1;

  // Reset gallery index when product changes
  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [product?._id]);

  // Fetch related products
  React.useEffect(() => {
    if (product?._id) {
      setLoadingRelated(true);
      getRelatedProducts(product._id, 6)
        .then((response) => {
          if (response.success && response.products) {
            setRelatedProducts(response.products);
          }
        })
        .catch((err) => {
          console.error("Error fetching related products:", err);
        })
        .finally(() => setLoadingRelated(false));
    }
  }, [product?._id]);

  // Calculate quantity increment based on unit type
  const quantityIncrement = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.measurementIncrement || 1;
    }
    if (!product) return 1;
    if (product.unit === "pcs") return 1;
    if (product.measurementIncrement) return product.measurementIncrement;
    // Default increments for different units
    if (product.unit === "kg") return 0.5;
    if (product.unit === "g") return 100;
    if (product.unit === "l") return 0.5;
    if (product.unit === "ml") return 100;
    return 0.1;
  }, [product, selectedVariant]);

  // Format quantity display
  const formatQuantity = (qty: number) => {
    const unit = selectedVariant?.unit || product?.unit;
    if (unit === "pcs") return Math.floor(qty).toString();
    if (qty % 1 === 0) return qty.toString();
    return qty.toFixed(2);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
    const currentUnit = selectedVariant ? selectedVariant.unit : product.unit;
    const variantId = selectedVariant?._id;
    
    if (currentStock < quantity) {
      showError(`Not enough stock available. Available: ${currentStock} ${currentUnit}`, 5000);
      return;
    }
    if (quantity > 0) {
      addToCart(product, quantity, variantId);
      success(`${formatQuantity(quantity)} ${currentUnit} added to cart!`, 5000);
    }
  };

  const incrementQuantity = () => {
    if (!product) return;
    const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
    const currentUnit = selectedVariant ? selectedVariant.unit : product.unit;
    const newQuantity = quantity + quantityIncrement;
    if (newQuantity <= currentStock) {
      setQuantity(newQuantity);
    } else {
      showError(`Maximum available stock is ${currentStock} ${currentUnit}`, 5000);
    }
  };

  const decrementQuantity = () => {
    const newQuantity = Math.max(quantityIncrement, quantity - quantityIncrement);
    setQuantity(newQuantity);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || quantityIncrement;
    const currentStock = selectedVariant ? selectedVariant.stock : product?.stock;
    const currentUnit = selectedVariant ? selectedVariant.unit : product?.unit;
    
    if (product && value > 0 && value <= (currentStock || 0)) {
      setQuantity(value);
    } else if (product && value > (currentStock || 0)) {
      showError(`Maximum available stock is ${currentStock} ${currentUnit}`, 5000);
      setQuantity(currentStock || 0);
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || product.description?.substring(0, 100),
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      success("Link copied to clipboard!", 3000);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-amber-20 to-yellow-20 min-h-screen pb-20 md:pb-0">
        <section className="w-full py-12">
          <div className="container mx-auto w-full px-3 sm:px-4 lg:px-6">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-32"></div>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error && (error as ApiError).status === 404) {
    return (
      <div className="bg-gradient-to-br from-amber-20 to-yellow-20 min-h-screen pb-20 md:pb-0 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-gray-400 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">পণ্যটি স্টকে নেই নয়</h2>
          <p className="text-gray-600 mb-6">
            অনুগ্রহ করে অন্য একটি পণ্য বেছে নিন। এটি সম্ভবত স্টক থেকে সরানো হয়েছে।
          </p>
          <button
            onClick={() => router.push("/products")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            সব পণ্য দেখুন
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-amber-20 to-yellow-20 min-h-screen pb-20 md:pb-0 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-red-600 mb-4">
            <X className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => mutate()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/products")}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="bg-gradient-to-br from-amber-20 to-yellow-20 min-h-screen pb-20 md:pb-0 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-gray-400 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentMeasurement = selectedVariant ? selectedVariant.measurement : product.measurement;
  const currentUnit = selectedVariant ? selectedVariant.unit : product.unit;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const normalizedMeasurement = normalizeMeasurement(currentMeasurement, currentUnit);
  const currentPricePerUnit = normalizedMeasurement.value > 0 ? Math.round(currentPrice / normalizedMeasurement.value) : null;
  const currentUnitDisplay = normalizedMeasurement.displayUnit;
  
  const isOutOfStock = currentStock === 0;
  const measurementDisplay = formatMeasurement(currentMeasurement, currentUnit);
  const pricePerUnitDisplay = formatPricePerUnit(currentPrice, currentMeasurement, currentUnit);

  // Breadcrumbs
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    ...(product.category ? [{ name: product.category.name, href: `/products/category/${product.category._id}` }] : []),
    { name: product.name, href: `#` },
  ];

  return (
    <div className="bg-gradient-to-br from-amber-20 to-yellow-20 min-h-screen pb-20 md:pb-0">
      <section className="w-full py-8">
        <div className="container mx-auto w-full px-3 sm:px-4 lg:px-6">
        {/* Inline Messages */}
        <div className="mb-4 space-y-2">
          {messages.map((msg) => (
            <InlineMessage
              key={msg.id}
              type={msg.type}
              message={msg.message}
              onClose={() => removeMessage(msg.id)}
            />
          ))}
        </div>
        {/* Breadcrumbs */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-green-600">
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-10">
            {/* Product Image */}
            <div className="relative">
              <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden group">
                <Image
                  src={getProductImageUrl(activeImage, "detail")}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <button
                  onClick={() => setImageZoomed(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors"
                  aria-label="Zoom image"
                >
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              {hasGalleryImages && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {productImages.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative aspect-square border ${
                        activeImageIndex === index
                          ? "border-green-600 ring-2 ring-green-200"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image
                        src={getProductImageUrl(img, "thumbnail")}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Image Zoom Modal */}
              {imageZoomed && (
                <div
                  className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setImageZoomed(false)}
                >
                  <button
                    onClick={() => setImageZoomed(false)}
                    className="absolute top-4 right-4 text-gray-800 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <div className="relative max-w-4xl max-h-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-4" onClick={(e) => e.stopPropagation()}>
                    <Image
                      src={getProductImageUrl(activeImage, "full")}
                      alt={product.name}
                      width={1200}
                      height={1200}
                      className="object-contain max-h-[80vh]"
                    />
                  </div>
                </div>
              )}

              {/* Product Stats */}
              <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                {product.sold > 0 && (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>{product.sold} sold</span>
                  </div>
                )}
                {product.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating.toFixed(1)} ({product.reviewCount || 0})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category & Actions */}
              <div className="flex items-start justify-between mb-4">
                {product.category && (
                  <Link
                    href={`/products/category/${product.category._id}`}
                    className="text-green-600 hover:text-green-700 font-semibold text-sm uppercase tracking-wide"
                  >
                    {product.category.name}
                  </Link>
                )}
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-display">
                {product.name}
              </h1>

              {/* SKU */}
              {product.sku && (
                <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>
              )}

              {/* Price */}
              <div className="my-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                  {currentUnit !== "pcs" && (
                    <span className="text-xl font-medium text-gray-600">
                      / {measurementDisplay.displayText}
                    </span>
                  )}
                </div>
                {currentUnit !== "pcs" && (
                  <p className="text-sm text-gray-500 mt-1">{pricePerUnitDisplay}</p>
                )}
                {product.hasVariants && product.variantSummary && (
                  <p className="text-sm text-gray-500 mt-1">
                    Price range: ৳{product.variantSummary.minPrice.toLocaleString()} - ৳{product.variantSummary.maxPrice.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Variant Selector */}
              {product.hasVariants && product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Option</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant: ProductVariant) => (
                      <button
                        key={variant._id}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setQuantity(variant.measurementIncrement || 1);
                        }}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                          selectedVariant?._id === variant._id
                            ? "border-green-600 bg-green-50 text-green-800"
                            : "border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:text-green-700"
                        } ${variant.status === 'out_of_stock' || variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={variant.status === 'out_of_stock' || variant.stock === 0}
                      >
                        {variant.label}
                      </button>
                    ))}
                  </div>
                  {currentPricePerUnit && (
                    <p className="mt-3 text-sm font-semibold text-green-700">
                      প্রতি {currentUnitDisplay} মূল্য {currentPricePerUnit.toLocaleString()} টাকা
                    </p>
                  )}
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                  <div className="border border-gray-200 rounded-lg divide-y">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 p-3 hover:bg-gray-50">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-600">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-green-500">
                    <button
                      onClick={decrementQuantity}
                      disabled={isOutOfStock || quantity <= quantityIncrement}
                      className="p-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={formatQuantity(quantity)}
                      onChange={handleQuantityChange}
                      min={quantityIncrement}
                      max={currentStock}
                      step={quantityIncrement}
                      disabled={isOutOfStock}
                      className="w-20 text-center font-semibold text-lg border-0 focus:ring-0 focus:outline-none disabled:bg-transparent"
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={isOutOfStock || quantity >= currentStock}
                      className="p-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                    <span className="text-sm text-gray-500">{currentUnit}</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 space-y-3 text-sm text-gray-600 border-t pt-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>100% Secure Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Fast Delivery Across Bangladesh</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Easy Returns & Exchanges</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width Description */}
          {product.description && (
            <div className="border-t border-gray-100 px-6 lg:px-10 pb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Description</h2>
              <div className="bg-white/90 rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm">
                <div className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-line bangla-body">
                  {product.description}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            {loadingRelated ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct._id} product={relatedProduct} />
                ))}
              </div>
            )}
          </section>
        )}
        </div>
      </section>
    </div>
  );
}
