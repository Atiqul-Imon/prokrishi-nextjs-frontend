import React from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Truck, Shield } from "lucide-react";

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059b69%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/testp.webp"
          alt="Organic food"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium mb-4">
              <Leaf className="w-3 h-3 mr-1.5" />
              Fresh from Farm to Table
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Pure & Organic
              <span className="block text-green-600">Food for You</span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl">
              Get fresh and natural food directly from trusted sources. Stay
              healthy, eat clean, and support local farmers.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/products">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg text-base flex items-center justify-center">
                  Shop Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </Link>

              <Link href="/about">
                <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold px-6 py-3 rounded-lg text-base">
                  Learn More
                </button>
              </Link>
            </div>

            {/* Features - Compact */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Fast Delivery</h3>
                <p className="text-xs text-gray-600">Same day</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">100% Organic</h3>
                <p className="text-xs text-gray-600">Certified</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Quality</h3>
                <p className="text-xs text-gray-600">Best guarantee</p>
              </div>
            </div>
          </div>

          {/* Right Content - Compact Image */}
          <div className="relative hidden lg:block">
            <div className="relative bg-white rounded-2xl p-4">
              <img
                src="/testp.webp"
                alt="Fresh organic vegetables"
                className="w-full h-48 object-cover rounded-xl"
                loading="lazy"
              />
              <div className="mt-3 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Fresh Daily
                </h3>
                <p className="text-gray-600 text-sm">Handpicked from local farms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
