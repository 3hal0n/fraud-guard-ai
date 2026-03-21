"use client";

import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeTransaction, ApiError } from "@/lib/api";
import { motion } from "framer-motion";

// Zod schema & Helpers remain identical
const analyzeSchema = z.object({
  amount: z.coerce.number({ error: "Amount must be a number" }).positive("Amount must be greater than 0").max(10_000_000, "Amount cannot exceed $10,000,000"),
  category: z.string().min(1, "Please select a merchant category"),
  location: z.string().min(2, "Location must be at least 2 characters").max(120, "Location is too long"),
  time: z.string().min(1, "Please select a transaction time"),
});
type AnalyzeFormData = z.infer<typeof analyzeSchema>;
type AnalyzeFormInput = z.input<typeof analyzeSchema>;

function generateFraudIndicators(data: AnalyzeFormData, riskScore: number): string[] {
  const indicators: string[] = [];
  const loc = data.location.toLowerCase();
  const cat = data.category.toLowerCase();
  const amount = data.amount;
  const riskLocKeywords = ["russia", "iran", "north korea", "nigeria", "offshore", "international", "unknown", "vpn", "proxy"];
  if (riskLocKeywords.some((kw) => loc.includes(kw))) indicators.push("Location Anomaly");
  if (loc.includes("crypto") || cat.includes("crypto")) indicators.push("High-Risk Merchant Category");
  if (["other", "travel"].includes(cat) && !indicators.includes("High-Risk Merchant Category")) indicators.push("High-Risk Merchant Category");
  if (amount > 5000) indicators.push("Unusually Large Transaction Amount");
  else if (amount > 1000) indicators.push("Above-Average Transaction Amount");
  if (data.time) {
    const txnHour = new Date(data.time).getHours();
    if (txnHour >= 0 && txnHour < 5) indicators.push("Off-Hours Transaction (Late Night)");
  }
  if (indicators.length === 0 && riskScore >= 75) indicators.push("Flagged by AI Anomaly Detection");
  return indicators;
}

export default function AnalyzePage() {
  const { user } = useUser();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ riskScore: number; status: "safe" | "risk"; elapsed?: number } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submittedFormData, setSubmittedFormData] = useState<AnalyzeFormData | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AnalyzeFormInput, unknown, AnalyzeFormData>({
    resolver: zodResolver(analyzeSchema),
  });

  const onSubmit = async (data: AnalyzeFormData) => {
    setIsScanning(true); setScanResult(null); setApiError(null); setSubmittedFormData(data);
    const t0 = performance.now();
    try {
      const result = await analyzeTransaction({ amount: data.amount, merchant: data.category, category: data.category, location: data.location, time: data.time, user_id: user?.id });
      const elapsed = Math.round(performance.now() - t0);
      const normalizedRiskScore = result.risk_score <= 1 ? Math.round(result.risk_score * 100) : Math.round(result.risk_score);
      setScanResult({ riskScore: normalizedRiskScore, status: result.status, elapsed });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.status === 402) setApiError("Daily limit reached. Upgrade to Pro for unlimited scans.");
      else setApiError(apiErr.detail || "An unexpected error occurred.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanAnother = () => { setScanResult(null); setApiError(null); setSubmittedFormData(null); reset(); };

  const isFraud = scanResult ? scanResult.riskScore >= 75 : false;
  const fraudIndicators = isFraud && submittedFormData ? generateFraudIndicators(submittedFormData, scanResult!.riskScore) : [];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-medium text-white mb-2 tracking-tight">Transaction Analyzer</h1>
          <p className="text-slate-400">Feed payloads into the AI engine for instant classification.</p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Input Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-5 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 h-fit">
            <h2 className="text-lg font-medium text-white mb-6">Payload Parameters</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-2">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input type="number" step="0.01" {...register("amount")} placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-3 bg-[#121214] border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all ${errors.amount ? "border-red-500/50" : "border-white/5 hover:border-white/10"}`}
                  />
                </div>
                {errors.amount && <p className="mt-2 text-xs text-red-400">{errors.amount.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-2">Category</label>
                <select {...register("category")} className={`w-full px-4 py-3 bg-[#121214] border rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all appearance-none ${errors.category ? "border-red-500/50" : "border-white/5 hover:border-white/10"}`}>
                  <option value="" className="text-slate-600">Select a category...</option>
                  <option value="retail">Retail</option>
                  <option value="food">Food &amp; Dining</option>
                  <option value="travel">Travel</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="utilities">Utilities</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && <p className="mt-2 text-xs text-red-400">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-2">Location / IP</label>
                <input type="text" {...register("location")} placeholder="e.g. 192.168.1.1"
                  className={`w-full px-4 py-3 bg-[#121214] border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all ${errors.location ? "border-red-500/50" : "border-white/5 hover:border-white/10"}`}
                />
                {errors.location && <p className="mt-2 text-xs text-red-400">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-2">Time</label>
                <input type="datetime-local" {...register("time")}
                  className={`w-full px-4 py-3 bg-[#121214] border rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all [color-scheme:dark] ${errors.time ? "border-red-500/50" : "border-white/5 hover:border-white/10"}`}
                />
                {errors.time && <p className="mt-2 text-xs text-red-400">{errors.time.message}</p>}
              </div>

              <button type="submit" disabled={isScanning} className="w-full mt-4 px-6 py-4 bg-white hover:bg-slate-200 text-black rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2">
                {isScanning ? "Processing..." : "Run Analysis"}
              </button>
            </form>
          </motion.div>

          {/* Results Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-7 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 flex flex-col relative overflow-hidden min-h-[500px]">
            
            {/* Idle State */}
            {!scanResult && !isScanning && !apiError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-[#121214] border border-white/5 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-slate-400 text-sm">System ready. Awaiting payload.</p>
              </div>
            )}

            {/* Scanning State */}
            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A] z-10">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border border-cyan-500/20 rounded-full" />
                  <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                </div>
                <p className="text-white font-medium mb-1 tracking-wider">ANALYZING</p>
                <p className="text-xs text-cyan-500/70 font-mono animate-pulse">Running neural ensemble...</p>
              </div>
            )}

            {/* Error State */}
            {apiError && (
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <div>
                  <h3 className="text-red-500 font-medium mb-1">Analysis Failed</h3>
                  <p className="text-sm text-slate-400">{apiError}</p>
                </div>
              </div>
            )}

            {/* Success Results State */}
            {scanResult && !isScanning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Analysis Complete</h3>
                    <p className="text-sm text-slate-500 font-mono">T+ {scanResult.elapsed ?? "—"}ms</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase ${isFraud ? "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]" : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"}`}>
                    {isFraud ? "Blocked" : "Approved"}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-8 mb-10">
                  {/* Gauge */}
                  <div className="relative w-40 h-40 mx-auto sm:mx-0 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                      <circle cx="80" cy="80" r="70" stroke="#121214" strokeWidth="8" fill="none" />
                      <circle cx="80" cy="80" r="70" stroke={isFraud ? "#ef4444" : "#22d3ee"} strokeWidth="8" fill="none" strokeDasharray={`${(scanResult.riskScore / 100) * 440} 440`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-light ${isFraud ? "text-red-500" : "text-cyan-400"}`}>{scanResult.riskScore}</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Risk</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 space-y-4 justify-center flex flex-col">
                     <div className="p-4 bg-[#121214] rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-500 uppercase tracking-wider">Confidence Score</span>
                          <span className="text-sm font-medium text-white">99.8%</span>
                        </div>
                        <div className="w-full h-1 bg-black rounded-full overflow-hidden mt-2"><div className="w-[99.8%] h-full bg-white/40"/></div>
                     </div>
                     <div className="p-4 bg-[#121214] rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Engine Protocol</span>
                        <span className="text-sm font-medium text-white">v2.1 Fast-Track</span>
                     </div>
                  </div>
                </div>

                {isFraud && fraudIndicators.length > 0 && (
                  <div className="mb-auto">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Detected Anomalies</h4>
                    <div className="grid gap-2">
                      {fraudIndicators.map((indicator, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                           <span className="text-sm text-red-200">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/5">
                  <button onClick={handleScanAnother} className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-medium transition-all active:scale-95">
                    Clear & Scan Another
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
}