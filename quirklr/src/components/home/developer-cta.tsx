"use client";

import Link from "next/link";
import { Terminal, Copy, ArrowRight } from "lucide-react";

export default function DeveloperCTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
          {/* Content */}
          <div className="flex-1 space-y-6 z-10">
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
          </div>

          {/* Code Window */}
          <div className="flex-1 w-full lg:max-w-md z-10">
            <div className="bg-[#0d1117] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
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
                <p className="text-slate-300 ml-4">
                  "status": <span className="text-amber-300">"anchored"</span>,
                </p>
                <p className="text-slate-300 ml-4">
                  "standard":{" "}
                  <span className="text-amber-300">"ISO-20022"</span>
                </p>
                <p className="text-slate-300">{"}"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
