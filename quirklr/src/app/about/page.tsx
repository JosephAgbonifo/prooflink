"use client";

import {
  ShieldCheck,
  Globe,
  Layers,
  Cpu,
  Zap,
  Network,
  FileCode,
  Lock,
  Search,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 space-y-32">
      {/* 1. ARCHITECTURAL VISION */}
      <section className="relative">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-moss/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-moss font-black uppercase tracking-[0.3em] text-[10px] mb-6">
            <Network size={14} /> Protocol Architecture
          </div>
          <h1 className="text-5xl md:text-7xl font-montserrat font-black text-slate-900 leading-[1.1] mb-8 italic">
            Standardizing <span className="text-moss">Value</span>.
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            Quirklr is a layer-2 metadata protocol for the Flare Network. It
            solves the "Anonymous Transaction Problem" by wrapping raw
            blockchain transfers in **ISO 20022 compliant data structures**,
            providing the first auditable link between Web3 liquidity and TradFi
            reporting.
          </p>
        </div>
      </section>

      {/* 2. THE PROBLEM & SOLUTION (HIGH DETAIL) */}
      <section className="grid md:grid-cols-2 gap-12">
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl border border-slate-800">
          <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2">
            <Lock size={18} /> The TradFi Gap
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Currently, blockchain payments lack context. A hash like{" "}
            <code className="text-slate-200 bg-white/5 px-1">0xaf2...</code>{" "}
            tells a bank nothing about the purpose, project, or compliance
            status of the funds. This makes institutional adoption nearly
            impossible.
          </p>
          <div className="h-px bg-slate-800 w-full mb-6" />
          <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
            <Zap size={18} /> The Quirklr Fix
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Quirklr intercepts transaction events and generates a{" "}
            <strong>Cryptographic Receipt</strong>. This receipt binds the
            transaction hash to an ISO 20022 XML structure, making the payment
            instantly recognizable by global banking software (SAP, SWIFT,
            Oracle).
          </p>
        </div>

        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-moss uppercase tracking-widest">
              Present Capabilities
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-700 font-medium">
                <div className="mt-1 bg-moss/20 p-1 rounded-full">
                  <ShieldCheck size={12} className="text-moss" />
                </div>
                Multi-Asset Settlement (C2FLR, USDT, FXRP) with automated
                decimal normalization.
              </li>
              <li className="flex items-start gap-3 text-slate-700 font-medium">
                <div className="mt-1 bg-moss/20 p-1 rounded-full">
                  <ShieldCheck size={12} className="text-moss" />
                </div>
                Developer SDK for on-chain payment verification using unique API
                keys.
              </li>
              <li className="flex items-start gap-3 text-slate-700 font-medium">
                <div className="mt-1 bg-moss/20 p-1 rounded-full">
                  <ShieldCheck size={12} className="text-moss" />
                </div>
                Real-time fundraising progress tracking via indexed sub-graphs.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. TECHNICAL DEEP DIVE (THE HACKATHON "WOW" FACTOR) */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-montserrat font-black text-slate-900">
            How It Works
          </h2>
          <p className="text-slate-500">The lifecycle of a verified payment.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "1. Event Emission",
              desc: "User triggers a transfer. Our listener captures the 0x event and relevant metadata (ProjectID, Payer, Ref).",
              icon: <Zap />,
            },
            {
              title: "2. ISO Mapping",
              desc: "Raw data is mapped to the ISO 20022 'pain.001' schema, defining the purpose of the payment.",
              icon: <FileCode />,
            },
            {
              title: "3. Cryptographic Anchor",
              desc: "A SHA-256 hash of the full message is generated and stored, creating a permanent proof of intent.",
              icon: <Layers />,
            },
          ].map((step, i) => (
            <div
              key={i}
              className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-moss mb-6">
                {step.icon}
              </div>
              <h4 className="font-black text-slate-900 mb-2">{step.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FUTURE POTENTIAL (SCALABILITY) */}
      <section className="space-y-12 bg-slate-50 rounded-[4rem] p-12 md:p-20 border border-slate-100">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="text-4xl font-montserrat font-black text-slate-900 leading-tight">
              Future <br /> <span className="text-moss">Potentials</span>
            </h2>
            <p className="text-slate-500 mt-4 text-sm font-medium">
              Scaling Quirklr into a cross-chain verification powerhouse.
            </p>
          </div>
          <div className="md:w-2/3 grid sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-black text-slate-900 text-sm tracking-tight">
                <Globe className="text-moss" size={18} /> Cross-Chain FDC
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Utilizing the <strong>Flare Data Connector</strong> to verify
                payments on Bitcoin and XRP Ledger, bringing ISO 20022
                compliance to non-EVM chains.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-black text-slate-900 text-sm tracking-tight">
                <ShieldCheck className="text-moss" size={18} /> ZK-Privacy
                Proofs
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Integrating Zero-Knowledge proofs to allow users to verify their
                "Payer Status" without revealing their wallet balance or
                transaction history to the public.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-black text-slate-900 text-sm tracking-tight">
                <Cpu className="text-moss" size={18} /> Automated XML Generation
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                A one-click export for accountants to download a{" "}
                <strong>pain.001.001.03</strong> XML file directly for ingestion
                into institutional bank portals.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-black text-slate-900 text-sm tracking-tight">
                <Search className="text-moss" size={18} /> Public Proof Explorer
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                A dedicated search engine for "Receipt IDs" where anyone can
                verify the cryptographic anchor of a payment without needing a
                crypto wallet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="text-center py-20">
        <h2 className="text-4xl font-montserrat font-black text-slate-900 mb-8">
          Ready to Build on Quirklr?
        </h2>
        <div className="flex justify-center gap-6">
          <button className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-moss transition-all">
            Get API Key
          </button>
          <button className="bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
            Read Whitepaper
          </button>
        </div>
      </section>
    </div>
  );
}
