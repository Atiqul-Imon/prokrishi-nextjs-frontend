import React from "react";
import Image from "next/image";

function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Hero Image Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/hero-image.webp"
          alt="Prokrishi Hero"
          fill
          priority
          className="object-cover"
          quality={90}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-slate-900/40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            <span className="block">Prokrishi</span>
            <span className="block text-green-400 mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bangla-title">
              আপনার বিশ্বস্ত কৃষি পণ্যের প্ল্যাটফর্ম
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;