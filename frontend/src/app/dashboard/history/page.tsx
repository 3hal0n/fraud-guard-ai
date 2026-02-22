"use client";

import AppLayout from "@/components/AppLayout";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getTransactions, TransactionRecord } from "@/lib/api";

export default function HistoryPage() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getTransactions(user.id, 50)
      .then(setTransactions)
      .catch(() => setError("Failed to load transaction history."))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const safeCount = transactions.filter((t) => t.status === "safe").length;
  const riskCount = transactions.filter((t) => t.status === "risk").length;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Transaction History</h1>
            <p className="text-slate-500">Review all your fraud detection scans</p>
          </div>
          <button className="px-4 py-2 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-foreground rounded-lg font-medium transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Total Scans</p>
            <p className="text-2xl font-bold text-foreground">{loading ? "–" : transactions.length}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Safe Transactions</p>
            <p className="text-2xl font-bold text-teal-400">{loading ? "–" : safeCount}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">High Risk</p>
            <p className="text-2xl font-bold text-coral-500">{loading ? "–" : riskCount}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Risk Rate</p>
            <p className="text-2xl font-bold text-foreground">
              {loading || transactions.length === 0 ? "–" : `${Math.round((riskCount / transactions.length) * 100)}%`}
            </p>
          </div>
        </div>

        {/* Transaction List */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-coral-400">
                      {error}
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                      No transactions yet.{" "}
                      <a href="/dashboard/analyze" className="text-teal-400 hover:text-teal-300">
                        Scan your first transaction →
                      </a>
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => {
                    const riskPct = Math.round(txn.risk_score * 100);
                    return (
                      <tr key={txn.id} className="hover:bg-navy-900 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground font-mono text-sm">{txn.id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-foreground">
                            ${Number(txn.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[100px] h-2 bg-navy-900 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${txn.status === "risk" ? "bg-coral-500" : "bg-teal-500"}`}
                                style={{ width: `${riskPct}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${txn.status === "risk" ? "text-coral-400" : "text-teal-400"}`}>
                              {riskPct}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            txn.status === "risk"
                              ? "bg-coral-500/20 border border-coral-500/30 text-coral-400"
                              : "bg-teal-500/20 border border-teal-500/30 text-teal-400"
                          }`}>
                            {txn.status === "risk" ? "High Risk" : "Safe"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-foreground text-sm">{new Date(txn.timestamp).toLocaleString()}</p>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && !error && transactions.length > 0 && (
            <div className="border-t border-slate-800 px-6 py-4">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-foreground">{transactions.length}</span> transaction{transactions.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
