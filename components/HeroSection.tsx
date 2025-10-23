import React from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Truck, Shield, Sparkles } from "lucide-react";

function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Bangla tagline badge */}
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            প্রাকৃতিক ও টাটকা খাবার
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block text-gray-800">প্রকৃশি হাব</span>
            <span className="block text-green-600 mt-2">আপনার বিশ্বস্ত কৃষি পণ্যের প্ল্যাটফর্ম</span>
          </h1>

          {/* Clean description */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            সরাসরি কৃষকের কাছ থেকে তাজা ও প্রাকৃতিক কৃষি পণ্য সংগ্রহ করুন। 
            গুণগত মান নিশ্চিত করে স্বাস্থ্যকর জীবনযাপনের সুযোগ নিন।
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/products">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg text-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl">
                পণ্য দেখুন
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>

            <Link href="/about">
              <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200">
                আমাদের সম্পর্কে
              </button>
            </Link>
          </div>

          {/* Key features - Clean grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl border border-green-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">দ্রুত ডেলিভারি</h3>
              <p className="text-gray-600 text-sm">সকালে অর্ডার, বিকেলে পণ্য</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl border border-green-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">১০০% প্রাকৃতিক</h3>
              <p className="text-gray-600 text-sm">কেমিক্যাল মুক্ত গুণগত পণ্য</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl border border-green-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">গুণগত নিশ্চয়তা</h3>
              <p className="text-gray-600 text-sm">সর্বোচ্চ মানের প্রতিশ্রুতি</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
