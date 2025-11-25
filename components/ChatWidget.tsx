"use client";

import React, { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";
import chatConfig from "../config/chat";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(chatConfig.whatsapp.defaultMessage);
    const sanitizedNumber = chatConfig.whatsapp.number.replace(/[^\d]/g, "");
    const whatsappUrl = `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const expandChat = () => {
    setIsExpanded(true);
  };

  return (
    <>
      {/* Main Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 flex justify-end pointer-events-none md:sticky md:top-[calc(100vh-7rem)] md:right-6 md:pr-6">
        <button
          onClick={toggleChat}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg pointer-events-auto"
          aria-label="Chat with us"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden pointer-events-auto md:sticky md:top-[calc(100vh-20rem)] md:right-6 md:ml-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Chat with us</h3>
                <p className="text-green-100 text-sm">We're here to help!</p>
              </div>
              <button
                onClick={toggleChat}
                className="text-white hover:text-green-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Options */}
          <div className="p-4">
            {!isExpanded ? (
              <div className="space-y-3">
                <p className="text-gray-600 text-sm mb-4">
                  Choose your preferred way to chat with us:
                </p>
                
                {/* WhatsApp Option */}
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg p-3 flex items-center justify-center space-x-3 transition-colors duration-200"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Chat on WhatsApp</span>
                </button>

                {/* Expand for more options */}
                <button
                  onClick={expandChat}
                  className="w-full text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  More contact options
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm underline mb-4"
                >
                  ← Back to chat options
                </button>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📞 Phone: {chatConfig.contact.phone}</p>
                      <p>📧 Email: {chatConfig.contact.email}</p>
                      <p>🕒 Hours: {chatConfig.contact.businessHours}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={handleWhatsAppClick}
                        className="w-full bg-green-500 hover:bg-green-600 text-white rounded px-3 py-2 text-sm transition-colors"
                      >
                        WhatsApp Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget; 