import React from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Shield, Truck } from "lucide-react";

function HeroSection() {
  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-br from-green-50 via-amber-50 to-emerald-50 overflow-hidden">
      

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Main heading with enhanced styling */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
                  Prokrishi
                </span>
                <span className="block bg-gradient-to-r from-green-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent mt-3 text-2xl md:text-3xl lg:text-4xl font-bold">
                  আপনার বিশ্বস্ত কৃষি পণ্যের প্ল্যাটফর্ম
                </span>
              </h1>

              {/* Enhanced description */}
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                সরাসরি কৃষকের কাছ থেকে তাজা ও প্রাকৃতিক কৃষি পণ্য সংগ্রহ করুন। 
                গুণগত মান নিশ্চিত করে স্বাস্থ্যকর জীবনযাপনের সুযোগ নিন।
              </p>

              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link href="/products">
                  <button className="group relative bg-gradient-to-r from-green-600 via-amber-500 to-emerald-600 hover:from-green-700 hover:via-amber-600 hover:to-emerald-700 text-white font-bold px-10 py-4 rounded-2xl text-lg flex items-center justify-center transition-all duration-300 shadow-2xl hover:shadow-green-500/30 transform hover:scale-105 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">পণ্য দেখুন</span>
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  </button>
                </Link>

                <Link href="/about">
                  <button className="group border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 relative overflow-hidden">
                    <div className="absolute inset-0 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <span className="relative z-10">আমাদের সম্পর্কে</span>
                  </button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="font-semibold text-gray-700">১০০% নিরাপদ</span>
                </div>
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-amber-600 mr-2" />
                  <span className="font-semibold text-gray-700">দ্রুত ডেলিভারি</span>
                </div>
                <div className="flex items-center">
                  <Leaf className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-semibold text-gray-700">প্রাকৃতিক পণ্য</span>
                </div>
              </div>
            </div>

            {/* Right Content - Visual Elements */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main card */}
                <div className="bg-gradient-to-br from-white/90 to-amber-50/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-amber-200 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-200 to-emerald-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Leaf className="w-10 h-10 text-green-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      তাজা ও প্রাকৃতিক
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      সরাসরি কৃষকের খামার থেকে সংগ্রহ করা তাজা কৃষি পণ্য
                    </p>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-emerald-100 to-green-200 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-emerald-200 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-200 to-green-300 rounded-xl flex items-center justify-center mr-3">
                      <Truck className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">দ্রুত ডেলিভারি</h4>
                      <p className="text-xs text-gray-600">সকালে অর্ডার</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-amber-100 to-yellow-200 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-amber-200 transform rotate-12 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-orange-300 rounded-xl flex items-center justify-center mr-3">
                      <Shield className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">গুণগত নিশ্চয়তা</h4>
                      <p className="text-xs text-gray-600">মান নিশ্চিত</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;