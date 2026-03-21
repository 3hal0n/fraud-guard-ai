"use client";

import AppLayout from "@/components/AppLayout";
import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserInfo, getTransactions, UserInfo, TransactionRecord } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recentTxns, setRecentTxns] = useState<TransactionRecord[]>([]);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const usedChecks = userInfo?.daily_usage ?? 0;
  const maxChecks = userInfo?.daily_limit ?? 5;
  const usagePercentage = maxChecks > 0 ? Math.min((usedChecks / maxChecks) * 100, 100) : 0;
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const { monthlyBars, lineMax, linePoints, totalVolume, blockedPercent, avgAmount } = useMemo(() => {
    const bars = new Array(12).fill(0);
    const sums = new Array(12).fill(0);
    const counts = new Array(12).fill(0);
    let total = 0;
    let blocked = 0;
    let txCount = 0;

    recentTxns.forEach((t) => {
      if (!t.timestamp) return;
      const d = new Date(t.timestamp);
      if (Number.isNaN(d.getTime())) return;
      const m = d.getMonth();
      bars[m] += Number(t.amount || 0);
      sums[m] += Number(t.amount || 0);
      counts[m] += 1;
      total += Number(t.amount || 0);
      if (t.status === "risk") blocked += 1;
      txCount += 1;
    });

    const avgPerMonth = sums.map((s, i) => (counts[i] ? s / counts[i] : 0));
    const maxVal = Math.max(70, ...bars, ...avgPerMonth);

    const points = avgPerMonth
      .map((value, index) => {
        const x = (index / (avgPerMonth.length - 1)) * 100;
        const y = 100 - (value / maxVal) * 100;
        return `${x},${y}`;
      })
      .join(" ");

    return {
      monthlyBars: bars,
      lineMax: maxVal,
      linePoints: points,
      totalVolume: total,
      blockedPercent: txCount ? Math.round((blocked / txCount) * 100) : 0,
      avgAmount: txCount ? total / txCount : 0,
    };
  }, [recentTxns]);

  useEffect(() => {
    if (!user?.id) return;
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
          
          {/* Left Column: Usage Tracker + Small Stats */}
          <div className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl lg:self-start">
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

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
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

            {/* Small Stats Card under Daily Usage */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-4 sm:p-6 shadow-md">
              <h3 className="text-sm font-medium text-white mb-3">Quick Stats</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#0E0E10] rounded-lg text-center">
                  <div className="text-xs text-slate-400">Total Volume</div>
                  <div className="text-sm font-medium text-white mt-1">${totalVolume.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-[#0E0E10] rounded-lg text-center">
                  <div className="text-xs text-slate-400">Blocked</div>
                  <div className="text-sm font-medium text-white mt-1">{blockedPercent}%</div>
                </div>
                <div className="p-3 bg-[#0E0E10] rounded-lg text-center">
                  <div className="text-xs text-slate-400">Avg Amount</div>
                  <div className="text-sm font-medium text-white mt-1">${avgAmount.toFixed(2)}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Activity / Trend Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div>
                <h2 className="text-base sm:text-lg font-medium text-white mb-1">Transaction Volume</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Monthly Performance</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-light text-white">{loadingInfo ? "–" : recentTxns.length}</p>
                <p className="text-xs text-cyan-400 font-medium">Total Scans</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl border border-white/5 bg-[#121214] p-3">
                <p className="text-[11px] text-slate-500 uppercase tracking-wide">Total Sales</p>
                <p className="text-xl font-medium text-white mt-1">$21,356</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#121214] p-3">
                <p className="text-[11px] text-slate-500 uppercase tracking-wide">Average</p>
                <p className="text-xl font-medium text-white mt-1">$1,935</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[#121214] p-3">
                <p className="text-[11px] text-slate-500 uppercase tracking-wide">Growth</p>
                <p className="text-xl font-medium text-cyan-400 mt-1">+18.2%</p>
              </div>
            </div>

            <div className="relative z-10 h-64 w-full rounded-2xl border border-white/5 bg-[#0c0c0e] px-4 pt-6 pb-4">
              <div className="pointer-events-none absolute inset-0 grid grid-rows-4">
                {[0, 1, 2, 3].map((line) => (
                  <div key={line} className="border-t border-white/5" />
                ))}
              </div>

              <svg className="absolute inset-0 h-full w-full px-4 pt-6 pb-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="dashLineGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {monthlyBars.map((value, index) => {
                  const barWidth = 100 / monthlyBars.length - 2.6;
                  const x = index * (100 / monthlyBars.length) + 1.3;
                  const height = (value / lineMax) * 100;
                  return (
                    <rect
                      key={`bar-${monthLabels[index]}`}
                      x={x}
                      y={100 - height}
                      width={barWidth}
                      height={height}
                      rx="0.9"
                      fill="#6366f1"
                      fillOpacity="0.82"
                    />
                  );
                })}

                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="url(#dashLineGradient)"
                  strokeWidth="1.4"
                />
              </svg>

              <div className="absolute bottom-2 left-4 right-4 grid grid-cols-12 text-[10px] text-slate-500">
                {monthLabels.map((month) => (
                  <span key={`label-${month}`} className="text-center">
                    {month}
                  </span>
                ))}
              </div>
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

            {/* Risk Mix + Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-2 flex justify-center">
                <div className="relative w-44 h-44 rounded-full bg-[conic-gradient(#06b6d4_0deg,#06b6d4_255deg,#ef4444_255deg,#ef4444_325deg,#334155_325deg,#334155_360deg)] p-4 shadow-[0_0_50px_rgba(6,182,212,0.18)]">
                  <div className="w-full h-full rounded-full bg-[#0A0A0A] border border-white/5 flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-semibold text-white">78%</p>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide">Low Risk</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-4">
                {[
                  { label: "Safe", value: 78, color: "bg-cyan-500" },
                  { label: "Review", value: 12, color: "bg-amber-500" },
                  { label: "Blocked", value: 10, color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-white">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
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