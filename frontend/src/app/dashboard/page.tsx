"use client";

import AppLayout from "@/components/AppLayout";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("");
  const userName = "Alex";
  const usedChecks = 3;
  const maxChecks = 5;
  const usagePercentage = (usedChecks / maxChecks) * 100;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {greeting}, {userName}.
          </h1>
          <p className="text-slate-500">Monitor your fraud detection activity and insights</p>
        </div>

        {/* Usage Tracker Card */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Daily Usage</h2>
              <p className="text-sm text-slate-500">Track your transaction checks</p>
            </div>
            <div className="px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full">
              <span className="text-sm font-medium text-teal-400">Free Plan</span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-foreground">{usedChecks}</span>
              <span className="text-xl text-slate-500">/ {maxChecks}</span>
              <span className="text-sm text-slate-500 ml-2">Free Checks Used Today</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-3 bg-navy-900 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {maxChecks - usedChecks} checks remaining today
            </p>
            <a href="/dashboard/billing" className="text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors">
              Upgrade to Pro →
            </a>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Total Scans */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Scans This Month</p>
                <h3 className="text-4xl font-bold text-foreground">847</h3>
              </div>
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm text-teal-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +12.5%
              </span>
              <span className="text-sm text-slate-500">vs last month</span>
            </div>
          </div>

          {/* At-Risk Transactions */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">At-Risk Transactions Detected</p>
                <h3 className="text-4xl font-bold text-coral-500">23</h3>
              </div>
              <div className="w-12 h-12 bg-coral-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm text-coral-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
                -8.3%
              </span>
              <span className="text-sm text-slate-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { time: "2 minutes ago", status: "safe", amount: "$1,245.00", merchant: "Amazon.com" },
              { time: "15 minutes ago", status: "risk", amount: "$5,890.00", merchant: "Unknown Vendor" },
              { time: "1 hour ago", status: "safe", amount: "$42.50", merchant: "Starbucks" },
              { time: "3 hours ago", status: "safe", amount: "$199.99", merchant: "Best Buy" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-navy-900 transition-all border border-slate-800"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.status === "safe" ? "bg-teal-500/20" : "bg-coral-500/20"
                  }`}>
                    {activity.status === "safe" ? (
                      <svg className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-coral-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{activity.merchant}</p>
                    <p className="text-sm text-slate-500">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{activity.amount}</p>
                  <p className={`text-sm font-medium ${
                    activity.status === "safe" ? "text-teal-400" : "text-coral-400"
                  }`}>
                    {activity.status === "safe" ? "SAFE" : "HIGH RISK"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="/dashboard/analyze"
            className="glass rounded-2xl p-6 hover:bg-navy-800 transition-all border border-transparent hover:border-teal-500/30 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Scan New Transaction</h3>
                <p className="text-sm text-slate-500">Run a fraud detection check</p>
              </div>
            </div>
          </a>

          <a
            href="/dashboard/history"
            className="glass rounded-2xl p-6 hover:bg-navy-800 transition-all border border-transparent hover:border-slate-600 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-700/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">View History</h3>
                <p className="text-sm text-slate-500">Review past transaction scans</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
