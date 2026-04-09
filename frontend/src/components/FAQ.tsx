"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How does the < 85ms latency work?",
    a: "Our XGBoost inference engine is optimized in C++ and deployed on edge nodes globally. When you ping our API, the request is routed to the nearest geographic cluster, ensuring near-zero friction in your checkout flow."
  },
  {
    q: "What happens if the FraudGuard API goes down?",
    a: "We practice 'fail-open' architecture. In the highly unlikely event of an outage, our SDK will automatically default to approving the transaction so your revenue stream is never interrupted by our systems."
  },
  {
    q: "Does FraudGuard AI train on my customer data?",
    a: "No. Your data is your own. We use anonymized PCA feature vectors for global threat detection, meaning your specific user PII (names, emails, raw card numbers) is never used to train global models."
  },
  {
    q: "Can I customize what gets blocked?",
    a: "Yes. Pro users have full access to our Rules Engine. You can set custom SHAP thresholds (e.g., 'Block if Risk > 85% AND Location = Mismatch') to tailor the AI to your specific business risk tolerance."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  return (
    <section id="faq" className="py-24 bg-black border-t border-white/5 relative z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">Technical FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight mb-4">
            Common Inquiries
          </h2>
          <p className="text-slate-500">Everything you need to know about integrating FraudGuard AI.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`group bg-[#0A0A0C] border transition-colors rounded-2xl overflow-hidden ${isOpen ? 'border-cyan-500/30' : 'border-white/5 hover:border-white/10'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-6 py-5 text-left text-white font-medium flex justify-between items-center select-none"
                >
                  {faq.q}
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-6 h-6 flex items-center justify-center rounded-full border ${isOpen ? 'border-cyan-500 text-cyan-400' : 'border-white/10 text-slate-500'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed pt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}