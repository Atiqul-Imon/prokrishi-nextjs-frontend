# Chat System Setup Guide

## Overview
This chat system provides both WhatsApp and Facebook Messenger integration for your e-commerce website. Customers can choose their preferred platform to contact you.

## Features
- ✅ WhatsApp Business integration
- ✅ Facebook Messenger integration  
- ✅ Professional floating chat widget
- ✅ Mobile-responsive design
- ✅ Easy configuration
- ✅ Contact information display

## Setup Instructions

### 1. Configure Contact Information

Edit the file `config/chat.js` and update the following information:

```javascript
export const chatConfig = {
  // WhatsApp Configuration
  whatsapp: {
    number: "+8801234567890", // Replace with your actual WhatsApp business number
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
    phone: "+880 1234-567890", // Replace with your actual phone number
    email: "support@prokrishi.com", // Replace with your actual email
    businessHours: "9:00 AM - 8:00 PM (BDT)",
    timezone: "Asia/Dhaka",
  },
};
```

### 2. WhatsApp Setup

1. **Get your WhatsApp Business number:**
   - Use your existing WhatsApp number or get a dedicated business number
   - Format: `+8801234567890` (include country code)

2. **Test the integration:**
   - Click the WhatsApp button on your website
   - It should open WhatsApp with a pre-filled message

### 3. Facebook Messenger Setup

1. **Create a Facebook App (Optional but recommended):**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Get your App ID
   - Add Messenger product to your app

2. **Get your Facebook Page ID:**
   - Go to your Facebook business page
   - The page ID is in the URL or page settings

3. **Alternative (Simpler approach):**
   - If you don't want to create a Facebook app, just update the `pageId`
   - The chat will redirect to your Facebook page

### 4. Customization Options

You can customize the chat widget behavior in `config/chat.js`:

```javascript
widget: {
  position: "bottom-right", // Change position: bottom-right, bottom-left, top-right, top-left
  showOnMobile: true, // Set to false to hide on mobile
  autoOpen: false, // Set to true for automatic opening
  delay: 5000, // Delay before auto-opening (in milliseconds)
}
```

## How It Works

### For Customers:
1. **WhatsApp:** Click the green WhatsApp button → Opens WhatsApp with pre-filled message
2. **Messenger:** Click the blue Messenger button → Opens Facebook Messenger or redirects to your page
3. **More Options:** Click "More contact options" to see phone, email, and business hours

### For You:
1. **WhatsApp:** Messages come to your WhatsApp Business app
2. **Messenger:** Messages come to your Facebook Page inbox
3. **Phone/Email:** Customers can call or email directly

## Benefits for Bangladesh Market

- **Familiar Platforms:** Customers use WhatsApp and Facebook daily
- **Low Barrier:** No need to learn new chat interfaces
- **Trust Building:** Direct communication builds customer confidence
- **Mobile-First:** Perfect for mobile-heavy Bangladesh market
- **Cost Effective:** No monthly fees for basic integration

## Testing

1. Test on both desktop and mobile devices
2. Verify WhatsApp opens with correct number and message
3. Check Facebook Messenger integration
4. Test all contact information displays correctly

## Support

If you need help setting up:
1. Check that all phone numbers include country code (+880)
2. Verify Facebook page ID is correct
3. Test WhatsApp number by sending a message manually first
4. Ensure business hours are accurate for your timezone

## Security Notes

- Never share your Facebook App Secret publicly
- Use environment variables for sensitive data in production
- Regularly update contact information
- Monitor chat interactions for quality assurance 