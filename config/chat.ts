// Chat Configuration
// Update these values with your actual contact information

export const chatConfig = {
  // WhatsApp Configuration
  whatsapp: {
    number: "+8801748027775",
    defaultMessage: "Hello! I have a question about your products.",
    businessHours: "9:00 AM - 8:00 PM (BDT)",
  },
  
  // Facebook Configuration
  facebook: {
    pageId: "your-facebook-page-id", // Replace with your Facebook page ID
    appId: "YOUR_FACEBOOK_APP_ID", // Replace with your Facebook App ID
  },
  
  // General Contact Information
  contact: {
    phone: "+8801748027775",
    email: "prokrishi2025@gmail.com",
    businessHours: "9:00 AM - 8:00 PM (BDT)",
    timezone: "Asia/Dhaka",
  },
  
  // Chat Widget Settings
  widget: {
    position: "bottom-right", // bottom-right, bottom-left, top-right, top-left
    showOnMobile: true,
    autoOpen: false, // Set to true if you want the chat to open automatically
    delay: 5000, // Delay in milliseconds before showing auto-open (if enabled)
  }
};

export default chatConfig; 