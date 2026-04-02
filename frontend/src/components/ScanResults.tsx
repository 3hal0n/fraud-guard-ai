"use client";

import { motion } from "framer-motion";
import type { RiskFactor } from "@/lib/api";

type ScanResultsProps = {
  riskScore: number;
  elapsed?: number;
  isFraud: boolean;
  riskFactors: RiskFactor[];
  fraudIndicators: string[];
  onClear: () => void;
};

function formatContribution(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toFixed(3)}`;
}

export default function ScanResults({
  riskScore,
  elapsed,
  isFraud,
  riskFactors,
  fraudIndicators,
  onClear,
}: ScanResultsProps) {
  const maxMagnitude = Math.max(1, ...riskFactors.map((factor) => Math.abs(factor.contribution)));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full z-10">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-lg font-medium text-white mb-1">Analysis Complete</h3>
          <p className="text-sm text-slate-500 font-mono">T+ {elapsed ?? "—"}ms</p>
        </div>
        <div
          className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase ${
            isFraud
              ? "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          }`}
        >
          {isFraud ? "Blocked" : "Approved"}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 mb-8">
        <div className="relative w-40 h-40 mx-auto sm:mx-0 shrink-0">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
            <circle cx="80" cy="80" r="70" stroke="#121214" strokeWidth="8" fill="none" />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={isFraud ? "#ef4444" : "#22d3ee"}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(riskScore / 100) * 440} 440`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-light ${isFraud ? "text-red-500" : "text-cyan-400"}`}>{riskScore}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Risk</span>
          </div>
        </div>

        <div className="flex-1 space-y-4 justify-center flex flex-col">
          <div className="p-4 bg-[#121214] rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Confidence Score</span>
              <span className="text-sm font-medium text-white">99.8%</span>
            </div>
            <div className="w-full h-1 bg-black rounded-full overflow-hidden mt-2">
              <div className="w-[99.8%] h-full bg-white/40" />
            </div>
          </div>
          <div className="p-4 bg-[#121214] rounded-xl border border-white/5 flex justify-between items-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Engine Protocol</span>
            <span className="text-sm font-medium text-white">v2.1 Fast-Track</span>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-white/5 bg-[#0f0f12] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-white">Why was this flagged?</h4>
            <p className="text-xs text-slate-500 mt-1">Top SHAP drivers for this transaction.</p>
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            {riskScore < 20 ? "Low Signal" : `${riskFactors.length} factors`}
          </div>
        </div>

        {riskScore < 20 || riskFactors.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-[#121214] px-4 py-3 text-sm text-slate-400">
            No significant risk factors detected.
          </div>
        ) : (
          <div className="space-y-3">
            {riskFactors.map((factor, index) => {
              const contribution = factor.contribution;
              const width = `${Math.max(10, (Math.abs(contribution) / maxMagnitude) * 100)}%`;
              const barClass = contribution >= 0 ? "bg-[#ff6b5a]" : "bg-[#19e6d4]";
              const textClass = contribution >= 0 ? "text-[#ff8a7a]" : "text-[#5cf3e3]";

              return (
                <div key={`${factor.feature}-${index}`} className="rounded-xl border border-white/5 bg-[#121214] p-3">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-sm text-white">{factor.feature}</span>
                    <span className={`text-xs font-mono ${textClass}`}>{formatContribution(contribution)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {fraudIndicators.length > 0 && (
        <div className="mb-auto">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Detected Anomalies</h4>
          <div className="grid gap-2">
            {fraudIndicators.map((indicator, index) => (
              <div key={`${indicator}-${index}`} className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span className="text-sm text-red-200">{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-white/5">
        <button onClick={onClear} className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-medium transition-all active:scale-95">
          Clear &amp; Scan Another
        </button>
      </div>
    </motion.div>
  );
}
