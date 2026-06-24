import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "ImanTour — Sayohat agentligi",
  description: "O'zbekiston va dunyo bo'ylab unutilmas sayohatlar. Tur paketlar, xalqaro turlar va ziyorat sayohatlari.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-sand-50 text-gray-800`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
