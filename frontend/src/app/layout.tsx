import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClerkClientProvider from "../components/ClerkClientProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FraudGuard AI - Stop Transaction Fraud in Real Time",
  description:
    "Real-time AI-powered fraud detection with sub-second decisions. Enterprise-grade security for FinTech platforms.",
  keywords: [
    "fraud detection",
    "fraud",
    "fintech",
    "transaction scoring",
    "xgboost",
    "explainable AI",
    "SHAP",
    "fastapi",
    "nextjs",
  ],
  authors: [{ name: "Shalon Fernando", url: "https://shalon.web.lk" }],
  openGraph: {
    title: "FraudGuard AI - Stop Transaction Fraud in Real Time",
    description:
      "Real-time AI-powered fraud detection with sub-second decisions. Enterprise-grade security for FinTech platforms.",
    url: "https://fraud-guard-ai-five.vercel.app",
    siteName: "FraudGuard AI",
    images: ["/snippets/dashboard.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FraudGuard AI - Stop Transaction Fraud in Real Time",
    description:
      "Real-time AI-powered fraud detection with sub-second decisions. Enterprise-grade security for FinTech platforms.",
    images: ["/snippets/dashboard.png"],
  },
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#000000" }],
  metadataBase: new URL("https://fraud-guard-ai-five.vercel.app"),
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {/* Structured data for SEO: Organization & SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "FraudGuard AI",
              url: "https://fraud-guard-ai-five.vercel.app",
              author: { "@type": "Person", name: "Shalon Fernando", url: "https://shalon.web.lk" },
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description:
                "Real-time AI-powered transaction fraud detection with explainability (SHAP) and an enterprise dashboard.",
              image: "https://fraud-guard-ai-five.vercel.app/snippets/dashboard.png",
            }),
          }}
        />
        <ClerkClientProvider>
          <Navbar />
          {children}
          <Footer />
        </ClerkClientProvider>
      </body>
    </html>
  );
}
