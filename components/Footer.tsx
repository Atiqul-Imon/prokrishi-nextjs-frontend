import React from "react";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-green-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 lg:max-w-[50vw]">
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Prokrishi</h3>
          <p className="text-sm text-gray-200">
            Pure & organic food directly from local farmers. Eat clean, live
            healthy.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Useful Links</h4>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/shop" className="hover:underline">
                Shop
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm text-gray-200">
            <li className="flex items-center">
              <Phone size={16} className="mr-2" /> +880 123 456 789
            </li>
            <li className="flex items-center">
              <Mail size={16} className="mr-2" /> support@prokrishi.com
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook className="hover:text-gray-300" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="hover:text-gray-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center text-sm text-gray-300 mt-10 border-t border-green-800 pt-4">
        © {new Date().getFullYear()} Prokrishi. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
