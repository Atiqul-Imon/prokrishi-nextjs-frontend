import { Shield, Package, Truck, CreditCard, RotateCcw, AlertTriangle, Lock, FileText } from "lucide-react";

export const metadata = {
  title: "টার্মস অ্যান্ড কন্ডিশন - Prokrishi",
  description: "প্রোকৃষির টার্মস অ্যান্ড কন্ডিশন - পণ্যের মান, অর্ডার, ডেলিভারি, পেমেন্ট, রিটার্ন ও রিফান্ড নীতিমালা।",
};

const TermsPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight font-display">
            টার্মস অ্যান্ড কন্ডিশন
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-bangla">
            প্রোকৃষির সেবা ব্যবহারের শর্তাবলী
          </p>
        </div>
      </section>

      {/* Terms Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {/* Product Quality */}
            <div className="bg-white border-l-4 border-green-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <Package className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 font-bangla">
                    পণ্যের মান
                  </h2>
                  <p className="text-gray-700 leading-relaxed font-bangla text-lg">
                    প্রোকৃষি নিরাপদ ও বিষমুক্ত খাদ্য সরবরাহে প্রতিশ্রুতিবদ্ধ। পণ্যের প্রাকৃতিক বৈশিষ্ট্য অনুযায়ী আকার, রঙ বা স্বাদে সামান্য পার্থক্য হতে পারে।
                  </p>
                </div>
              </div>
            </div>

            {/* Order & Delivery */}
            <div className="bg-white border-l-4 border-blue-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <Truck className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 font-bangla">
                    অর্ডার ও ডেলিভারি
                  </h2>
                  <p className="text-gray-700 leading-relaxed font-bangla text-lg">
                    অর্ডার কনফার্ম হওয়ার পর নির্ধারিত সময়ের মধ্যে পণ্য সরবরাহ করা হবে। প্রাকৃতিক দুর্যোগ বা পরিবহনজনিত কারণে বিলম্ব হতে পারে।
                  </p>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <CreditCard className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 font-bangla">
                    পেমেন্ট
                  </h2>
                  <p className="text-gray-700 leading-relaxed font-bangla text-lg">
                    নগদে (Cash on Delivery) বা অনলাইন পেমেন্ট (bKash/Nagad/Bank) এর মাধ্যমে মূল্য পরিশোধ করা যাবে।
                  </p>
                </div>
              </div>
            </div>

            {/* Return & Refund */}
            <div className="bg-white border-l-4 border-orange-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <RotateCcw className="h-8 w-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 font-bangla">
                    রিটার্ন ও রিফান্ড
                  </h2>
                  <p className="text-gray-700 leading-relaxed font-bangla text-lg">
                    পণ্য ক্ষতিগ্রস্ত, মেয়াদোত্তীর্ণ বা ভুল হলে ২৪ ঘণ্টার মধ্যে জানালে পণ্য পরিবর্তন বা রিফান্ডের ব্যবস্থা করা হবে।
                  </p>
                </div>
              </div>
            </div>

            {/* Liability Limitation */}
            <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 font-bangla">
                    দায়বদ্ধতা সীমাবদ্ধতা
                  </h2>
                  <p className="text-gray-700 leading-relaxed font-bangla text-lg">
                    পণ্য সরবরাহের পর এর সংরক্ষণ ও ব্যবহারজনিত ক্ষতির জন্য প্রোকৃষি দায়ী থাকবে না।
                  </p>
                </div>
              </div>
            </div>

            {/* User Information & Privacy */}
            <div className="bg-white border-l-4 border-indigo-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <Lock className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 font-bangla">
                    ব্যবহারকারীর তথ্য ও গোপনীয়তা
                  </h2>
                  <p className="text-gray-700 leading-relaxed font-bangla text-lg">
                    গ্রাহকের ব্যক্তিগত তথ্য (ঠিকানা, ফোন নম্বর, পেমেন্ট তথ্য) শুধুমাত্র ডেলিভারি ও সেবা উন্নয়নের জন্য ব্যবহৃত হবে। কোনোভাবেই তৃতীয় পক্ষের সাথে শেয়ার করা হবে না।
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Changes */}
            <div className="bg-white border-l-4 border-gray-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <FileText className="h-8 w-8 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 font-bangla">
                    নীতিমালা পরিবর্তন
                  </h2>
                  <p className="text-gray-700 leading-relaxed font-bangla text-lg">
                    প্রোকৃষি যে কোনো সময় নীতিমালা পরিবর্তনের অধিকার রাখে। পরিবর্তিত নীতি ওয়েবসাইটে প্রকাশের পর থেকেই কার্যকর হবে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-bangla">
            প্রশ্ন বা সহায়তা প্রয়োজন?
          </h2>
          <p className="text-gray-600 mb-6 font-bangla text-lg">
            আমাদের সাথে যোগাযোগ করুন
          </p>
          <a
            href="/contact"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors font-bangla"
          >
            যোগাযোগ করুন
          </a>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;

