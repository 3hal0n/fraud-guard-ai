"use client";

import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, AlertTriangle, Shield } from "lucide-react";

export default function AnalyzePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    riskScore: number;
    status: "safe" | "high-risk";
  } | null>(null);

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    location: "",
    userId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock result
    const mockRiskScore = Math.random() * 100;
    setResult({
      riskScore: Math.round(mockRiskScore),
      status: mockRiskScore > 70 ? "high-risk" : "safe",
    });

    setIsLoading(false);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transaction Analyzer</h1>
          <p className="text-muted-foreground">
            Run real-time fraud detection on any transaction
          </p>
        </div>

        {/* Input form */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6">Run New Analysis</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-2">
                  Transaction Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Merchant Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select category</option>
                  <option value="retail">Retail</option>
                  <option value="finance">Financial Services</option>
                  <option value="travel">Travel & Hospitality</option>
                  <option value="digital">Digital Goods</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2">
                  Location / IP Address
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="192.168.1.1"
                  required
                />
              </div>

              <div>
                <label htmlFor="userId" className="block text-sm font-medium mb-2">
                  User ID
                </label>
                <input
                  id="userId"
                  type="text"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="user_12345"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Transaction...
                </>
              ) : (
                "Scan Transaction"
              )}
            </Button>
          </form>
        </div>

        {/* Results panel */}
        {result && (
          <div className="glass-card p-8 animate-fade-up">
            <h2 className="text-xl font-semibold mb-6">Analysis Results</h2>

            {/* Risk score visualization */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-48 h-48 mb-4">
                {/* Circular gauge background */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke={result.status === "high-risk" ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                    strokeWidth="12"
                    strokeDasharray={`${(result.riskScore / 100) * 502.4} 502.4`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">{result.riskScore}%</span>
                  <span className="text-sm text-muted-foreground">Risk Score</span>
                </div>
              </div>

              {/* Status badge */}
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
                  result.status === "high-risk"
                    ? "bg-destructive/15 text-destructive border border-destructive/30"
                    : "bg-primary/15 text-primary border border-primary/30"
                }`}
              >
                {result.status === "high-risk" ? (
                  <>
                    <AlertTriangle className="w-5 h-5" />
                    HIGH RISK DETECTED
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    SAFE
                  </>
                )}
              </div>
            </div>

            {/* Additional details */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
                ANALYSIS DETAILS
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Model Confidence</p>
                  <p className="font-semibold">98.7%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Processing Time</p>
                  <p className="font-semibold">87ms</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Recommendation</p>
                  <p className="font-semibold">
                    {result.status === "high-risk" ? "Block Transaction" : "Approve Transaction"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
                  <p className="font-semibold">{new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
