"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import AppLayout from "@/components/AppLayout";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeTransaction, ApiError, getRulesEngineSettings, getUserInfo, updateRulesEngineSettings } from "@/lib/api";
import type { RiskFactor } from "@/lib/api";
import type { RulesEngineSettings, UserInfo } from "@/lib/api";
import { motion } from "framer-motion";
import ScanResults from "@/components/ScanResults";

// Zod schema & Helpers remain identical
const analyzeSchema = z.object({
  amount: z.coerce.number({ error: "Amount must be a number" }).positive("Amount must be greater than 0").max(10_000_000, "Amount cannot exceed $10,000,000"),
  category: z.string().min(1, "Please select a merchant category"),
  location: z.string().min(2, "Location must be at least 2 characters").max(120, "Location is too long"),
  time: z.string().min(1, "Please select a transaction time"),
});
type AnalyzeFormData = z.infer<typeof analyzeSchema>;
type AnalyzeFormInput = z.input<typeof analyzeSchema>;

const GENERAL_RULES: RulesEngineSettings = {
  profile: "GENERAL",
  review_threshold: 30,
  block_threshold: 70,
  block_on_location_mismatch: false,
  location_mismatch_min_score: 85,
};

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
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  let user: { id?: string } | null = null;
  if (clerkEnabled) {
    const u = useUser();
    user = u?.user ?? null;
  }
  const [isScanning, setIsScanning] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [rules, setRules] = useState<RulesEngineSettings>(GENERAL_RULES);
  const [rulesSaving, setRulesSaving] = useState(false);
  const [rulesNotice, setRulesNotice] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{ riskScore: number; status: "APPROVED" | "PENDING_REVIEW" | "BLOCK_TRANSACTION"; elapsed?: number; riskFactors: RiskFactor[] } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submittedFormData, setSubmittedFormData] = useState<AnalyzeFormData | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AnalyzeFormInput, unknown, AnalyzeFormData>({
    resolver: zodResolver(analyzeSchema),
  });

  const allowProForTesting = process.env.NEXT_PUBLIC_ALLOW_PRO_TEST === "1";
  const isPro = userInfo?.plan === "PRO" || allowProForTesting;

  useEffect(() => {
    if (!user?.id) return;
    getUserInfo(user.id).then(setUserInfo).catch(() => null);
    getRulesEngineSettings(user.id)
      .then(setRules)
      .catch(() => setRules(GENERAL_RULES));
  }, [user?.id]);

  const onSubmit = async (data: AnalyzeFormData) => {
    setIsScanning(true); setScanResult(null); setApiError(null); setSubmittedFormData(data);
    const t0 = performance.now();
    try {
      const result = await analyzeTransaction({ amount: data.amount, merchant: data.category, category: data.category, location: data.location, time: data.time, user_id: user?.id });
      const elapsed = Math.round(performance.now() - t0);
      const normalizedRiskScore = result.risk_score <= 1 ? Math.round(result.risk_score * 100) : Math.round(result.risk_score);
      setScanResult({ riskScore: normalizedRiskScore, status: result.status, elapsed, riskFactors: result.risk_factors ?? [] });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.status === 402) setApiError("Daily limit reached. Upgrade to Pro for unlimited scans.");
      else setApiError(apiErr.detail || "An unexpected error occurred.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanAnother = () => { setScanResult(null); setApiError(null); setSubmittedFormData(null); reset(); };

  const saveRules = async () => {
    if (!user?.id) {
      setRulesNotice("Sign in to save rules settings.");
      return;
    }
    if (!isPro) {
      setRulesNotice("Rules customization is available on the PRO plan.");
      return;
    }

    const payload = rules.profile === "GENERAL"
      ? { ...GENERAL_RULES }
      : { ...rules };

    if (payload.review_threshold >= payload.block_threshold) {
      setRulesNotice("Review threshold must be lower than block threshold.");
      return;
    }

    setRulesSaving(true);
    setRulesNotice(null);
    try {
      const saved = await updateRulesEngineSettings(user.id, payload);
      setRules(saved);
      setRulesNotice("Rules saved.");
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setRulesNotice(apiErr.detail || "Failed to save rules.");
    } finally {
      setRulesSaving(false);
    }
  };

  const isBlocked = scanResult ? scanResult.status === "BLOCK_TRANSACTION" : false;
  const fraudIndicators = isBlocked && submittedFormData ? generateFraudIndicators(submittedFormData, scanResult!.riskScore) : [];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-medium text-white mb-2 tracking-tight">Transaction Analyzer</h1>
          <p className="text-slate-400">Feed payloads into the AI engine for instant classification.</p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Input Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-5 bg-[#0A0A0A] border border-white/5 rounded-4xl p-8 h-fit">
            <h2 className="text-lg font-medium text-white mb-6">Payload Parameters</h2>

            <details className="mb-6 rounded-2xl border border-white/10 bg-[#111113]" >
              <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium text-white">Rules Engine</h3>
                  <span className={`text-[11px] px-2 py-1 rounded-full border ${isPro ? "text-cyan-300 border-cyan-500/30 bg-cyan-500/10" : "text-slate-400 border-white/10"}`}>
                    {isPro ? "PRO" : "General only"}
                  </span>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-2">Profile</label>
                  <select
                    value={rules.profile}
                    onChange={(e) => {
                      const profile = e.target.value as "GENERAL" | "CUSTOM";
                      setRules(profile === "GENERAL" ? { ...GENERAL_RULES } : { ...rules, profile: "CUSTOM" });
                    }}
                    disabled={!isPro}
                    className="w-full px-3 py-2.5 bg-[#121214] border border-white/10 rounded-xl text-white text-sm disabled:opacity-60"
                  >
                    <option value="GENERAL">General (default)</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Review threshold</label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={rules.review_threshold}
                      disabled={!isPro || rules.profile === "GENERAL"}
                      onChange={(e) => setRules((prev) => ({ ...prev, review_threshold: Number(e.target.value || 0) }))}
                      className="w-full px-3 py-2.5 bg-[#121214] border border-white/10 rounded-xl text-white text-sm disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Block threshold</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={rules.block_threshold}
                      disabled={!isPro || rules.profile === "GENERAL"}
                      onChange={(e) => setRules((prev) => ({ ...prev, block_threshold: Number(e.target.value || 0) }))}
                      className="w-full px-3 py-2.5 bg-[#121214] border border-white/10 rounded-xl text-white text-sm disabled:opacity-60"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={rules.block_on_location_mismatch}
                    disabled={!isPro || rules.profile === "GENERAL"}
                    onChange={(e) => setRules((prev) => ({ ...prev, block_on_location_mismatch: e.target.checked }))}
                  />
                  Block on location mismatch signal
                </label>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Location mismatch min score</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={rules.location_mismatch_min_score}
                    disabled={!isPro || rules.profile === "GENERAL" || !rules.block_on_location_mismatch}
                    onChange={(e) => setRules((prev) => ({ ...prev, location_mismatch_min_score: Number(e.target.value || 0) }))}
                    className="w-full px-3 py-2.5 bg-[#121214] border border-white/10 rounded-xl text-white text-sm disabled:opacity-60"
                  />
                </div>

                <button
                  type="button"
                  onClick={saveRules}
                  disabled={!isPro || rulesSaving}
                  className="w-full px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white text-sm font-medium"
                >
                  {rulesSaving ? "Saving..." : "Save Rules"}
                </button>
                {rulesNotice && <p className="text-xs text-slate-400">{rulesNotice}</p>}
              </div>
            </details>

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
                  className={`w-full px-4 py-3 bg-[#121214] border rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all scheme-dark ${errors.time ? "border-red-500/50" : "border-white/5 hover:border-white/10"}`}
                />
                {errors.time && <p className="mt-2 text-xs text-red-400">{errors.time.message}</p>}
              </div>

              <button type="submit" disabled={isScanning} className="w-full mt-4 px-6 py-4 bg-white hover:bg-slate-200 text-black rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2">
                {isScanning ? "Processing..." : "Run Analysis"}
              </button>
            </form>
          </motion.div>

          {/* Results Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-7 bg-[#0A0A0A] border border-white/5 rounded-4xl p-8 flex flex-col relative overflow-hidden min-h-125">
            
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
                <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <div>
                  <h3 className="text-red-500 font-medium mb-1">Analysis Failed</h3>
                  <p className="text-sm text-slate-400">{apiError}</p>
                </div>
              </div>
            )}

            {/* Success Results State */}
            {scanResult && !isScanning && (
                <ScanResults
                  riskScore={scanResult.riskScore}
                  elapsed={scanResult.elapsed}
                  status={scanResult.status}
                  riskFactors={scanResult.riskFactors}
                  fraudIndicators={fraudIndicators}
                  onClear={handleScanAnother}
                />
            )}
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
}