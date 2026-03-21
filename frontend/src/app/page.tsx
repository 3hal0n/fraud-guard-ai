"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SocialProof from "@/components/SocialProof";

type CardData = {
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ReactNode;
  value: string;
};

const valueCards: CardData[] = [
  {
    title: "Real-time Monitoring",
    subtitle: "Fraud Team",
    desc: "Track suspicious activity with live AI signals and instant triage recommendations.",
    value: "< 50ms",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Case Intelligence",
    subtitle: "Analysts",
    desc: "Unify device, behavior, and payment evidence into explainable risk narratives.",
    value: "360°",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2a4 4 0 014-4h5m-5-4V5m0 14l-3-3m3 3l3-3M5 7h4" />
      </svg>
    ),
  },
  {
    title: "Automated Decisions",
    subtitle: "Operations",
    desc: "Ship safe approvals with rule + model orchestration for every transaction.",
    value: "99.9%",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans selection:bg-cyan-500/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-screen flex flex-col items-center pt-24 pb-16 sm:pt-32">
        
        {/* Background Globe & Light Streaks */}
        <div className="absolute inset-0 z-0 flex items-start justify-center pointer-events-none overflow-hidden">
          {/* Moving Light Streaks */}
          {[15, 30, 70, 85].map((left, i) => (
            <motion.div
              key={i}
              initial={{ y: "-100vh", opacity: 0 }}
              animate={{ y: "100vh", opacity: [0, 1, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "linear", delay: i * 1.5 }}
              className="absolute w-[1px] h-40 bg-gradient-to-b from-transparent via-cyan-400/80 to-transparent"
              style={{ left: `${left}%` }}
            />
          ))}

          {/* The Clarid-style Globe - Added Mask to fade out bottom */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] sm:w-[1200px] sm:h-[1200px] rounded-full border border-white/5 bg-gradient-to-b from-black to-cyan-950/20 shadow-[inset_0_0_120px_rgba(6,182,212,0.15)] flex items-end justify-center [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
            {/* Inner Bottom Glow */}
            <div className="w-[80%] h-[40%] bg-cyan-500/20 blur-[120px] rounded-full" />
            {/* Crisp Rim Light */}
            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400/20 shadow-[0_-20px_50px_rgba(6,182,212,0.1)]" />
          </div>

          {/* Seamless fade to next section */}
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center w-full">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-slate-300 text-xs sm:text-sm">
              <span className="text-cyan-400">Risk Analysis 2.0</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>Now Available</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-medium tracking-tight mb-8 leading-[1.05] max-w-5xl"
          >
            Detect fraud in <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600 font-serif italic pr-2">milliseconds</span>,<br className="hidden sm:block" />
            not after the <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600 font-serif italic pr-2">chargeback</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed"
          >
            Real-time machine learning, behavioral insights, and complete control over your transaction security — all in one platform.
          </motion.p>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&q=80&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&q=80&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&q=80&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&q=80&auto=format&fit=crop",
              ].map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`Team member ${i + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-black object-cover"
                  loading="lazy"
                />
              ))}
            </div>
            <span className="text-sm text-slate-400">Trusted already by <span className="text-white font-medium">1.2k+</span> teams</span>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto"
          >
            <Link href="/signup" className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base rounded-full bg-cyan-600 text-white font-medium shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:bg-cyan-500 transition-all active:scale-95 border border-cyan-400/50">
              Start Securing Smarter
            </Link>
            <button className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-white font-medium hover:bg-white/10 transition-all active:scale-95">
              Explore The Platform
            </button>
          </motion.div>

          {/* --- DASHBOARD UI FIX (Grid Constrained & Upscaled) --- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 40 }}
            className="mt-20 sm:mt-24 relative w-full max-w-6xl z-20"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl -z-10" />
            
            <div className="bg-[#09090b]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
              {/* Rock-Solid CSS Grid wrapper */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Panel */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="flex justify-between items-center bg-white/5 border border-white/5 p-5 rounded-2xl">
                    <div className="text-left">
                      <div className="text-xs text-slate-400 mb-1">Status</div>
                      <div className="text-sm font-medium text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        System Active
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 mb-1">Uptime</div>
                      <div className="text-sm font-medium text-white">99.99%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                      <div className="text-slate-400 text-xs sm:text-sm mb-2">Scanned Today</div>
                      <div className="text-4xl font-light text-white">12.8<span className="text-xl text-slate-500">M</span></div>
                    </div>
                    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                      <div className="text-slate-400 text-xs sm:text-sm mb-2">Threats Blocked</div>
                      <div className="text-4xl font-light text-cyan-400">3,492</div>
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="lg:col-span-7 bg-[#121214] border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col h-72 lg:h-auto">
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-sm text-slate-300 font-medium">Risk Distribution</div>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-cyan-400" />
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div className="w-3 h-3 rounded-full bg-slate-600" />
                    </div>
                  </div>
                  
                  {/* Stable Chart Area */}
                  <div className="flex-1 flex items-end gap-2 sm:gap-4 w-full">
                    {[30, 50, 40, 80, 60, 45, 90, 65, 35, 55].map((h, i) => (
                      <div key={i} className="flex-1 bg-white/5 rounded-t-sm relative group h-full flex items-end">
                        <div 
                          className={`w-full rounded-t-sm transition-all duration-700 ${i === 7 ? 'bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : i === 4 ? 'bg-blue-500' : 'bg-white/10 group-hover:bg-white/20'}`} 
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Floating Tags (Hidden on mobile to prevent overflow breakage) */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -left-6 top-16 hidden xl:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-xl shadow-blue-900/20 rotate-[-6deg] border border-white/10 z-30">
              <span className="text-xs font-semibold">Anomaly Blocked</span>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute -right-4 top-40 hidden xl:flex items-center gap-2 px-4 py-2 bg-cyan-950 text-cyan-400 rounded-xl shadow-xl shadow-cyan-900/20 rotate-[4deg] border border-cyan-500/30 z-30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-tight">Real-time alerts</span>
            </motion.div>

          </motion.div>
        </div>
      </section>

      <SocialProof />

      {/* --- FEATURES SECTION (Reduced top padding) --- */}
      <section className="w-full pt-20 pb-10 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-medium text-white mb-6 tracking-tight">Ensuring complete <span className="font-serif italic text-cyan-400">security</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {valueCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors flex flex-col group"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="p-3 rounded-2xl bg-[#121214] border border-white/5 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <div className="text-3xl font-serif italic text-white/80">{card.value}</div>
                </div>

                <div className="mt-auto">
                  <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">
                    {card.subtitle}
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION (Reduced top padding) --- */}
      <section className="pt-10 pb-32 px-4 sm:px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4 tracking-tight">Transparent pricing</h2>
            <p className="text-slate-500 text-lg">Start free, scale as your volume grows.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 sm:p-10 rounded-[2rem] bg-[#050505] border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-2">Developer</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-medium text-white">$0</span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {['5 Daily API Checks', 'Basic ML Model', 'Email Support'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium text-center transition-colors">
                Sign Up Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 sm:p-10 rounded-[2rem] bg-[#0A0A0C] border border-cyan-500/20 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 mb-8">
                <span className="absolute top-0 right-0 px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-medium border border-cyan-500/20">
                  Most Popular
                </span>
                <h3 className="text-xl font-medium text-white mb-2">Pro Scale</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-medium text-cyan-400">$29</span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>

              <ul className="relative z-10 space-y-4 mb-10 flex-1">
                {['Unlimited Checks', 'Advanced Analytics Dashboard', 'Priority 24/7 Support', 'Custom Webhook Alerts'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-white text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link href="/signup?plan=pro" className="relative z-10 w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-medium text-center transition-colors shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                Upgrade Now
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}