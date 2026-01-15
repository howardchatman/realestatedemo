export const revalidate = 0;

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatman Real Estate | AI-Powered Solutions for Real Estate Professionals",
  description: "Transform your real estate business with Chatman Inc's AI solutions. AI Receptionist, Web Chat, Lead Generation, Scheduling, and more. Never miss a lead again.",
  keywords: "real estate AI, AI receptionist, lead generation, real estate chatbot, AIVA, Chatman Inc",
  openGraph: {
    title: "Chatman Real Estate | AI-Powered Solutions",
    description: "Transform your real estate business with cutting-edge AI technology",
    url: "https://realestatedemo.chatmaninc.com",
    siteName: "Chatman Real Estate",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
