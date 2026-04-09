"use client";

import { motion } from "framer-motion";

const processSteps = [
  {
    step: "01",
    title: "Instant Ingestion",
    desc: "Transaction payloads stream securely via our ultra-low latency API or direct SDK integration.",
    time: "T+ 0ms",
    icon: (
      <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "AI Risk Scoring",
    desc: "Behavioral models and global network graphs evaluate hundreds of parameters simultaneously.",
    time: "T+ 15ms",
    icon: (
      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Automated Action",
    desc: "Deterministic rules catch anomalies and block the transaction before the processor is pinged.",
    time: "T+ 45ms",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full py-24 sm:py-32 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-medium text-white mb-6 tracking-tight">
            How it <span className="font-serif italic text-cyan-400">works</span>
          </h2>
          <p className="text-slate-400 text-lg">
            A frictionless pipeline engineered to make definitive risk decisions in under 50 milliseconds.
          </p>
        </div>

        <div className="relative relative-z-10 mt-16">
          
          {/* Background Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[10%] right-[10%] h-[1px] bg-white/10" />
          
          {/* Animated Data Pulse (Desktop) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[10%] right-[10%] h-[1px] overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Number / Icon Node */}
                <div className="w-16 h-16 rounded-2xl bg-[#0A0A0C] border border-white/10 flex items-center justify-center mb-6 relative group-hover:border-cyan-500/50 transition-colors shadow-xl z-20">
                  <div className="absolute inset-0 bg-cyan-500/5 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  {step.icon}
                  
                  {/* Step Number Tag */}
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-black border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400 font-mono">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-[#0A0A0C] border border-white/5 rounded-[2rem] p-8 hover:bg-[#0c0c0e] hover:border-white/10 transition-all flex flex-col items-center w-full relative overflow-hidden h-full">
                  <div className="absolute top-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono tracking-widest text-cyan-400 mb-6 border border-white/5">
                    {step.time}
                  </span>
                  
                  <h3 className="text-xl font-medium text-white mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}