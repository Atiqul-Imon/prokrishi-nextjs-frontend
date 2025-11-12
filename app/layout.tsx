import { Marcellus, PT_Serif, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import SWRProvider from "./providers/SWRProvider";
import ChatWidget from "../components/ChatWidget";
import chatConfig from "../config/chat";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentContainer from "@/components/ContentContainer";
import MobileBottomNav from "@/components/MobileBottomNav";
import CartSidebarWrapper from "@/components/CartSidebarWrapper";
import { ReactNode } from "react";

const marcellus = Marcellus({ 
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-marcellus"
});
const ptSerif = PT_Serif({ 
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-serif"
});
const notoSansBengali = Noto_Sans_Bengali({ 
  subsets: ["bengali"],
  variable: "--font-noto-sans-bengali",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata = {
  title: "Prokrishi - Your Trusted Agricultural Marketplace",
  description: "Buy and sell agricultural products, seeds, fertilizers, and farming equipment in Bangladesh.",
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/logo/prokrishihublogo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/prokrishihublogo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo/prokrishihublogo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    other: [
      { rel: 'icon', url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { rel: 'icon', url: '/logo/prokrishihublogo.png', sizes: '32x32', type: 'image/png' },
    ],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Favicon - Multiple formats for better browser support */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16 32x32 48x48" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/logo/prokrishihublogo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/logo/prokrishihublogo.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/logo/prokrishihublogo.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/logo/prokrishihublogo.png" sizes="152x152" />
        <link rel="apple-touch-icon" href="/logo/prokrishihublogo.png" sizes="144x144" />
        <link rel="apple-touch-icon" href="/logo/prokrishihublogo.png" sizes="120x120" />
        <link rel="apple-touch-icon" href="/logo/prokrishihublogo.png" sizes="114x114" />
        <link rel="apple-touch-icon" href="/logo/prokrishihublogo.png" sizes="76x76" />
        <link rel="apple-touch-icon" href="/logo/prokrishihublogo.png" sizes="72x72" />
        <link rel="apple-touch-icon" href="/logo/prokrishihublogo.png" sizes="60x60" />
        <link rel="apple-touch-icon" href="/logo/prokrishihublogo.png" sizes="57x57" />
        
        {/* Force favicon refresh */}
        <meta name="msapplication-TileImage" content="/logo/prokrishihublogo.png" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="theme-color" content="#16a34a" />
        
        {/* Facebook SDK for Messenger integration */}
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.fbAsyncInit = function() {
                FB.init({
                  appId: '${chatConfig.facebook.appId}',
                  cookie: true,
                  xfbml: true,
                  version: 'v18.0'
                });
              };
            `,
          }}
        />
      </head>
      <body className={`${marcellus.variable} ${ptSerif.variable} ${notoSansBengali.variable} min-h-screen flex flex-col bg-gray-100`}>
        <SWRProvider>
          <AuthProvider>
            <CartProvider>
              <CartSidebarWrapper />
              <div className="w-full">
                <Navbar />
              </div>
              <main className="flex-grow flex justify-center bg-gray-100">
                <ContentContainer>
                  {children}
                </ContentContainer>
              </main>
              <div className="w-full">
                <Footer />
              </div>
              {/* Chat Widget - Hidden on mobile, shown on desktop */}
              <div className="hidden md:block">
                <ChatWidget />
              </div>
              {/* Mobile Bottom Navigation */}
              <MobileBottomNav />
            </CartProvider>
          </AuthProvider>
        </SWRProvider>
      </body>
    </html>
  );
}

