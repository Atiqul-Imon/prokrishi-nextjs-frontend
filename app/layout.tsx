import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import SWRProvider from "./providers/SWRProvider";
import ChatWidget from "../components/ChatWidget";
import chatConfig from "../config/chat";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentContainer from "@/components/ContentContainer";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Prokrishi - Your Trusted Agricultural Marketplace",
  description: "Buy and sell agricultural products, seeds, fertilizers, and farming equipment in Bangladesh.",
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/logo/prokrishihublogo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo/prokrishihublogo.png" />
        
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
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-100`}>
        <SWRProvider>
          <AuthProvider>
            <CartProvider>
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
              <ChatWidget />
              <Toaster
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#4ade80",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
            </CartProvider>
          </AuthProvider>
        </SWRProvider>
      </body>
    </html>
  );
}

