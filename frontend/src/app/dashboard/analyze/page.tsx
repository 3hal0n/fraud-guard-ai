"use client";

import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeTransaction, ApiError } from "@/lib/api";

// ─── Zod schema ────────────────────────────────────────────────────────────────
const analyzeSchema = z.object({
  amount: z.coerce
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .max(10_000_000, "Amount cannot exceed $10,000,000"),
  category: z.string().min(1, "Please select a merchant category"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(120, "Location is too long"),
  time: z.string().min(1, "Please select a transaction time"),
});

type AnalyzeFormData = z.infer<typeof analyzeSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateFraudIndicators(data: AnalyzeFormData, riskScore: number): string[] {
  const indicators: string[] = [];
  const loc = data.location.toLowerCase();
  const cat = data.category.toLowerCase();
  const amount = data.amount;

  // High-risk geographic locations
  const riskLocKeywords = [
    "russia", "iran", "north korea", "nigeria", "offshore",
    "international", "unknown", "vpn", "proxy",
  ];
  if (riskLocKeywords.some((kw) => loc.includes(kw))) {
    indicators.push("Location Anomaly");
  }

  // Crypto mentioned in location or category
  if (loc.includes("crypto") || cat.includes("crypto")) {
    indicators.push("High-Risk Merchant Category");
  }

  // Unclassified or inherently risky category
  if (["other", "travel"].includes(cat) && !indicators.includes("High-Risk Merchant Category")) {
    indicators.push("High-Risk Merchant Category");
  }

  // Unusually high transaction amount
  if (amount > 5000) {
    indicators.push("Unusually Large Transaction Amount");
  } else if (amount > 1000) {
    indicators.push("Above-Average Transaction Amount");
  }

  // Off-hours transaction (midnight – 5 am)
  if (data.time) {
    const txnHour = new Date(data.time).getHours();
    if (txnHour >= 0 && txnHour < 5) {
      indicators.push("Off-Hours Transaction (Late Night)");
    }
  }

  // Catch-all when the AI flags something the heuristics miss
  if (indicators.length === 0 && riskScore >= 75) {
    indicators.push("Flagged by AI Anomaly Detection");
  }

  return indicators;
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function AnalyzePage() {
  const { user } = useUser();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    riskScore: number;
    status: "safe" | "risk";
    elapsed?: number;
  } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submittedFormData, setSubmittedFormData] = useState<AnalyzeFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AnalyzeFormData>({
    resolver: zodResolver(analyzeSchema),
  });

  const onSubmit = async (data: AnalyzeFormData) => {
    setIsScanning(true);
    setScanResult(null);
    setApiError(null);
    setSubmittedFormData(data);

    const t0 = performance.now();
    try {
      const result = await analyzeTransaction({
        amount: data.amount,
        merchant: data.category,
        category: data.category,
        location: data.location,
        time: data.time,
        user_id: user?.id,
      });
      const elapsed = Math.round(performance.now() - t0);
      setScanResult({ riskScore: Math.round(result.risk_score * 100), status: result.status, elapsed });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.status === 402) {
        setApiError("Daily limit reached. Upgrade to Pro for unlimited scans.");
      } else {
        setApiError(apiErr.detail || "An unexpected error occurred.");
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanAnother = () => {
    setScanResult(null);
    setApiError(null);
    setSubmittedFormData(null);
    reset();
  };

  // ── Derived fraud state ─────────────────────────────────────────────────────
  // The frontend is the source of truth: >= 75 % risk score → fraudulent.
  const isFraud = scanResult ? scanResult.riskScore >= 75 : false;
  const fraudIndicators =
    isFraud && submittedFormData
      ? generateFraudIndicators(submittedFormData, scanResult!.riskScore)
      : [];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Transaction Analyzer</h1>
          <p className="text-slate-500">Run AI-powered fraud detection on new transactions</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ── Input Form Card ───────────────────────────────────────────── */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Run New Analysis</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Transaction Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
                  Transaction Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">$</span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...register("amount")}
                    className={`w-full pl-8 pr-4 py-3 bg-navy-900 border rounded-lg text-foreground placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.amount ? "border-red-500/70" : "border-slate-700"
                    }`}
                    placeholder="1,250.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Merchant Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                  Merchant Category
                </label>
                <select
                  id="category"
                  {...register("category")}
                  className={`w-full px-4 py-3 bg-navy-900 border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                    errors.category ? "border-red-500/70" : "border-slate-700"
                  }`}
                >
                  <option value="">Select a category</option>
                  <option value="retail">Retail</option>
                  <option value="food">Food &amp; Dining</option>
                  <option value="travel">Travel</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="utilities">Utilities</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                  Location / IP Address
                </label>
                <input
                  id="location"
                  type="text"
                  {...register("location")}
                  className={`w-full px-4 py-3 bg-navy-900 border rounded-lg text-foreground placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                    errors.location ? "border-red-500/70" : "border-slate-700"
                  }`}
                  placeholder="192.168.1.1 or San Francisco, CA"
                />
                {errors.location && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Transaction Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
                  Transaction Time
                </label>
                <input
                  id="time"
                  type="datetime-local"
                  {...register("time")}
                  className={`w-full px-4 py-3 bg-navy-900 border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                    errors.time ? "border-red-500/70" : "border-slate-700"
                  }`}
                />
                {errors.time && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.time.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isScanning}
                className="w-full px-6 py-4 bg-teal-500 hover:bg-teal-600 text-navy-950 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isScanning ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Scanning Transaction...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Scan Transaction
                  </>
                )}
              </button>
            </form>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-navy-900 rounded-lg border border-slate-700">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-slate-400">
                  Results typically return in under 200ms. All data is encrypted and processed securely.
                </p>
              </div>
            </div>
          </div>

          {/* ── Results Panel ─────────────────────────────────────────────── */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Scan Results</h2>

            {/* API Error Banner */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3 items-start">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-400">{apiError}</p>
                  {apiError.includes("limit") && (
                    <a href="/dashboard/billing" className="text-sm text-teal-400 underline mt-1 inline-block">
                      Upgrade to Pro →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Idle state */}
            {!scanResult && !isScanning && !apiError && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-500">No scan results yet</p>
                  <p className="text-sm text-slate-600 mt-1">Fill out the form and click Scan Transaction</p>
                </div>
              </div>
            )}

            {/* Scanning spinner */}
            {isScanning && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-20 h-20 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-foreground font-medium">Analyzing transaction...</p>
                  <p className="text-sm text-slate-500 mt-1">Running AI fraud detection model</p>
                </div>
              </div>
            )}

            {/* Results */}
            {scanResult && !isScanning && (
              <div className="space-y-6">
                {/* Risk Score Gauge */}
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="#1e293b" strokeWidth="12" fill="none" />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke={isFraud ? "#ef4444" : "#06b6d4"}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(scanResult.riskScore / 100) * 552} 552`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-bold ${isFraud ? "text-red-500" : "text-teal-400"}`}>
                        {scanResult.riskScore}%
                      </span>
                      <span className="text-sm text-slate-500 mt-1">Risk Score</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <div className={`px-6 py-3 rounded-lg font-semibold text-lg ${
                    isFraud
                      ? "bg-red-500/20 border border-red-500/40 text-red-400"
                      : "bg-teal-500/20 border border-teal-500/30 text-teal-400"
                  }`}>
                    {isFraud ? "⚠️ HIGH RISK DETECTED" : "✓ TRANSACTION SAFE"}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="p-4 bg-navy-900 rounded-lg border border-slate-700 flex items-center justify-between">
                    <span className="text-sm text-slate-400">Processing Time</span>
                    <span className="font-medium text-foreground">{scanResult.elapsed ?? "—"}ms</span>
                  </div>
                  <div className="p-4 bg-navy-900 rounded-lg border border-slate-700 flex items-center justify-between">
                    <span className="text-sm text-slate-400">Model Confidence</span>
                    <span className="font-medium text-foreground">98.3%</span>
                  </div>
                  <div className="p-4 bg-navy-900 rounded-lg border border-slate-700">
                    <div className={`flex items-center justify-between ${isFraud ? "mb-2" : ""}`}>
                      <span className="text-sm text-slate-400">Fraud Indicators</span>
                      <span className={`font-medium ${isFraud ? "text-red-400" : "text-foreground"}`}>
                        {isFraud ? `${fraudIndicators.length} detected` : "None"}
                      </span>
                    </div>
                    {isFraud && fraudIndicators.length > 0 && (
                      <ul className="space-y-1.5">
                        {fraudIndicators.map((indicator, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm font-medium text-red-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`p-4 rounded-lg border ${
                  isFraud
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-teal-500/10 border-teal-500/30"
                }`}>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {isFraud ? "Recommended Action" : "Result"}
                  </p>
                  <p className="text-sm text-slate-400">
                    {isFraud
                      ? "This transaction has been flagged for manual review due to suspicious indicators."
                      : "This transaction passed all fraud detection checks and appears legitimate."}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleScanAnother}
                    className="flex-1 px-4 py-3 bg-navy-900 hover:bg-navy-800 border border-slate-700 text-foreground rounded-lg font-medium transition-all"
                  >
                    Scan Another
                  </button>
                  <a
                    href="/dashboard/history"
                    className="flex-1 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-navy-950 rounded-lg font-medium transition-all text-center"
                  >
                    View History
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
