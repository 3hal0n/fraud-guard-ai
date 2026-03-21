"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  const currentYear = new Date().getFullYear();

  const productLinks = ["Features", "Pricing", "API Docs", "Dashboard"];
  const companyLinks = ["About", "Blog", "Careers", "Contact"];
  const legalLinks = ["Privacy Policy", "Terms of Service", "Security", "Status"];

  return (
    <footer className="relative mt-16 sm:mt-24 md:mt-32 w-full bg-black border-t border-cyan-500/10 overflow-hidden">
      {/* Background Texture (Subtle Grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#22d3ee1f_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee1f_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-12">
        {/* Main Top Section: CTA + Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 mb-12 sm:mb-16 md:mb-20">
          {/* Left: Brand & Newsletter */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 sm:mb-6"
              >
                Stay ahead of <br />
                <span className="text-slate-500">fraud threats</span>
              </motion.h2>
              <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8 max-w-sm leading-relaxed">
                Join 1,000+ businesses safeguarding their transactions with
                AI-powered fraud detection. Get real-time alerts and insights.
              </p>

              {/* Newsletter Input */}
              <div className="flex items-center gap-2 w-full max-w-sm">
                <div className="relative flex-1 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="relative w-full bg-[#0B0D10] text-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-white/10 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-slate-600"
                  />
                </div>
                <button className="p-2.5 sm:p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/5 active:scale-95 flex-shrink-0">
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Column 1: Product */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                {productLinks.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="group flex items-center text-sm sm:text-base text-slate-400 hover:text-teal-400 transition-colors active:scale-95"
                    >
                      <span className="relative">
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-400 transition-all group-hover:w-full" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Company */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                {companyLinks.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-slate-400 hover:text-teal-400 transition-colors active:scale-95"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                {legalLinks.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-slate-400 hover:text-teal-400 transition-colors active:scale-95"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-xs sm:text-sm text-center md:text-left">
            © {currentYear} FraudGuard AI. All rights reserved.
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <SocialIcon icon={MailIcon} label="Email" href="mailto:support@fraudguardai.com" />
            <SocialIcon icon={GithubIcon} label="GitHub" href="#" />
            <SocialIcon icon={TwitterIcon} label="Twitter" href="#" />
            <SocialIcon icon={LinkedinIcon} label="LinkedIn" href="#" />
          </div>
        </div>
      </div>

      {/* Massive Watermark (Clipped) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 pointer-events-none select-none block">
        <h1 className="text-[5rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold text-cyan-400/12 tracking-tighter leading-none whitespace-nowrap">
          FraudGuard
        </h1>
      </div>
    </footer>
  );
}

// Helper Component for Social Icons
interface SocialIconProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

function SocialIcon({ icon: Icon, label, href }: SocialIconProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className="p-2 rounded-full text-slate-400 hover:text-teal-400 hover:bg-white/5 transition-all active:scale-90"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l9 6 9-6m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008 10.93c.58.1.79-.25.79-.56v-2.18c-3.25.7-3.93-1.39-3.93-1.39-.53-1.34-1.29-1.7-1.29-1.7-1.05-.71.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.73-1.54-2.6-.29-5.34-1.3-5.34-5.8 0-1.28.46-2.33 1.2-3.15-.12-.3-.52-1.5.12-3.13 0 0 .98-.31 3.2 1.2A11.1 11.1 0 0112 6.1c.98 0 1.97.13 2.9.38 2.22-1.5 3.2-1.2 3.2-1.2.64 1.63.24 2.83.12 3.13.75.82 1.2 1.87 1.2 3.15 0 4.5-2.74 5.5-5.36 5.79.42.36.79 1.08.79 2.19v3.24c0 .31.2.66.8.55A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.9 2H22l-6.77 7.74L23 22h-6.1l-4.77-6.24L6.67 22H3.55l7.24-8.27L1 2h6.24l4.31 5.7L18.9 2zm-1.07 18h1.69L6.3 3.89H4.5L17.83 20z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.49 6S0 4.88 0 3.5 1.12 1 2.49 1s2.49 1.12 2.49 2.5zM.5 8h4V23h-4V8zm7 0h3.84v2.05h.06c.54-1.02 1.84-2.1 3.79-2.1 4.05 0 4.8 2.66 4.8 6.12V23h-4v-7.9c0-1.88-.03-4.3-2.62-4.3-2.63 0-3.03 2.06-3.03 4.17V23h-4V8z" />
    </svg>
  );
}
