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
      <div className="max-w-6xl mx-auto space-y-6">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-medium text-white mb-2 tracking-tight">
            {greeting}, <span className="text-cyan-400">{user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "there"}</span>.
          </h1>
          <p className="text-slate-400">Monitor your fraud detection activity and insights.</p>
        </motion.div>

        {/* Top Row: Usage & Stats */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Usage Tracker Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-white mb-1">Daily Usage</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">API Limits</p>
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-md">
                  <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">
                    {loadingInfo ? "..." : userInfo?.plan === "PRO" ? "PRO" : "DEV"}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-light text-white">{loadingInfo ? "–" : usedChecks}</span>
                <span className="text-xl text-slate-600">/ {loadingInfo ? "–" : (userInfo?.daily_limit === null ? "∞" : maxChecks)}</span>
              </div>

              {userInfo?.daily_limit !== null && (
                <div className="relative w-full h-1.5 bg-[#121214] rounded-full overflow-hidden mb-4">
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
                <Link href="/dashboard/billing" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  Upgrade →
                </Link>
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#121214] border border-white/5 rounded-xl">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Total Scans</p>
                <h3 className="text-4xl font-light text-white">{loadingInfo ? "–" : recentTxns.length}</h3>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Threats Blocked</p>
                <h3 className="text-4xl font-light text-red-500">{loadingInfo ? "–" : recentTxns.filter((t) => t.status === "risk").length}</h3>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Bottom Row: Actions & Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col gap-6">
            <Link href="/dashboard/analyze" className="group bg-gradient-to-br from-cyan-900/40 to-[#0A0A0A] border border-cyan-500/30 rounded-[2rem] p-6 hover:border-cyan-400 transition-all flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white mb-0.5">Scan Transaction</h3>
                <p className="text-xs text-cyan-500/70">Run an AI fraud check</p>
              </div>
            </Link>

            <Link href="/dashboard/history" className="group bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-6 hover:border-white/20 transition-all flex items-center gap-4">
              <div className="w-12 h-12 bg-[#121214] border border-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white mb-0.5">View History</h3>
                <p className="text-xs text-slate-500">Access past reports</p>
              </div>
            </Link>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8">
            <h2 className="text-lg font-medium text-white mb-6">Recent Activity</h2>
            
            {loadingInfo ? (
              <p className="text-slate-500 text-sm">Loading transactions...</p>
            ) : recentTxns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/10 rounded-xl">
                <p className="text-slate-500 text-sm mb-2">No transactions analyzed yet.</p>
                <Link href="/dashboard/analyze" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">Initiate first scan →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTxns.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#121214] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.status === "safe" ? "bg-cyan-500/10 text-cyan-400" : "bg-red-500/10 text-red-500"}`}>
                        {activity.status === "safe" ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">
                          ${Number(activity.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-slate-500">
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold uppercase tracking-wider ${activity.status === "safe" ? "text-cyan-400" : "text-red-500"}`}>
                        {activity.status === "safe" ? "SAFE" : "BLOCKED"}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Risk: {Math.round(activity.risk_score * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
}