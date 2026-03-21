"use client";

import AppLayout from "@/components/AppLayout";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserInfo, getTransactions, UserInfo, TransactionRecord } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("");
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recentTxns, setRecentTxns] = useState<TransactionRecord[]>([]);
  const [loadingInfo, setLoadingInfo] = useState(true);

  const usedChecks = userInfo?.daily_usage ?? 0;
  const maxChecks = userInfo?.daily_limit ?? 5;
  const usagePercentage = maxChecks > 0 ? Math.min((usedChecks / maxChecks) * 100, 100) : 0;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    setLoadingInfo(true);
    Promise.all([
      getUserInfo(user.id),
      getTransactions(user.id, 100),
    ])
      .then(([info, txns]) => {
        setUserInfo(info);
        setRecentTxns(txns);
      })
      .catch(() => null)
      .finally(() => setLoadingInfo(false));
  }, [user?.id]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-medium text-white mb-2 tracking-tight">
            {greeting}, <span className="text-cyan-400">{user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "there"}</span>.
          </h1>
          <p className="text-sm sm:text-base text-slate-400">Monitor your fraud detection activity and insights.</p>
        </motion.div>

        {/* Top Row: Usage & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Usage Tracker Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-medium text-white mb-1">Daily Usage</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">API Limits</p>
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">
                    {loadingInfo ? "..." : userInfo?.plan === "PRO" ? "PRO" : "DEV"}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl sm:text-5xl font-light text-white">{loadingInfo ? "–" : usedChecks}</span>
                <span className="text-lg sm:text-xl text-slate-600">/ {loadingInfo ? "–" : (userInfo?.daily_limit === null ? "∞" : maxChecks)}</span>
              </div>

              {userInfo?.daily_limit !== null && (
                <div className="relative w-full h-2 bg-[#121214] rounded-full overflow-hidden mb-4">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
              <p className="text-xs text-slate-400">
                {loadingInfo ? "Loading..." : userInfo?.daily_limit === null ? "Unlimited checks" : `${Math.max(0, maxChecks - usedChecks)} remaining`}
              </p>
              {userInfo?.plan !== "PRO" && (
                <Link href="/dashboard/billing" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors bg-cyan-500/10 px-3 py-1.5 rounded-full">
                  Upgrade
                </Link>
              )}
            </div>
          </motion.div>

          {/* Activity / Trend Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div>
                <h2 className="text-base sm:text-lg font-medium text-white mb-1">Transaction Volume</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest">7-Day Trend</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-light text-white">{loadingInfo ? "–" : recentTxns.length}</p>
                <p className="text-xs text-cyan-400 font-medium">Total Scans</p>
              </div>
            </div>

            {/* Beautiful SVG Area Chart */}
            <div className="flex-1 w-full h-32 sm:h-40 mt-auto relative z-10 flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Mock Data Path - Smooth curve */}
                <path d="M0,100 L0,70 C10,60 20,80 30,50 C40,20 50,60 60,40 C70,20 80,30 90,10 L100,20 L100,100 Z" fill="url(#areaGradient)" />
                <path d="M0,70 C10,60 20,80 30,50 C40,20 50,60 60,40 C70,20 80,30 90,10 L100,20" fill="none" stroke="#22d3ee" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Middle Row: Quick Actions & Risk Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-6">
            <Link href="/dashboard/analyze" className="group bg-gradient-to-br from-cyan-900/30 to-[#0A0A0A] border border-cyan-500/20 rounded-3xl p-6 hover:border-cyan-400/50 transition-all flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
              </div>
              <div>
                <h3 className="font-medium text-white mb-0.5 text-sm sm:text-base">Scan Transaction</h3>
                <p className="text-xs text-cyan-500/70">Run an AI fraud check</p>
              </div>
            </Link>

            <Link href="/dashboard/history" className="group bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 bg-[#121214] border border-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <h3 className="font-medium text-white mb-0.5 text-sm sm:text-base">View Ledger</h3>
                <p className="text-xs text-slate-500">Access past reports</p>
              </div>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-medium text-white mb-1">Threat Analysis</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Risk Distribution</p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-500"/><span className="text-xs text-slate-400">Safe</span></div>
                <div className="flex items-center gap-1.5 ml-2"><div className="w-2 h-2 rounded-full bg-red-500"/><span className="text-xs text-slate-400">High Risk</span></div>
              </div>
            </div>

            {/* Segmented Bar Chart */}
            <div className="flex-1 flex items-end gap-1.5 sm:gap-3 w-full h-32 sm:h-40 pt-4">
              {[30, 50, 40, 85, 60, 20, 95, 65, 45, 75].map((h, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-t-sm relative group h-full flex items-end">
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-700 ${i === 3 || i === 6 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.2)] group-hover:bg-cyan-400'}`} 
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-slate-400">System is currently identifying <strong className="text-red-400">2</strong> high-risk anomalies.</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Recent Ledger */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-medium text-white">Recent Ledger</h2>
            <Link href="/dashboard/history" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">View All →</Link>
          </div>
          
          {loadingInfo ? (
            <div className="p-8 text-center text-slate-500 text-sm">Loading ledger...</div>
          ) : recentTxns.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-[#121214] rounded-full flex items-center justify-center mb-3 border border-white/5">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <p className="text-slate-400 text-sm mb-2">No transactions analyzed yet.</p>
              <Link href="/dashboard/analyze" className="text-cyan-400 text-xs font-medium bg-cyan-500/10 px-4 py-2 rounded-lg">Initiate first scan</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#121214]">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentTxns.slice(0, 5).map((activity) => (
                    <tr key={activity.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                        {activity.id.substring(0,8)}...
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap">
                        ${Number(activity.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${activity.status === "safe" ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
                           {activity.status === "safe" ? "Safe" : "Blocked"}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                         {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() + ' ' + new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>
    </AppLayout>
  );
}