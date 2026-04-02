"use client";

import { useState } from "react";

export type HistoryFilters = {
  status: "all" | "safe" | "risk";
  minAmount?: number | null;
  maxAmount?: number | null;
  startDate?: string | null;
  endDate?: string | null;
};

export default function HistoryFilter({
  open,
  onClose,
  onApply,
  onClear,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (f: HistoryFilters) => void;
  onClear: () => void;
}) {
  const [status, setStatus] = useState<HistoryFilters["status"]>("all");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  if (!open) return null;

  function apply() {
    onApply({
      status,
      minAmount: minAmount ? Number(minAmount) : null,
      maxAmount: maxAmount ? Number(maxAmount) : null,
      startDate: startDate || null,
      endDate: endDate || null,
    });
    onClose();
  }

  function clear() {
    setStatus("all");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
    onClear();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-medium text-white mb-3">Filter Transactions</h3>
        <div className="space-y-3">
          <label className="block text-sm text-slate-400">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-[#070707] border border-white/5 rounded px-3 py-2 text-white">
            <option value="all">All</option>
            <option value="safe">Safe</option>
            <option value="risk">High Risk</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400">Min Amount</label>
              <input value={minAmount} onChange={(e) => setMinAmount(e.target.value)} type="number" placeholder="0" className="w-full bg-[#070707] border border-white/5 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Max Amount</label>
              <input value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} type="number" placeholder="1000" className="w-full bg-[#070707] border border-white/5 rounded px-3 py-2 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400">Start Date</label>
              <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="w-full bg-[#070707] border border-white/5 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-400">End Date</label>
              <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" className="w-full bg-[#070707] border border-white/5 rounded px-3 py-2 text-white" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={clear} className="px-3 py-2 rounded bg-white/3 text-white text-sm">Clear</button>
          <button onClick={apply} className="px-4 py-2 rounded bg-cyan-500 text-black font-medium">Apply</button>
        </div>
      </div>
    </div>
  );
}
