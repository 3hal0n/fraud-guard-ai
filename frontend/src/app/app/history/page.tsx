import AppLayout from "@/components/app/AppLayout";
import { AlertTriangle, Shield, Clock } from "lucide-react";

export default function HistoryPage() {
  const transactions = [
    {
      id: "txn_001",
      amount: "$1,249.99",
      category: "Digital Goods",
      location: "192.168.1.45",
      riskScore: 87,
      status: "high-risk",
      timestamp: "2026-02-04 14:32:15",
    },
    {
      id: "txn_002",
      amount: "$89.50",
      category: "Retail",
      location: "10.0.0.23",
      riskScore: 12,
      status: "safe",
      timestamp: "2026-02-04 12:18:42",
    },
    {
      id: "txn_003",
      amount: "$2,450.00",
      category: "Travel & Hospitality",
      location: "172.16.0.5",
      riskScore: 34,
      status: "safe",
      timestamp: "2026-02-04 09:45:03",
    },
    {
      id: "txn_004",
      amount: "$599.99",
      category: "Financial Services",
      location: "192.168.0.100",
      riskScore: 8,
      status: "safe",
      timestamp: "2026-02-03 16:22:55",
    },
    {
      id: "txn_005",
      amount: "$3,899.00",
      category: "Digital Goods",
      location: "10.10.10.10",
      riskScore: 92,
      status: "high-risk",
      timestamp: "2026-02-03 11:05:30",
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
            <p className="text-muted-foreground">
              View all previous fraud detection scans
            </p>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last 7 days</span>
          </div>
        </div>

        {/* Transactions table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Transaction ID
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Risk Score
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${
                      index === transactions.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">{transaction.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">{transaction.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          transaction.status === "high-risk"
                            ? "text-destructive"
                            : "text-primary"
                        }`}
                      >
                        {transaction.riskScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "high-risk"
                            ? "bg-destructive/15 text-destructive border border-destructive/30"
                            : "bg-primary/15 text-primary border border-primary/30"
                        }`}
                      >
                        {transaction.status === "high-risk" ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            HIGH RISK
                          </>
                        ) : (
                          <>
                            <Shield className="w-3 h-3" />
                            SAFE
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {transaction.timestamp}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
