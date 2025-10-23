import React from "react";

function HeroSection() {
  return (
    <section className="relative py-8 lg:py-12 bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-green-900/70 to-emerald-900/80"></div>
      </div>

      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-teal-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            
            {/* Left Content - Heading */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                <span className="block">Prokrishi</span>
                <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                  আপনার বিশ্বস্ত কৃষি পণ্যের প্ল্যাটফর্ম
                </span>
              </h1>
            </div>

            {/* Right Content - Agricultural Product Images */}
            <div className="relative">
              {/* Mobile & Tablet Version - 2 Products Per Row */}
              <div className="lg:hidden">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20">
                    <div className="w-full h-16 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xl sm:text-2xl" role="img" aria-label="Vegetables">🥬</span>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-white font-bold text-xs sm:text-sm">Fresh Vegetables</h3>
                      <p className="text-gray-300 text-xs">Organic & Natural</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20">
                    <div className="w-full h-16 sm:h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xl sm:text-2xl" role="img" aria-label="Fruits">🍎</span>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-white font-bold text-xs sm:text-sm">Fresh Fruits</h3>
                      <p className="text-gray-300 text-xs">Seasonal & Sweet</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20">
                    <div className="w-full h-16 sm:h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xl sm:text-2xl" role="img" aria-label="Grains">🌾</span>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-white font-bold text-xs sm:text-sm">Grains & Rice</h3>
                      <p className="text-gray-300 text-xs">Premium Quality</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20">
                    <div className="w-full h-16 sm:h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xl sm:text-2xl" role="img" aria-label="Spices">🌿</span>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-white font-bold text-xs sm:text-sm">Spices & Herbs</h3>
                      <p className="text-gray-300 text-xs">Aromatic & Pure</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Version - 2 Products Per Row */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  {/* Fresh Vegetables */}
                  <div className="relative group">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
                      <div className="w-full h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white text-2xl" role="img" aria-label="Vegetables">🥬</span>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-white font-bold text-sm">Fresh Vegetables</h3>
                        <p className="text-gray-300 text-xs">Organic & Natural</p>
                      </div>
                    </div>
                  </div>

                  {/* Fruits */}
                  <div className="relative group">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
                      <div className="w-full h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white text-2xl" role="img" aria-label="Fruits">🍎</span>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-white font-bold text-sm">Fresh Fruits</h3>
                        <p className="text-gray-300 text-xs">Seasonal & Sweet</p>
                      </div>
                    </div>
                  </div>

                  {/* Grains */}
                  <div className="relative group">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
                      <div className="w-full h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white text-2xl" role="img" aria-label="Grains">🌾</span>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-white font-bold text-sm">Grains & Rice</h3>
                        <p className="text-gray-300 text-xs">Premium Quality</p>
                      </div>
                    </div>
                  </div>

                  {/* Spices */}
                  <div className="relative group">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
                      <div className="w-full h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white text-2xl" role="img" aria-label="Spices">🌿</span>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-white font-bold text-sm">Spices & Herbs</h3>
                        <p className="text-gray-300 text-xs">Aromatic & Pure</p>
                      </div>
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