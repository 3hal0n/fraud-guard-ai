"use client";

import AppLayout from "@/components/AppLayout";

export default function HistoryPage() {
  const transactions = [
    {
      id: "TXN-2026-0847",
      time: "2 minutes ago",
      timestamp: "Feb 10, 2026 2:45 PM",
      status: "safe",
      riskScore: 12,
      amount: "$1,245.00",
      merchant: "Amazon.com",
      category: "Retail",
      location: "Seattle, WA",
    },
    {
      id: "TXN-2026-0846",
      time: "15 minutes ago",
      timestamp: "Feb 10, 2026 2:30 PM",
      status: "risk",
      riskScore: 87,
      amount: "$5,890.00",
      merchant: "Unknown Vendor",
      category: "Other",
      location: "Unknown Location",
    },
    {
      id: "TXN-2026-0845",
      time: "1 hour ago",
      timestamp: "Feb 10, 2026 1:45 PM",
      status: "safe",
      riskScore: 8,
      amount: "$42.50",
      merchant: "Starbucks",
      category: "Food & Dining",
      location: "San Francisco, CA",
    },
    {
      id: "TXN-2026-0844",
      time: "3 hours ago",
      timestamp: "Feb 10, 2026 11:45 AM",
      status: "safe",
      riskScore: 15,
      amount: "$199.99",
      merchant: "Best Buy",
      category: "Retail",
      location: "Los Angeles, CA",
    },
    {
      id: "TXN-2026-0843",
      time: "5 hours ago",
      timestamp: "Feb 10, 2026 9:45 AM",
      status: "risk",
      riskScore: 72,
      amount: "$3,200.00",
      merchant: "Crypto Exchange",
      category: "Financial",
      location: "International",
    },
  ];

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
            <p className="text-2xl font-bold text-foreground">847</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Safe Transactions</p>
            <p className="text-2xl font-bold text-teal-400">824</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">High Risk</p>
            <p className="text-2xl font-bold text-coral-500">23</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Avg. Response</p>
            <p className="text-2xl font-bold text-foreground">142ms</p>
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
                    Merchant
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
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-navy-900 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{txn.id}</p>
                        <p className="text-sm text-slate-500">{txn.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-foreground">{txn.merchant}</p>
                        <p className="text-sm text-slate-500">{txn.location}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{txn.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px] h-2 bg-navy-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              txn.status === "risk" ? "bg-coral-500" : "bg-teal-500"
                            }`}
                            style={{ width: `${txn.riskScore}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${
                          txn.status === "risk" ? "text-coral-400" : "text-teal-400"
                        }`}>
                          {txn.riskScore}%
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
                      <div>
                        <p className="text-foreground">{txn.time}</p>
                        <p className="text-sm text-slate-500">{txn.timestamp}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-foreground rounded-lg text-sm font-medium transition-all">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-slate-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-foreground">1-5</span> of{" "}
                <span className="font-medium text-foreground">847</span> transactions
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-foreground rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-navy-950 rounded-lg text-sm font-medium transition-all">
                  1
                </button>
                <button className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-foreground rounded-lg text-sm font-medium transition-all">
                  2
                </button>
                <button className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-foreground rounded-lg text-sm font-medium transition-all">
                  3
                </button>
                <button className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-foreground rounded-lg text-sm font-medium transition-all">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
