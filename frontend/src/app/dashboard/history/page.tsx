"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import AppLayout from "@/components/AppLayout";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getTransactions, TransactionRecord } from "@/lib/api";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  let user: { id?: string } | null = null;
  if (clerkEnabled) {
    const u = useUser();
    user = u?.user ?? null;
  }
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    getTransactions(user.id, 50)
      .then(setTransactions)
      .catch(() => setError("Failed to load transaction history."))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const safeCount = transactions.filter((t) => t.status === "safe").length;
  const riskCount = transactions.filter((t) => t.status === "risk").length;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2 tracking-tight">Ledger</h1>
            <p className="text-slate-400">Review all your past fraud detection scans.</p>
          </div>
          <button className="px-5 py-2.5 bg-[#0A0A0A] hover:bg-[#121214] border border-white/10 text-white rounded-xl font-medium transition-all flex items-center gap-2 text-sm w-fit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filter View
          </button>
        </motion.div>

        {/* Stats Strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[1.5rem] p-5">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total Scans</p>
            <p className="text-3xl font-light text-white">{loading ? "–" : transactions.length}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[1.5rem] p-5">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Safe</p>
            <p className="text-3xl font-light text-cyan-400">{loading ? "–" : safeCount}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[1.5rem] p-5 relative overflow-hidden">
             <div className="absolute inset-0 bg-red-500/5" />
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 relative z-10">High Risk</p>
            <p className="text-3xl font-light text-red-500 relative z-10">{loading ? "–" : riskCount}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[1.5rem] p-5">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Risk Rate</p>
            <p className="text-3xl font-light text-white">
              {loading || transactions.length === 0 ? "–" : `${Math.round((riskCount / transactions.length) * 100)}%`}
            </p>
          </div>
        </motion.div>

        {/* Transaction Ledger */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#121214] border-b border-white/5">
                  <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-widest">Transaction ID</th>
                  <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-widest">Risk Score</th>
                  <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">Loading ledger...</td></tr>
                ) : error ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-red-500 text-sm">{error}</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">Ledger is empty.</td></tr>
                ) : (
                  transactions.map((txn) => {
                    const riskPct = Math.round(txn.risk_score * 100);
                    return (
                      <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-slate-400 font-mono text-xs">{txn.id.substring(0,12)}...</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-medium text-sm">${Number(txn.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-1.5 bg-[#121214] rounded-full overflow-hidden">
                              <div className={`h-full ${txn.status === "risk" ? "bg-red-500" : "bg-cyan-500"}`} style={{ width: `${riskPct}%` }} />
                            </div>
                            <span className={`text-xs font-medium ${txn.status === "risk" ? "text-red-500" : "text-white"}`}>{riskPct}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${txn.status === "risk" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"}`}>
                            {txn.status === "risk" ? "Blocked" : "Safe"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-400 text-xs">{txn.timestamp ? new Date(txn.timestamp).toLocaleString() : "—"}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {!loading && !error && transactions.length > 0 && (
            <div className="border-t border-white/5 px-6 py-4 bg-[#121214]">
              <p className="text-xs text-slate-500 tracking-wider uppercase">Showing {transactions.length} entries</p>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}