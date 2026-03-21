"use client";

import { motion } from "framer-motion";

type Brand = {
  name: string;
  icon: React.ReactNode;
};

const brands: Brand[] = [
  {
    name: "NovaBank",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    name: "PulsePay",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12h4l2-5 4 10 2-5h4" />
      </svg>
    ),
  },
  {
    name: "Cobalt Commerce",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="8" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    name: "Atlas Retail",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7h16" />
        <path d="M6 7l1 12h10l1-12" />
      </svg>
    ),
  },
  {
    name: "Orbit FinTech",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <ellipse cx="12" cy="12" rx="8" ry="4" />
      </svg>
    ),
  },
  {
    name: "Summit Wallet",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="7" width="18" height="10" rx="2" />
        <path d="M16 12h2" />
      </svg>
    ),
  },
];

export default function SocialProof() {
  const looped = [...brands, ...brands];

  return (
    <section className="relative w-full py-5 sm:py-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <h3 className="mb-4 text-center text-[10px] sm:text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
          Trusted by fraud teams at leading digital brands
        </h3>

        <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-24 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-24 bg-gradient-to-l from-black to-transparent" />

          <motion.div
            className="flex w-max items-center gap-10 sm:gap-14"
            animate={{ x: "-50%" }}
            transition={{ duration: 26, ease: "linear", repeat: Infinity }}
          >
            {looped.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="group flex items-center gap-2 text-slate-500 transition-colors duration-300 hover:text-cyan-300"
              >
                <span className="rounded-lg border border-white/10 bg-white/5 p-1.5">{brand.icon}</span>
                <span className="text-sm sm:text-base font-semibold tracking-tight whitespace-nowrap">
                  {brand.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
