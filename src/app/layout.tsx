import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Support Utkarsh | Buy Me a Coffee",
  description: "Support Utkarsh Mudgal by buying a coffee. Your support fuels my creativity and open-source projects.",
};

import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative selection:bg-[#FFDD00] selection:text-[#222222]">
        <InteractiveBackground />
        {children}
      </body>
    </html>
  );
}
