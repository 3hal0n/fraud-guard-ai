"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full py-24 sm:py-32 bg-black overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">System Architecture</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-medium text-white mb-6 tracking-tight leading-[0.9]">
            The Sentinel <span className="font-serif italic text-cyan-400">Decision Engine</span>
          </h2>
          <p className="text-slate-400 text-lg font-light">
            A non-linear inference pipeline built for sub-100ms execution. See exactly how data flows from integration to automated blocking.
          </p>
        </div>

        {/* Main Architectural Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-6 lg:gap-8 relative items-center">
          
          {/* Background Connecting Lines (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-[2px] -translate-y-1/2 z-0">
            <div className="w-full h-full bg-white/5 relative">
               <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              />
            </div>
          </div>

          {/* COLUMN 1: INPUTS */}
          <div className="flex flex-col gap-6 relative z-10">
            {/* Input 1: API Hub */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <h3 className="text-white font-medium text-sm">REST API Hub</h3>
              </div>
              <div className="bg-black/50 rounded-lg p-3 border border-white/5 font-mono text-[10px] text-slate-400 overflow-hidden">
                <div className="text-cyan-500 mb-1">POST /api/v1/analyze</div>
                <div className="text-slate-500">X-API-Key: fg_live_***</div>
                <div>{`{`}</div>
                <div className="pl-4">"amount": <span className="text-cyan-400">$15000.00</span>,</div>
                <div className="pl-4">"location": <span className="text-cyan-400">"Kurumoch, Russian Federation"</span></div>
                <div>{`}`}</div>
              </div>
            </motion.div>

            {/* Input 2: Bulk CSV */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10">
                  <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-white font-medium text-sm">Bulk CSV Audit</h3>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-6 w-full rounded bg-white/5 border border-white/5 flex items-center px-2 opacity-${100 - (i*20)}`}>
                    <div className="h-1.5 w-1/3 bg-slate-600 rounded-full" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* COLUMN 2: THE ENGINE (CENTER) */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="relative z-20"
          >
            <div className="bg-[#050505] backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(37,99,235,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden">
              {/* Internal Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-600/10 blur-3xl rounded-full" />
              
              <div className="text-center mb-8 relative z-10">
                <h3 className="text-xl font-medium text-white tracking-tight">XGBoost Risk Analysis</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Inference Engine</p>
              </div>

              {/* Risk Dial */}
              <div className="flex justify-center mb-10 relative z-10">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a1a" strokeWidth="6" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray="283" strokeDashoffset="34" className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" strokeLinecap="round" />
                  </svg>
                  <div className="text-center">
                    <span className="text-5xl font-light text-white tracking-tighter">95<span className="text-2xl text-slate-500">%</span></span>
                    <span className="block text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">High Risk</span>
                  </div>
                </div>
              </div>

              {/* SHAP Explainability Sub-panel */}
              <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 relative z-10">
                <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">SHAP Explainability Drivers</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">Location Anomaly</span>
                      <span className="text-red-400">+45.2%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: "85%" }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">Velocity Spike</span>
                      <span className="text-red-400">+31.8%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: "60%" }} transition={{ duration: 1, delay: 0.6 }} className="h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">Amount (Typical)</span>
                      <span className="text-cyan-400">-15.0%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: "25%" }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* COLUMN 3: OUTPUTS */}
          <div className="flex flex-col gap-6 relative z-10">
            
            {/* Logic Gate Visual */}
            <div className="hidden lg:block absolute left-[-2rem] top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-black px-2">
              if (risk &gt; 75)
            </div>

            {/* Output 1: Block (Active) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/20 blur-2xl rounded-full" />
               <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <div>
                  <h3 className="text-red-400 font-bold tracking-wide text-sm mb-1 uppercase">Block Transaction</h3>
                  <p className="text-xs text-slate-400">Webhook triggered instantly.</p>
                </div>
              </div>
            </motion.div>

            {/* Output 2: Approve (Inactive/Faded) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 0.4, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 grayscale"
            >
               <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="text-cyan-400 font-bold tracking-wide text-sm mb-1 uppercase">Approve</h3>
                  <p className="text-xs text-slate-500">Proceed to payment processor.</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}