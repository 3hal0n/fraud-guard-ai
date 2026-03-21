"use client";

import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import { motion } from "framer-motion";

export default function BillingPage() {
  const [currentPlan] = useState<"free" | "pro">("free");
  const usedChecks = 3;
  const maxChecks = 5;
  const usagePercentage = (usedChecks / maxChecks) * 100;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-medium text-white mb-2 tracking-tight">Billing & Plans</h1>
          <p className="text-slate-400">Manage your subscription and API usage.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Current Plan Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-lg font-medium text-white mb-1">Active Subscription</h2>
                <p className="text-sm text-slate-500">{currentPlan === "free" ? "Developer Tier" : "Pro Scale Tier"}</p>
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-md">
                <span className="text-[10px] font-bold text-white tracking-wider uppercase">Active</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-5 bg-[#121214] rounded-2xl border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Cost</p>
                <p className="text-2xl font-light text-white">${currentPlan === "free" ? "0" : "29"}<span className="text-sm text-slate-600">/mo</span></p>
              </div>
              <div className="p-5 bg-[#121214] rounded-2xl border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Limit</p>
                <p className="text-2xl font-light text-white">{currentPlan === "free" ? "5" : "∞"}<span className="text-sm text-slate-600">/day</span></p>
              </div>
              <div className="p-5 bg-[#121214] rounded-2xl border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Support</p>
                <p className="text-2xl font-light text-white">{currentPlan === "free" ? "Basic" : "Priority"}</p>
              </div>
            </div>

            {currentPlan === "free" && (
              <div className="bg-[#121214] p-5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Today&apos;s API Usage</span>
                  <span className="text-sm font-medium text-white">{usedChecks} / {maxChecks}</span>
                </div>
                <div className="relative w-full h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500" style={{ width: `${usagePercentage}%` }} />
                </div>
              </div>
            )}
          </motion.div>

          {/* Upgrade Card */}
          {currentPlan === "free" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0A0A0A] border border-cyan-500/30 rounded-[2rem] p-8 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 mb-8">
                <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
                  <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">Upgrade Recommended</span>
                </div>
                <h3 className="text-2xl font-medium text-white mb-2">Pro Scale</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-light text-cyan-400">$29</span>
                  <span className="text-slate-500">/ month</span>
                </div>
                <p className="text-sm text-slate-400">Unlock production capacity.</p>
              </div>

              <ul className="relative z-10 space-y-3 mb-8 flex-1">
                {["Unlimited API Checks", "Dashboard Analytics", "Priority Support", "Webhooks & Alerts"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {feature}
                  </li>
                ))}
              </ul>

              <button className="relative z-10 w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-95">
                Upgrade Now
              </button>
            </motion.div>
          )}
        </div>

        {/* Billing History (Dark style table replacement) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8">
          <h2 className="text-lg font-medium text-white mb-6">Billing History</h2>
          
          {currentPlan === "free" ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
              <p className="text-slate-500 text-sm">No billing history yet. Upgrade to Pro to view invoices.</p>
            </div>
          ) : (
             <div className="space-y-3">
              {[{ date: "Jan 10, 2026", amount: "$29.00", status: "Paid", id: "INV-2026-001" }, { date: "Dec 10, 2025", amount: "$29.00", status: "Paid", id: "INV-2025-012" }].map((inv, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#121214] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">{inv.id}</p>
                    <p className="text-xs text-slate-500">{inv.date}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{inv.amount}</p>
                      <p className="text-xs text-cyan-400">{inv.status}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg transition-colors border border-white/5">PDF</button>
                  </div>
                </div>
              ))}
             </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}