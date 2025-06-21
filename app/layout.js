import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "./context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Prokrishi",
  description: "Pure & Organic Food for You",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
  className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
>
  <AuthProvider>
    <CartProvider>
  <Navbar />
  <main className="flex-grow">{children}</main>
  <Footer />
  </CartProvider>
  </AuthProvider>
</body>
    </html>
  );
}
