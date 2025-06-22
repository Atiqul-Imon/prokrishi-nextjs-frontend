"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Heart,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const {
    _id,
    name,
    image,
    price,
    category,
    stock,
    description,
    measurement,
    unit,
  } = product;
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, id: _id }, 1);
  }

  const inStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <motion.div
      className="group relative border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsWishlisted(!isWishlisted);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
          isWishlisted
            ? "bg-red-500 text-white shadow-lg"
            : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
        }`}
      >
        <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
      </button>

      {/* Quick View Button */}
      <Link href={`/products/${_id}`}>
        <button className="absolute top-3 left-3 z-10 p-2 bg-white/80 text-gray-600 rounded-full hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100">
          <Eye size={18} />
        </button>
      </Link>

      {/* Image Container */}
      <Link href={`/products/${_id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={image || "/img/placeholder.png"}
            alt={name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Stock Status Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          {isLowStock && inStock && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Only {stock} left
            </div>
          )}
        </div>

        {/* Category Badge */}
        {category && (
          <span className="absolute top-3 left-12 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
            {category.name}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/products/${_id}`}>{name}</Link>
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">(4.2 • 12 reviews)</span>
        </div>

        {/* Price and Stock */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-primary">
              ৳{price}
              {unit !== "pcs" && (
                <span className="text-base font-normal text-gray-600">
                  {" "}
                  / {measurement}
                  {unit === "l" ? "L" : unit}
                </span>
              )}
            </p>
            {unit === "pcs" && (
              <p className="text-sm text-gray-500 line-through">
                ৳{Math.round(price * 1.2)}
              </p>
            )}
          </div>
          <div className="flex items-center">
            {inStock ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm font-semibold ${inStock ? "text-green-600" : "text-red-600"}`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="w-full bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out transform hover:bg-primary hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          whileHover={inStock ? { scale: 1.02 } : {}}
          whileTap={inStock ? { scale: 0.98 } : {}}
        >
          <ShoppingCart size={18} className="mr-2" />
          <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
