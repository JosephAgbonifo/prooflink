"use client";

import Link from "next/link";
import { Terminal, ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function DeveloperCTA() {
  // Animation Variants
  const contentVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const codeVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-slate-900 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative"
        >
          {/* Subtle glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-moss/10 blur-[100px] pointer-events-none" />

          {/* Content */}
          <motion.div
            variants={contentVariants}
            className="flex-1 space-y-6 z-10"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white font-montserrat tracking-tight">
              Built for <span className="text-moss">Automation.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Integrate verifiable ISO 20022 proofs into your own apps. Our API
              allows you to query transaction metadata and automate fulfillment
              in real-time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/api"
                className="bg-moss text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
              >
                Read API Docs <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Code Window */}
          <motion.div
            variants={codeVariants}
            className="flex-1 w-full lg:max-w-md z-10"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-[#0d1117] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                </div>
                <Terminal size={14} className="text-slate-500" />
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed">
                <p className="text-emerald-400">
                  GET{" "}
                  <span className="text-slate-300">/v1/payments/get_all</span>
                </p>
                <p className="text-slate-500 mt-2">// Response</p>
                <p className="text-slate-300">{"{"}</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-slate-300 ml-4"
                >
                  "status": <span className="text-amber-300">"anchored"</span>,
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-slate-300 ml-4"
                >
                  "standard":{" "}
                  <span className="text-amber-300">"ISO-20022"</span>
                </motion.p>
                <p className="text-slate-300">{"}"}</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
