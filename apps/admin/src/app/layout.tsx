import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "ImanTour Admin",
  description: "ImanTour boshqaruv paneli",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className={`${inter.className} antialiased bg-gray-50`}>{children}</body>
    </html>
  );
}
