import React from "react";
import Image from "next/image";

function HeroSection() {
  return (
    <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/6] overflow-hidden">
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

    </section>
  );
}

export default HeroSection;