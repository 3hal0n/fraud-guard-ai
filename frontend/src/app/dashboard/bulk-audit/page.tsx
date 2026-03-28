"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import AppLayout from "@/components/AppLayout";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  ApiError,
  BulkAuditResponse,
  getUserInfo,
  uploadBulkAuditCsv,
  UserInfo,
} from "@/lib/api";
import { motion } from "framer-motion";

export default function BulkAuditPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  let user: { id?: string } | null = null;
  if (clerkEnabled) {
    const u = useUser();
    user = u?.user ?? null;
  }

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<BulkAuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    getUserInfo(user.id)
      .then(setUserInfo)
      .catch(() => setError("Could not load your plan status."));
  }, [user?.id]);

  // Allow accessing Pro features during development/testing. Set
  // NEXT_PUBLIC_ALLOW_PRO_TEST=1 to force enabling in other environments.
  const allowProForTesting = process.env.NEXT_PUBLIC_ALLOW_PRO_TEST === "1";
  const isPro = userInfo?.plan === "PRO" || allowProForTesting;

  const riskRows = useMemo(
    () => (result?.flagged_rows || []).filter((r) => r.status === "risk"),
    [result]
  );
  const invalidRows = useMemo(
    () => (result?.flagged_rows || []).filter((r) => r.status === "invalid"),
    [result]
  );

  const handleDrop = (file: File | null) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a .csv file.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    setResult(null);
  };

  const onUpload = async () => {
    if (!user?.id || !selectedFile) return;
    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const res = await uploadBulkAuditCsv(user.id, selectedFile);
      setResult(res);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.detail || "Bulk audit failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-medium text-white mb-2 tracking-tight">Bulk CSV Audit</h1>
          <p className="text-slate-400">Upload up to 100 transactions and instantly get flagged rows.</p>
        </motion.div>

        {!isPro ? (
          <div className="bg-[#0A0A0A] border border-cyan-500/30 rounded-3xl p-8">
            <h2 className="text-white text-xl font-medium mb-2">Pro Feature</h2>
            <p className="text-slate-400 mb-5">Bulk CSV auditing is available only on the PRO plan.</p>
            <a href="/dashboard/billing" className="inline-flex px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors">
              Upgrade To PRO
            </a>
          </div>
        ) : (
          <>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleDrop(e.dataTransfer.files?.[0] || null);
                }}
                className={`rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
                  isDragging ? "border-cyan-400 bg-cyan-500/5" : "border-white/15 bg-[#111114]"
                }`}
              >
                <p className="text-white text-base font-medium mb-2">Drag and drop CSV here</p>
                <p className="text-slate-400 text-sm mb-4">Required columns: amount, merchant. Optional: location, time.</p>
                <label className="inline-flex px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white cursor-pointer">
                  Choose CSV
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => handleDrop(e.target.files?.[0] || null)}
                  />
                </label>
                {selectedFile && <p className="mt-4 text-cyan-300 text-sm">Selected: {selectedFile.name}</p>}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-xs text-slate-500">Limit: 100 rows per upload</p>
                <button
                  onClick={onUpload}
                  disabled={!selectedFile || isUploading}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isUploading ? "Processing..." : "Run Bulk Audit"}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
            </div>

            {result && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Processed Rows</p>
                    <p className="text-2xl text-white mt-1">{result.processed_rows}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Flagged Risks</p>
                    <p className="text-2xl text-red-400 mt-1">{riskRows.length}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Invalid Rows</p>
                    <p className="text-2xl text-amber-400 mt-1">{invalidRows.length}</p>
                  </div>
                </div>

                <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5">
                    <h2 className="text-white font-medium">Flagged Output</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#121214]">
                          <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-widest">Row</th>
                          <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-widest">Merchant</th>
                          <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-widest">Amount</th>
                          <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-widest">Risk</th>
                          <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-widest">Error</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {result.flagged_rows.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-slate-500 text-sm">
                              No risky or invalid rows were detected.
                            </td>
                          </tr>
                        ) : (
                          result.flagged_rows.map((row) => (
                            <tr key={`${row.row_number}-${row.status}-${row.merchant || "-"}`}>
                              <td className="px-6 py-4 text-sm text-slate-300">{row.row_number}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${row.status === "risk" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-amber-500/10 border-amber-500/20 text-amber-400"}`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-white">{row.merchant || "-"}</td>
                              <td className="px-6 py-4 text-sm text-white">{typeof row.amount === "number" ? `$${row.amount.toFixed(2)}` : "-"}</td>
                              <td className="px-6 py-4 text-sm text-red-300">{typeof row.risk_score === "number" ? `${row.risk_score}%` : "-"}</td>
                              <td className="px-6 py-4 text-xs text-amber-300">{row.error || "-"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
