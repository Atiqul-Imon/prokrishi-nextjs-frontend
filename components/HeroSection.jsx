import React from 'react';

function HeroSection() {
  return (
    <section className="relative bg-green-50">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/testp.webp" 
          alt="Organic food"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[40vh] text-center px-4">
        {/* <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Pure & Organic Food for You
        </h1>
        <p className="text-white text-lg md:text-xl max-w-xl mb-6">
          Get fresh and natural food directly from trusted sources. Stay healthy, eat clean.
        </p> */}
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg text-lg">
          Shop Now
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
