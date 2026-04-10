"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SocialProof from "@/components/SocialProof";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";

type CardData = {
  title: string;
  category: string;
  desc: string;
  icon: React.ReactNode;
  highlight: string;
};

// Core Platform Capabilities
const platformFeatures: CardData[] = [
  {
    title: "Developer API Hub",
    category: "Integration",
    desc: "Drop our REST API into your checkout flow. Score transactions and trigger webhooks before the payment processor is even pinged.",
    highlight: "< 85ms Latency",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "SHAP Explainability",
    category: "Intelligence",
    desc: "Stop guessing why a transaction was blocked. FraudGuard AI provides granular, per-factor driver analysis for every single risk score.",
    highlight: "White-box ML",
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Bulk CSV Auditing",
    category: "Historical Data",
    desc: "Backtest your risk thresholds. Upload millions of legacy transaction records to identify missed fraud rings and optimize your rules engine.",
    highlight: "10k Rows / Min",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Global Threat Map",
    category: "Geospatial",
    desc: "Visualize attacks in real-time. Track high-risk IPs and merchant location mismatches on an interactive, dark-mode cartography dashboard.",
    highlight: "Live Tracking",
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

// Enterprise Security Capabilities
const securityCards = [
  {
    title: "Zero-Knowledge Architecture",
    desc: "We never store raw PII or credit card numbers. Data is instantly converted into PCA-anonymized feature vectors before hitting our inference engine.",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Global Compliance",
    desc: "Built from the ground up to exceed GDPR, CCPA, and SOC 2 Type II standards. Your data sovereignty is guaranteed by isolated processing regions.",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Multi-Region Failover",
    desc: "Backed by edge-deployed inference nodes. We guarantee a 99.999% SLA so your checkout flow never drops a legitimate transaction.",
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans selection:bg-cyan-500/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-screen flex flex-col items-center pt-24 pb-16 sm:pt-32">
        <div className="absolute inset-0 z-0 flex items-start justify-center pointer-events-none overflow-hidden">
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

          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] sm:w-[1200px] sm:h-[1200px] rounded-full border border-white/5 bg-gradient-to-b from-black to-cyan-950/20 shadow-[inset_0_0_120px_rgba(6,182,212,0.15)] flex items-end justify-center [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
            <div className="w-[80%] h-[40%] bg-cyan-500/20 blur-[120px] rounded-full" />
            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400/20 shadow-[0_-20px_50px_rgba(6,182,212,0.1)]" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center w-full">
          
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="mb-8">
             
          </motion.div>

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
            FraudGuard AI combines real-time machine learning, SHAP explainability, and completely customizable risk thresholds to protect your bottom line.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&q=80&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&q=80&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&q=80&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&q=80&auto=format&fit=crop",
              ].map((src, i) => (
                <img key={src} src={src} alt={`Team member ${i + 1}`} className="w-8 h-8 rounded-full border-2 border-black object-cover" loading="lazy" />
              ))}
            </div>
            <span className="text-sm text-slate-400">Trusted by <span className="text-white font-medium">1.2k+</span> engineering teams</span>
          </motion.div>

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
              View Documentation
            </button>
          </motion.div>

          {/* --- DASHBOARD UI MOCKUP --- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 40 }}
            className="mt-20 sm:mt-24 relative w-full max-w-6xl z-20"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl -z-10" />
            
            <div className="bg-[#09090b]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
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
                      <div className="text-xs text-slate-400 mb-1">Inference Engine</div>
                      <div className="text-sm font-medium text-white">XGBoost v2.1</div>
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

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -left-6 top-16 hidden xl:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-xl shadow-blue-900/20 rotate-[-6deg] border border-white/10 z-30">
              <span className="text-xs font-semibold">Anomaly Blocked</span>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute -right-4 top-40 hidden xl:flex items-center gap-2 px-4 py-2 bg-cyan-950 text-cyan-400 rounded-xl shadow-xl shadow-cyan-900/20 rotate-[4deg] border border-cyan-500/30 z-30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-tight">API Live</span>
            </motion.div>

          </motion.div>
        </div>
      </section>

      <SocialProof />

      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* --- PLATFORM CAPABILITIES (Bento Grid) --- */}
      <section id="features" className="w-full pt-20 pb-20 bg-black relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">Platform Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium text-white mb-6 tracking-tight">
              Everything you need to <span className="font-serif italic text-cyan-400">stop fraud.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformFeatures.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 sm:p-10 rounded-[2rem] bg-white/[0.02] backdrop-blur-md border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all flex flex-col group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="p-3 rounded-2xl bg-[#121214] border border-white/10 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all">
                    {card.icon}
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-slate-300">
                    {card.highlight}
                  </div>
                </div>

                <div className="mt-auto relative z-10">
                  <div className="text-[10px] font-bold tracking-widest text-cyan-500 uppercase mb-3">
                    {card.category}
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-3">
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

      {/* --- ENTERPRISE SECURITY SECTION (New) --- */}
      <section id="security" className="w-full pt-24 pb-24 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-12 items-end mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2" />
                <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">Enterprise Grade</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-medium text-white tracking-tight">
                Engineered for <span className="font-serif italic text-cyan-400">Compliance.</span>
              </h2>
            </div>
            <p className="text-slate-400 text-base md:text-lg max-w-lg mb-2">
              FraudGuard AI is designed with privacy-first architecture. We secure your transactions without compromising your users&apos; sensitive data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-[#0A0A0C] border border-white/5 hover:border-white/10 transition-colors flex flex-col group relative overflow-hidden"
              >
                {/* Subtle top glow line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-3 rounded-2xl bg-white/5 inline-flex w-fit mb-8 border border-white/5 group-hover:bg-white/10 transition-colors">
                  {card.icon}
                </div>

                <h3 className="text-xl font-medium text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="pt-10 pb-32 px-4 sm:px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4 tracking-tight">Transparent pricing</h2>
            <p className="text-slate-500 text-lg">Start free, scale as your volume grows.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 sm:p-10 rounded-[2rem] bg-[#0A0A0C] border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-2">Developer</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-medium text-white">$0</span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {['100 API Scans / month', 'Standard ML Inference', 'Dashboard Access'].map((feat, i) => (
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
            <div className="p-8 sm:p-10 rounded-[2rem] bg-[#0A0A0C] border border-cyan-500/20 flex flex-col h-full relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)]">
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
                {['10,000 API Scans / month', 'SHAP Explainability Insights', 'Bulk CSV Auditing', 'Global Threat Map Access'].map((feat, i) => (
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

      {/* --- FAQ --- */}
      <FAQ />

      {/* --- FINAL CTA --- */}
      <div id="final-cta" />
    </div>
  );
}