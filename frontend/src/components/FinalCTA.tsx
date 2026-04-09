"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="relative py-32 bg-black overflow-hidden border-t border-white/5">
      {/* Background Gradients & Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-950/20 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl font-medium text-white mb-6 tracking-tight leading-[1.1]"
        >
          Ready to secure your <span className="font-serif italic text-cyan-400">transactions?</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto"
        >
          Join the hundreds of engineering teams using FraudGuard AI to eliminate chargebacks and protect their bottom line.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link href="/signup" className="w-full sm:w-auto px-8 py-4 text-base rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all active:scale-95 border border-cyan-400/50">
            Create Free Account
          </Link>
          <Link href="/contact" className="w-full sm:w-auto px-8 py-4 text-base rounded-full border border-white/10 bg-[#0A0A0C] text-white font-medium hover:bg-white/10 transition-all active:scale-95">
            Contact Sales
          </Link>
        </motion.div>
      </div>
    </section>
  );
}