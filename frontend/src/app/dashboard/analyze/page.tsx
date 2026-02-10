"use client";

import AppLayout from "@/components/AppLayout";
import { useState } from "react";

export default function AnalyzePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    riskScore: number;
    status: "safe" | "risk";
  } | null>(null);

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    location: "",
    time: "",
    userId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setScanResult(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock result
    const mockRiskScore = Math.random() * 100;
    const mockStatus: "safe" | "risk" = mockRiskScore > 50 ? "risk" : "safe";

    setScanResult({
      riskScore: Math.round(mockRiskScore),
      status: mockStatus,
    });
    setIsScanning(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Transaction Analyzer</h1>
          <p className="text-slate-500">Run AI-powered fraud detection on new transactions</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form Card */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Run New Analysis</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Transaction Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
                  Transaction Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 bg-navy-900 border border-slate-700 rounded-lg text-foreground placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="1,250.00"
                    required
                  />
                </div>
              </div>

              {/* Merchant Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                  Merchant Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-navy-900 border border-slate-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="retail">Retail</option>
                  <option value="food">Food & Dining</option>
                  <option value="travel">Travel</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="utilities">Utilities</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Location / IP */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                  Location / IP Address
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-navy-900 border border-slate-700 rounded-lg text-foreground placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="192.168.1.1 or San Francisco, CA"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
                  Transaction Time
                </label>
                <input
                  id="time"
                  name="time"
                  type="datetime-local"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-navy-900 border border-slate-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* User ID */}
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-foreground mb-2">
                  User ID
                </label>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  value={formData.userId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-navy-900 border border-slate-700 rounded-lg text-foreground placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="user_12345abc"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isScanning}
                className="w-full px-6 py-4 bg-teal-500 hover:bg-teal-600 text-navy-950 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isScanning ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scanning Transaction...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Scan Transaction
                  </>
                )}
              </button>
            </form>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-navy-900 rounded-lg border border-slate-700">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-slate-400">
                    Results typically return in under 200ms. All data is encrypted and processed securely.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Scan Results</h2>

            {!scanResult && !isScanning && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-500">No scan results yet</p>
                  <p className="text-sm text-slate-600 mt-1">Fill out the form and click Scan Transaction</p>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-20 h-20 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-foreground font-medium">Analyzing transaction...</p>
                  <p className="text-sm text-slate-500 mt-1">Running AI fraud detection model</p>
                </div>
              </div>
            )}

            {scanResult && !isScanning && (
              <div className="space-y-6 animate-fadeIn">
                {/* Risk Score Gauge */}
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#1e293b"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke={scanResult.status === "risk" ? "#f87171" : "#06b6d4"}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(scanResult.riskScore / 100) * 552} 552`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-bold ${
                        scanResult.status === "risk" ? "text-coral-500" : "text-teal-400"
                      }`}>
                        {scanResult.riskScore}%
                      </span>
                      <span className="text-sm text-slate-500 mt-1">Risk Score</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <div className={`px-6 py-3 rounded-lg font-semibold text-lg ${
                    scanResult.status === "risk"
                      ? "bg-coral-500/20 border border-coral-500/30 text-coral-400"
                      : "bg-teal-500/20 border border-teal-500/30 text-teal-400"
                  }`}>
                    {scanResult.status === "risk" ? "⚠️ HIGH RISK DETECTED" : "✓ TRANSACTION SAFE"}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="p-4 bg-navy-900 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Processing Time</span>
                      <span className="font-medium text-foreground">147ms</span>
                    </div>
                  </div>
                  <div className="p-4 bg-navy-900 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Model Confidence</span>
                      <span className="font-medium text-foreground">98.3%</span>
                    </div>
                  </div>
                  <div className="p-4 bg-navy-900 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Fraud Indicators</span>
                      <span className="font-medium text-foreground">
                        {scanResult.status === "risk" ? "3 detected" : "None"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`p-4 rounded-lg border ${
                  scanResult.status === "risk"
                    ? "bg-coral-500/10 border-coral-500/30"
                    : "bg-teal-500/10 border-teal-500/30"
                }`}>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {scanResult.status === "risk" ? "Recommended Action" : "Result"}
                  </p>
                  <p className="text-sm text-slate-400">
                    {scanResult.status === "risk"
                      ? "This transaction shows high risk indicators. Consider additional verification steps or blocking the transaction."
                      : "This transaction passed all fraud detection checks and appears legitimate."}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setScanResult(null)}
                    className="flex-1 px-4 py-3 bg-navy-900 hover:bg-navy-800 border border-slate-700 text-foreground rounded-lg font-medium transition-all"
                  >
                    Scan Another
                  </button>
                  <button className="flex-1 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-navy-950 rounded-lg font-medium transition-all">
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
