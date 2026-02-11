import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClerkClientProvider from "../components/ClerkClientProvider";
import Navbar from "../components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FraudGuard AI - Stop Transaction Fraud in Real Time",
  description: "Real-time AI-powered fraud detection with sub-second decisions. Enterprise-grade security for FinTech platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <ClerkClientProvider>
          <Navbar />
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  );
}
