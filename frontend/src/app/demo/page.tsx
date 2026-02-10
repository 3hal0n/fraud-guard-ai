"use client";

import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DemoPage() {
  const [transactionData, setTransactionData] = useState({
    amount: "2,499.00",
    merchant: "ElectronicsHub",
    location: "Singapore",
    device: "Mobile App",
  });

  const [result, setResult] = useState<{
    score: number;
    status: "safe" | "risk";
    message: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const score = Math.random() > 0.3 ? 95 : 32;
      setResult({
        score,
        status: score > 60 ? "safe" : "risk",
        message:
          score > 60
            ? "Transaction appears legitimate based on user behavior patterns"
            : "High-risk transaction detected - unusual spending pattern",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Live Demo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            See FraudGuard AI <span className="text-gradient-teal">In Action</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Try our fraud detection engine with sample transaction data. See how AI analyzes and
            scores transactions in real-time.
          </p>
        </div>

        {/* Demo Card */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Sample Transaction</h2>

          <div className="grid gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Transaction Amount
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">${transactionData.amount}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Merchant
                </label>
                <div className="px-4 py-2 bg-accent rounded-lg text-foreground">
                  {transactionData.merchant}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Location
                </label>
                <div className="px-4 py-2 bg-accent rounded-lg text-foreground">
                  {transactionData.location}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Device
                </label>
                <div className="px-4 py-2 bg-accent rounded-lg text-foreground">
                  {transactionData.device}
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              "Analyzing..."
            ) : (
              <>
                Analyze Transaction
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="glass-card p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Analysis Result</h2>
              <div
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  result.status === "safe"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-destructive/20 text-destructive border border-destructive/30"
                }`}
              >
                {result.status === "safe" ? "Safe" : "High Risk"}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Fraud Score</span>
                <span className="text-2xl font-bold">{result.score}%</span>
              </div>
              <div className="h-3 bg-accent rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    result.status === "safe" ? "bg-primary" : "bg-destructive"
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            <p className="text-muted-foreground">{result.message}</p>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Ready to protect your business?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Start your free trial
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
