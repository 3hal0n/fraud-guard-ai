"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DarkVeil from "../components/DarkVeil";

type CardData = {
  title: string;
  subtitle: string;
  desc: string;
  gradient: string;
  icon: React.ReactNode;
};

const valueCards: CardData[] = [
  {
    title: "Real-time Monitoring",
    subtitle: "Fraud Team",
    desc: "Track suspicious activity with live AI signals, risk clustering, and instant triage recommendations.",
    gradient: "from-teal-500/20 to-cyan-500/20",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h4l3 8 4-16 3 8h4" />
      </svg>
    ),
  },
  {
    title: "Case Intelligence",
    subtitle: "Analysts",
    desc: "Unify device, behavior, and payment evidence into explainable risk narratives your team can act on quickly.",
    gradient: "from-blue-500/20 to-indigo-500/20",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h5m-5-4V5m0 14l-3-3m3 3l3-3M5 7h4" />
      </svg>
    ),
  },
  {
    title: "Automated Decisions",
    subtitle: "Operations",
    desc: "Ship safe approvals with rule + model orchestration and customizable thresholds for every transaction flow.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-hidden">
      <section className="relative w-full min-h-screen overflow-hidden selection:bg-teal-500/30">
        <svg className="absolute z-0 w-full -mt-40 md:mt-0" width="1440" height="676" viewBox="0 0 1440 676" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="-92" y="-948" width="1624" height="1624" rx="812" fill="url(#circleGradient)" className="hero-circle-rect" />
          <defs>
            <radialGradient id="circleGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 428 292)scale(812)">
              <stop offset=".63" stopColor="#0f172a" stopOpacity="0" />
              <stop offset="0.9" stopColor="#14b8a6" stopOpacity="0.22" />
              <stop offset="1" stopColor="#14b8a6" stopOpacity="0.38" />
            </radialGradient>
          </defs>
        </svg>

        <style>{`
          .hero-circle-rect{fill-opacity:0.45}
          @media (max-width: 640px){
            .hero-circle-rect{fill-opacity:0.82}
          }
        `}</style>

        <div className="absolute inset-x-0 -top-28 sm:-top-56 h-[30vh] sm:h-[50vh] z-0 pointer-events-none">
          <DarkVeil
            hueShift={8}
            noiseIntensity={0.28}
            scanlineIntensity={0.05}
            speed={0.4}
            scanlineFrequency={0.011}
            warpAmount={0.06}
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 md:pt-40 pb-20 sm:pb-28 md:pb-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-200 text-xs sm:text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              New: AI Risk Analysis 2.0
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-[1.1] px-4"
          >
            Detect Fraud in Milliseconds,
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              not After the Chargeback.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mb-8 sm:mb-10 leading-relaxed px-4"
          >
            FraudGuard AI combines machine learning, behavioral insights, and policy automation to block risky transactions before revenue is lost.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full sm:w-auto px-4"
          >
            <Link href="/signup" className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-full bg-teal-500 text-navy-950 font-semibold shadow-[0_0_40px_-10px_rgba(20,184,166,0.5)] hover:bg-teal-400 transition-all hover:scale-105 active:scale-95">
              <span className="flex items-center gap-2">
                Start Free Trial
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>

            <button className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white font-medium hover:bg-white/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 20 20">
                <path d="M6 4l10 6-10 6V4z" />
              </svg>
              View Live Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            className="mt-12 sm:mt-16 md:mt-20 relative w-full max-w-5xl px-4"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-teal-500/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative bg-[#0F1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10 text-left">
              <div className="h-10 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                <div className="ml-4 px-3 py-1 bg-black/40 rounded-md text-[10px] text-slate-500 font-mono">fraudguard.ai/live-monitor</div>
              </div>

              <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="hidden lg:flex flex-col gap-4 col-span-1 border-r border-white/5 pr-6">
                  <div className="h-8 w-36 bg-white/10 rounded animate-pulse" />
                  <div className="space-y-3 mt-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-6 w-full bg-white/5 rounded" />
                    ))}
                  </div>
                  <div className="mt-auto h-20 w-full bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded border border-teal-500/20 p-4">
                    <div className="h-2 w-16 bg-teal-500/40 rounded mb-2" />
                    <div className="h-4 w-24 bg-teal-500/20 rounded" />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                    <div>
                      <div className="text-xs sm:text-sm text-slate-400 mb-1">Transactions Screened Today</div>
                      <div className="text-2xl sm:text-3xl font-bold text-white">128,442</div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm rounded-full border border-emerald-500/20 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      1,392 threats blocked
                    </div>
                  </div>

                  <div className="h-40 w-full bg-gradient-to-b from-white/5 to-transparent rounded-lg border border-white/5 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10" />
                    <svg className="absolute bottom-0 left-0 w-full h-full text-teal-500/20" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path d="M0 40 L0 33 C8 34 12 28 20 27 C28 26 34 14 42 18 C50 22 58 8 66 12 C74 16 82 6 90 11 C95 13 100 10 100 10 L100 40 Z" fill="currentColor" />
                      <path d="M0 33 C8 34 12 28 20 27 C28 26 34 14 42 18 C50 22 58 8 66 12 C74 16 82 6 90 11 C95 13 100 10 100 10" fill="none" stroke="#14b8a6" strokeWidth="0.5" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                      <svg className="w-5 h-5 text-teal-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs text-slate-400">Portfolio Risk Score</div>
                      <div className="text-lg font-semibold">Low (11%)</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 mb-2 border border-cyan-500/30" />
                      <div className="text-xs text-slate-400">Chargeback Exposure</div>
                      <div className="text-lg font-semibold">-$22,840 prevented</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-12 sm:py-16 md:py-24 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {valueCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 50 }}
                className="group relative h-full"
              >
                <div className="relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-[#0B0D10] border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-2xl hover:shadow-teal-900/10 active:scale-[0.98]">
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${card.gradient} blur-3xl`} />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </div>
                      <span className="px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium tracking-wide text-slate-400 uppercase bg-white/5 rounded-full border border-white/5">
                        {card.subtitle}
                      </span>
                    </div>

                    <div className="mb-auto">
                      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3 tracking-tight group-hover:text-teal-100 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-sm sm:text-[15px]">
                        {card.desc}
                      </p>
                    </div>

                    <div className="pt-6 sm:pt-8 mt-3 sm:mt-4 flex items-center text-xs sm:text-sm font-medium text-white/40 group-hover:text-white transition-colors cursor-pointer">
                      <span>Learn more</span>
                      <svg className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-500 text-lg">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Starter Plan */}
            <div className="glass rounded-2xl p-8 ring-1 ring-slate-700/60">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-foreground mb-2">Free Starter</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground">$0</span>
                  <span className="text-slate-500">/ month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-400">5 Daily Checks</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-400">Basic Support</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-400">Email Support</span>
                </li>
              </ul>

              <Link
                href="/signup"
                className="block w-full px-6 py-3 bg-navy-800 hover:bg-navy-700 text-foreground rounded-lg font-semibold text-center transition-all"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Pro Scale Plan */}
            <div className="glass rounded-2xl p-8 ring-2 ring-teal-500/50 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-teal-500 text-navy-950 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-foreground mb-2">Pro Scale</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-teal-400">$29</span>
                  <span className="text-slate-500">/ month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground font-medium">Unlimited Checks</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground font-medium">Advanced Analytics Dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground font-medium">Priority Support</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground font-medium">Custom Alerts</span>
                </li>
              </ul>

              <Link
                href="/signup?plan=pro"
                className="block w-full px-6 py-3 bg-teal-500 hover:bg-teal-600 text-navy-950 rounded-lg font-semibold text-center transition-all shadow-lg shadow-teal-500/30"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
