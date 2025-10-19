import { Building, Target, Users, Leaf } from "lucide-react";

export const metadata = {
  title: "About Us - Prokrishi",
  description: "Learn more about Prokrishi, our mission, and our commitment to providing the best organic and fresh products.",
};

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Nourishing Communities, Naturally.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Prokrishi is more than just an e-commerce store. We are a movement dedicated to bringing you the freshest, highest-quality products directly from nature to your table.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="pr-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              Our mission is to bridge the gap between dedicated local farmers and conscious consumers. We aim to create a sustainable ecosystem that supports local agriculture, promotes healthy living, and delivers unparalleled freshness and quality.
            </p>
            <p className="text-gray-600">
              We believe in fair trade, environmental responsibility, and the simple joy of eating well.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Organic Quality</h3>
              <p className="text-sm text-gray-600">Sourced directly from trusted local farms.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Community Support</h3>
              <p className="text-sm text-gray-600">Empowering farmers and nourishing customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
                Founded in [Year], Prokrishi started with a simple idea: everyone deserves access to fresh, healthy, and authentic food. We saw the incredible dedication of local farmers and the growing desire of people to know where their food comes from.
            </p>
            <p className="text-gray-600">
                What began as a small weekend market stall has blossomed into a thriving online platform, but our core principles remain unchanged. We are still that passionate team committed to quality, community, and the goodness of nature.
            </p>
        </div>
      </section>
      
      {/* Our Values Section */}
       <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-4">
                    <h3 className="font-bold text-xl mb-2">Authenticity</h3>
                    <p className="text-gray-600">We guarantee genuine products, free from harmful chemicals and sourced with integrity.</p>
                </div>
                <div className="p-4">
                    <h3 className="font-bold text-xl mb-2">Sustainability</h3>
                    <p className="text-gray-600">We practice and promote farming methods that respect and protect our environment.</p>
                </div>
                <div className="p-4">
                    <h3 className="font-bold text-xl mb-2">Customer Trust</h3>
                    <p className="text-gray-600">Your health and satisfaction are our highest priorities. We are transparent in everything we do.</p>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage; 