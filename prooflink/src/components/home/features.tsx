"use client";

import { FileCheck, Shield, Zap, Globe, Cpu, Lock } from "lucide-react";

const features = [
  {
    title: "ISO 20022 Structure",
    desc: "Every receipt is generated as a structured XML file, meeting the global standard for financial messaging.",
    icon: <FileCheck className="text-moss" size={24} />,
  },
  {
    title: "State Connector Proofs",
    desc: "Leverage Flare's State Connector to verify that payments actually occurred on-chain without trusting a middleman.",
    icon: <Shield className="text-moss" size={24} />,
  },
  {
    title: "Instant API Hooks",
    desc: "Trigger external workflows, ship products, or unlock content the second a payment is anchored.",
    icon: <Zap className="text-moss" size={24} />,
  },
  {
    title: "Immutable Receipts",
    desc: "Proofs are stored using IPFS and anchored on Flare, making them permanent and tamper-proof.",
    icon: <Lock className="text-moss" size={24} />,
  },
  {
    title: "Zero-Setup Projects",
    desc: "Start accepting payments in under 60 seconds with our hosted project pages. No coding required.",
    icon: <Cpu className="text-moss" size={24} />,
  },
  {
    title: "Global Interoperability",
    desc: "Your payment data is ready for the future of CBDCs and institutional finance bridges.",
    icon: <Globe className="text-moss" size={24} />,
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black text-moss uppercase tracking-[0.3em] mb-4">
            The Protocol
          </h2>
          <p className="text-4xl font-black text-slate-900 font-montserrat tracking-tight">
            Engineered for the next generation of financial transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-moss/10 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-montserrat">
                {f.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
