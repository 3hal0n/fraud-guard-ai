"use client";

import { motion } from "framer-motion";

const techStack = [
  { name: "Stripe", color: "text-[#635BFF]" },
  { name: "Shopify", color: "text-[#95BF47]" },
  { name: "Node.js", color: "text-[#339933]" },
  { name: "Python", color: "text-[#3776AB]" },
  { name: "AWS", color: "text-[#FF9900]" },
  { name: "React", color: "text-[#61DAFB]" },
  { name: "PostgreSQL", color: "text-[#336791]" },
  { name: "FastAPI", color: "text-[#009688]" },
];

export default function Integrations() {
  // Duplicating the array to create a seamless infinite loop
  const marqueeItems = [...techStack, ...techStack, ...techStack];

  return (
    <section className="py-20 bg-black border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10">
        <p className="text-sm font-mono tracking-widest text-slate-500 uppercase">
          Engineered to work with your existing stack
        </p>
      </div>

      <div className="relative w-full flex items-center">
        {/* Left/Right Fade Masks */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10" />

        <motion.div
          className="flex gap-8 sm:gap-16 whitespace-nowrap px-8"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {marqueeItems.map((tech, idx) => (
            <div
              key={`${tech.name}-${idx}`}
              className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-default"
            >
              <div className={`w-3 h-3 rounded-full bg-current ${tech.color} shadow-[0_0_10px_currentColor]`} />
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}