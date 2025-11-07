"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Submitting...");
    // Here you would typically send the form data to your backend API
    console.log("Form data submitted:", formData);
    setTimeout(() => {
      setStatus("Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Contact Information */}
        <div className="space-y-8">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <MapPin className="h-6 w-6" />
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">📍 আমাদের ঠিকানা</h3>
                    <p className="mt-1 text-gray-600 bangla-text">প্রোকৃষি হাব</p>
                    <p className="mt-1 text-gray-600 bangla-text">২৬১/এফ/১, পূর্ব নাখালপাড়া</p>
                    <p className="mt-1 text-gray-600 bangla-text">তেজগাঁও, ঢাকা ১২১৫</p>
                </div>
            </div>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <Phone className="h-6 w-6" />
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">☎ ফোন</h3>
                    <p className="mt-1 text-gray-600">
                        <a href="tel:+8801748027775" className="text-primary hover:underline font-medium">
                            📞 +880 1748027775
                        </a>
                    </p>
                </div>
            </div>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <Mail className="h-6 w-6" />
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">✉ ই-মেইল</h3>
                    <p className="mt-1 text-gray-600">
                        <a href="mailto:prokrishi2025@gmail.com" className="text-primary hover:underline font-medium">
                            📧 prokrishi2025@gmail.com
                        </a>
                    </p>
                </div>
            </div>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <Clock className="h-6 w-6" />
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">🕒 সাপোর্ট সময়</h3>
                    <p className="mt-1 text-gray-600 bangla-text">সকাল ৯টা – রাত ৯টা</p>
                </div>
            </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea name="message" id="message" rows={4} required value={formData.message} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                </div>
                <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Send Message
                    </button>
                </div>
                {status && <p className="text-center text-sm text-gray-600">{status}</p>}
            </form>
        </div>
    </div>
  );
} 