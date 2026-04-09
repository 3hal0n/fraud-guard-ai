"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import AppLayout from "@/components/AppLayout";
import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserInfo, getTransactions, getTelemetrySummary, UserInfo, TransactionRecord, TelemetrySummary } from "@/lib/api";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import Link from "next/link";

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DashboardPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  type ClerkLikeUser = {
    id?: string;
    firstName?: string | null;
    emailAddresses?: Array<{ emailAddress?: string | null }>;
  };
  let user: ClerkLikeUser | null = null;
  if (clerkEnabled) {
    const u = useUser();
    user = (u?.user as ClerkLikeUser | null) ?? null;
  }
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recentTxns, setRecentTxns] = useState<TransactionRecord[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetrySummary | null>(null);
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

  const formatUSD = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  // Custom glassmorphic tooltip for the charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A0A0C]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          <p className="text-white font-medium mb-3 border-b border-white/10 pb-2">{label} 2026</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }} />
                <span className="text-slate-400 capitalize">{entry.name}:</span>
              </div>
              <span className="text-white font-mono font-medium">{formatUSD(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const { totalVolume, blockedPercent, safePercent, avgAmount, blockedVolumeYtd, chartData } = useMemo(() => {
    const bars = new Array(12).fill(0);
    const safeBars = new Array(12).fill(0);
    const blockedBars = new Array(12).fill(0);
    const sums = new Array(12).fill(0);
    const counts = new Array(12).fill(0);
    let total = 0;
    let blocked = 0;
    let blockedAmountYtd = 0;
    let txCount = 0;
    const currentYear = new Date().getFullYear();

    recentTxns.forEach((t) => {
      if (!t.timestamp) return;
      const d = new Date(t.timestamp);
      if (Number.isNaN(d.getTime())) return;
      const m = d.getMonth();
      const amount = Number(t.amount || 0);
      bars[m] += amount;
      sums[m] += amount;
      counts[m] += 1;
      total += amount;
      if (t.status === "risk") {
        blocked += 1;
        blockedBars[m] += amount;
        if (d.getFullYear() === currentYear) blockedAmountYtd += amount;
      } else {
        safeBars[m] += amount;
      }
      txCount += 1;
    });

    const avgPerMonth = sums.map((s, i) => (counts[i] ? s / counts[i] : 0));

    const chartData = monthLabels.map((m, i) => ({
      month: m,
      total: Math.round(bars[i] * 100) / 100,
      safe: Math.round(safeBars[i] * 100) / 100,
      blocked: Math.round(blockedBars[i] * 100) / 100,
      avg: Math.round(avgPerMonth[i] * 100) / 100,
      scans: counts[i],
    }));
    
    const calculatedBlockedPercent = txCount ? Math.round((blocked / txCount) * 100) : 0;

    return {
      totalVolume: total,
      blockedPercent: calculatedBlockedPercent,
      safePercent: 100 - calculatedBlockedPercent,
      avgAmount: txCount ? total / txCount : 0,
      blockedVolumeYtd: blockedAmountYtd,
      chartData,
    };
  }, [recentTxns]);

  // Data for the new Recharts Donut PieChart
  const pieData = [
    { name: "Safe", value: safePercent, color: "#06b6d4" },
    { name: "Blocked", value: blockedPercent, color: "#ef4444" }
  ];

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      getUserInfo(user.id),
      getTransactions(user.id, 100),
      getTelemetrySummary(user.id),
    ])
      .then(([info, txns, summary]) => {
        setUserInfo(info);
        setRecentTxns(txns);
        setTelemetry(summary);
      })
      .catch(() => null)
      .finally(() => setLoadingInfo(false));
  }, [user?.id]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-medium text-white mb-1 tracking-tight">
            {greeting}, <span className="text-cyan-400">{user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "there"}</span>.
          </h1>
          <p className="text-sm text-slate-400">Monitor your fraud detection activity and insights.</p>
        </motion.div>

        {/* --- ROW 1: TOP KPI CARDS (Restructured to save vertical space) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* YTD Prevented (Now a compact card) */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#072026] via-[#071418] to-[#14090c] p-6 shadow-[0_20px_60px_rgba(6,182,212,0.15)] flex flex-col justify-center h-full group">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-500" />
            <p className="relative z-10 text-[10px] uppercase tracking-[0.2em] text-cyan-300/80 mb-2">Fraud Prevented (YTD)</p>
            <p className="relative z-10 text-3xl lg:text-4xl font-semibold text-white tracking-tight truncate">
              {loadingInfo ? "—" : formatUSD(blockedVolumeYtd)}
            </p>
          </motion.div>

          {/* Daily Usage */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-white mb-0.5">Daily Usage</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">API Limits</p>
              </div>
              <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md">
                <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">
                  {loadingInfo ? "..." : userInfo?.plan === "PRO" ? "PRO" : "DEV"}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-3xl font-light text-white">{loadingInfo ? "–" : usedChecks}</span>
                <span className="text-sm text-slate-600">/ {loadingInfo ? "–" : (userInfo?.daily_limit === null ? "∞" : maxChecks)}</span>
              </div>
              {userInfo?.daily_limit !== null && (
                <div className="relative w-full h-1.5 bg-[#121214] rounded-full overflow-hidden mb-3">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000" style={{ width: `${usagePercentage}%` }} />
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-400">
                  {loadingInfo ? "Loading..." : userInfo?.daily_limit === null ? "Unlimited checks" : `${Math.max(0, maxChecks - usedChecks)} remaining`}
                </p>
                {userInfo?.plan !== "PRO" && (
                  <Link href="/dashboard/billing" className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Upgrade →</Link>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Stats (Restyled to fit the row) */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full">
            <h3 className="text-sm font-medium text-white mb-3">System Overview</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center p-2.5 bg-[#0E0E10] rounded-xl border border-white/5">
                <span className="text-xs text-slate-400">Total Volume</span>
                <span className="text-sm font-medium text-white">${totalVolume.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#0E0E10] rounded-xl border border-white/5">
                <span className="text-xs text-slate-400">Avg Amount</span>
                <span className="text-sm font-medium text-white">${avgAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-red-500/5 rounded-xl border border-red-500/10">
                <span className="text-xs text-red-400/80">Blocked Rate</span>
                <span className="text-sm font-medium text-red-400">{blockedPercent}%</span>
              </div>
            </div>
          </motion.div>
        </div>


        {/* --- ROW 2: MAIN CHARTS (Now immediately visible without scrolling) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Transaction Volume (Spans 2 columns) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden shadow-2xl group min-h-[400px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-50" />

            <div className="flex justify-between items-start sm:items-center mb-6 relative z-10 flex-col sm:flex-row gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-medium text-white mb-1">Transaction Volume</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Monthly Performance</p>
              </div>
              <div className="flex gap-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2 backdrop-blur-sm text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total Scans</p>
                  <p className="text-lg font-medium text-white mt-0.5">{loadingInfo ? "-" : (telemetry?.total_scans ?? 0)}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-red-500/[0.02] px-4 py-2 backdrop-blur-sm text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Threats</p>
                  <p className="text-lg font-medium text-red-400 mt-0.5">{loadingInfo ? "-" : (telemetry?.high_risk_detected ?? 0)}</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex-1 w-full pt-4 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid stroke="#ffffff" strokeOpacity={0.03} vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 11 }} 
                    tickFormatter={(val) => {
                      if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
                      if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
                      return `$${val}`;
                    }} 
                  />
                  
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff', strokeOpacity: 0.1, strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                  
                  <Area type="monotone" dataKey="safe" name="Safe Volume" stackId="1" stroke="#06b6d4" strokeWidth={2} fill="url(#colorSafe)" activeDot={{ r: 6, fill: '#06b6d4', stroke: '#000', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="blocked" name="Blocked Volume" stackId="1" stroke="#ef4444" strokeWidth={2} fill="url(#colorBlocked)" activeDot={{ r: 6, fill: '#ef4444', stroke: '#000', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="avg" name="Avg Amount" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={{ r: 4, fill: '#8b5cf6' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Threat Analysis (UPGRADED to Recharts Donut) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl h-full">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-base sm:text-lg font-medium text-white mb-1">Threat Analysis</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Risk Distribution</p>
              </div>
            </div>

            {/* Recharts Animated Donut */}
            <div className="flex-1 flex flex-col justify-center items-center relative min-h-[200px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                 <span className="text-4xl font-light text-white tracking-tighter">{safePercent}%</span>
                 <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-1">Safe</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    animationBegin={200}
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        style={{ filter: `drop-shadow(0px 0px 8px ${entry.color}60)` }} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                    formatter={(value: number) => [`${value}%`, 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 mt-2">
              {pieData.map((item) => (
                <div key={item.name}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{item.name}</span>
                    <span className="text-white font-mono">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full" 
                      style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- ROW 3: ACTIONS & LEDGER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col gap-4">
            <Link href="/dashboard/analyze" className="group bg-gradient-to-br from-cyan-900/30 to-[#0A0A0A] border border-cyan-500/20 rounded-3xl p-5 hover:border-cyan-400/50 transition-all flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
              </div>
              <div>
                <h3 className="font-medium text-white mb-0.5 text-sm">Scan Transaction</h3>
                <p className="text-[11px] text-cyan-500/70">Run an AI fraud check</p>
              </div>
            </Link>

            <Link href="/dashboard/history" className="group bg-[#0A0A0A] border border-white/5 rounded-3xl p-5 hover:border-white/20 transition-all flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 bg-[#121214] border border-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <h3 className="font-medium text-white mb-0.5 text-sm">View Ledger</h3>
                <p className="text-[11px] text-slate-500">Access past reports</p>
              </div>
            </Link>

            { (userInfo?.plan === "PRO" || process.env.NEXT_PUBLIC_ALLOW_PRO_TEST === "1") && (
              <Link href="/dashboard/api-hub" className="group bg-[#0A0A0A] border border-white/5 rounded-3xl p-5 hover:border-white/20 transition-all flex items-center gap-4 shadow-xl">
                <div className="w-10 h-10 bg-[#121214] border border-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h3m-7.5 6h12m-9 6h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-0.5 text-sm">Developer API Hub</h3>
                  <p className="text-[11px] text-slate-500">Generate and use API keys</p>
                </div>
              </Link>
            )}
            { (userInfo?.plan === "PRO" || process.env.NEXT_PUBLIC_ALLOW_PRO_TEST === "1") && (
              <Link href="/dashboard/bulk-audit" className="group bg-[#0A0A0A] border border-white/5 rounded-3xl p-5 hover:border-white/20 transition-all flex items-center gap-4 shadow-xl">
                <div className="w-10 h-10 bg-[#121214] border border-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h10m4 0l2-2m0 0l-2-2m2 2H14" /></svg>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-0.5 text-sm">Bulk CSV Audit</h3>
                  <p className="text-[11px] text-slate-500">Scan up to 100 rows at once</p>
                </div>
              </Link>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full">
            <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-base sm:text-lg font-medium text-white">Recent Ledger</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Latest Ingestions</p>
              </div>
              <Link href="/dashboard/history" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium bg-cyan-400/10 px-3 py-1.5 rounded-full transition-colors">View All</Link>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              {loadingInfo ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">Loading ledger...</div>
              ) : recentTxns.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-12">
                  <div className="w-12 h-12 bg-[#121214] rounded-full flex items-center justify-center mb-3 border border-white/5">
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">No transactions analyzed yet.</p>
                  <Link href="/dashboard/analyze" className="text-cyan-400 text-xs font-medium bg-cyan-500/10 px-4 py-2 rounded-lg">Initiate first scan</Link>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#121214]/50 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">ID</th>
                      <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                      <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentTxns.slice(0, 4).map((activity) => (
                      <tr key={activity.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-slate-400 whitespace-nowrap">{activity.id.substring(0,8)}...</td>
                        <td className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap">${Number(activity.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
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
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
}