"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Terminal, ShieldCheck, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-moss to-emerald-400 blur-[120px] rounded-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-16">
        {/* Left content */}
        <div className="flex-1 flex flex-col gap-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 self-center md:self-start px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-moss text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} />
            Payment Anchored onChain
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black font-montserrat text-slate-900 leading-[1.1]">
            Verifiable <span className="text-moss">ISO 20022</span> Payments.
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
            Bridge the gap between blockchain and traditional finance. Create
            unique project pages, collect payments, and generate
            cryptographically anchored receipts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link
              href="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-white font-bold text-base hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-200"
            >
              Start Your Project
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/api"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white border border-slate-200 px-8 py-4 text-slate-600 font-bold text-base hover:bg-slate-50 transition-all"
            >
              <Terminal size={18} />
              Explore API
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center md:justify-start gap-6 pt-4 grayscale opacity-40">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Powered by Flare and Proofrails
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">
              ISO 20022 Compliant
            </span>
          </div>
        </div>

        {/* Right visual */}
        <div className="flex-1 relative w-full flex justify-center md:justify-end">
          <div className="relative w-full max-w-md aspect-square bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl">
            <Image
              src="/hero-illustration.png"
              alt="ProofLink Interface"
              fill
              className="object-cover p-1 rounded-[3rem]"
              priority
            />
          </div>
          {/* Floating Card UI Element */}
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden lg:block animate-bounce-slow">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <ShieldCheck className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Proof Status
                </p>
                <p className="text-sm font-bold text-slate-900">
                  Anchored & Verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Flow Diagram */}
      <div className="mt-24 max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {[
              {
                step: "01",
                title: "Register Project",
                desc: "Define your project ID and wallet on the Flare Network.",
                icon: <Zap className="text-moss" size={24} />,
              },
              {
                step: "02",
                title: "Anchor Payments",
                desc: "Supporters pay in FLR; we generate a public and ISO 20022 compliant proof.",
                icon: <ShieldCheck className="text-moss" size={24} />,
              },
              {
                step: "03",
                title: "Scale with API",
                desc: "Query transaction metadata and proofs programmatically.",
                icon: <Terminal className="text-moss" size={24} />,
              },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="text-4xl font-black text-white/10 font-mono tracking-tighter">
                  {item.step}
                </div>
                <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white font-montserrat">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
