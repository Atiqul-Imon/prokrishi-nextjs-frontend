import { Building, Target, Users, Leaf, Heart, Shield, Truck } from "lucide-react";

export const metadata = {
  title: "আমাদের সম্পর্কে - Prokrishi",
  description: "প্রোকৃষি সম্পর্কে জানুন - আমাদের মিশন এবং স্বাস্থ্যকর ও নিরাপদ খাদ্য সরবরাহের প্রতিশ্রুতি।",
};

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight font-display">
            আমাদের সম্পর্কে
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-bangla">
            প্রোকৃষি একটি ই-কমার্স প্রতিষ্ঠান। আমরা মানুষের দোরগোড়ায় হেলদি ও সেফ ফুড পৌঁছে দিই।
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6 leading-relaxed font-bangla text-lg">
              নদীর মাছ, হাওর-বাওর ও কাপ্তাই লেকের মাছ, সামুদ্রিক মাছ, লাল আটা, লাল চিনি, বিষমুক্ত সবজি ও মৌসুমী ফল সুন্দরবনের মধু, ঘি, শ্রীমঙ্গলের চা ও গ্রিন টি, কেমিক্যাল ফ্রি চাল ও খেজুরের গুড় পাটালি প্রোকৃষি সরাসরি উৎস থেকে সংগ্রহ করে। মানুষের স্বাস্থ্য আমাদের অগ্রাধিকার।
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed font-bangla text-lg">
              আমরা শুধু পণ্য বিক্রি করি না — মানুষকে নিরাপদ ও সচেতন খাদ্যাভ্যাস গড়ে তুলতে উৎসাহিত করি, সচেতন করি। কারণ ভেজাল খাবারের কারণেই ক্যান্সার, হৃদরোগ, ডায়বেটিস, কিডনি ও লিভারের জটিল রোগসহ অসংক্রামক নানা রোগ মহামারির আকার ধারণ করেছে।
            </p>

            <div className="bg-green-50 border-l-4 border-green-600 p-6 my-8 rounded-r-lg">
              <p className="text-gray-800 font-bold text-xl mb-2 font-bangla">
                প্রোকৃষি বিশ্বাস করে,
              </p>
              <p className="text-gray-900 text-2xl font-bold italic font-bangla">
                "সুস্থ মানুষই শক্তিশালী সমাজ গড়ে তোলে।"
              </p>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed font-bangla text-lg">
              তাই আমাদের এই উদ্যোগটিই হলো পুষ্টিকর ও নিরাপদ খাদ্য পৌঁছে দেওয়ার মাধ্যম হেলদি বাংলাদেশ গড়ে তোলা।
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-bangla">
            আমাদের সেবা
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Truck className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2 font-bangla">দোরগোড়ায় পৌঁছে দেওয়া</h3>
              <p className="text-gray-600 font-bangla">হেলদি ও সেফ ফুড আপনার দোরগোড়ায় পৌঁছে দেওয়া</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2 font-bangla">নিরাপদ খাদ্য</h3>
              <p className="text-gray-600 font-bangla">বিষমুক্ত ও কেমিক্যাল ফ্রি পণ্য সরাসরি উৎস থেকে</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2 font-bangla">স্বাস্থ্য অগ্রাধিকার</h3>
              <p className="text-gray-600 font-bangla">মানুষের স্বাস্থ্য আমাদের সর্বোচ্চ অগ্রাধিকার</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage; 