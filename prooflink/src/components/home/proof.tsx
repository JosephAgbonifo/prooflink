"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ArrowUpRight, Clock, Box } from "lucide-react";

interface LivePayment {
  id: string;
  projectTitle: string;
  amount: number;
  currency: string;
  timestamp: string;
  txHash: string;
}

export default function LiveFeed() {
  const [payments, setPayments] = useState<LivePayment[]>([]);

  // Simulate live incoming data (Swap with your API polling)
  useEffect(() => {
    const mockData: LivePayment[] = [
      {
        id: "1",
        projectTitle: "Carbon Offset Initiative",
        amount: 450.0,
        currency: "FLR",
        timestamp: "2 mins ago",
        txHash: "0x4a...2b",
      },
      {
        id: "2",
        projectTitle: "Web3 Education Fund",
        amount: 1200.0,
        currency: "FLR",
        timestamp: "5 mins ago",
        txHash: "0x8f...1c",
      },
      {
        id: "3",
        projectTitle: "Solar Farm Coston2",
        amount: 75.5,
        currency: "FLR",
        timestamp: "12 mins ago",
        txHash: "0x2d...9e",
      },
      {
        id: "4",
        projectTitle: "Open Source Grants",
        amount: 300.0,
        currency: "FLR",
        timestamp: "18 mins ago",
        txHash: "0x9a...3f",
      },
    ];
    setPayments(mockData);
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-rose-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-3">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Live Activity
            </div>
            <h2 className="text-4xl font-black text-slate-900 font-montserrat tracking-tight">
              Proof of Truth Feed
            </h2>
            <p className="mt-4 text-slate-500 font-medium">
              Real-time cryptographic proofs of ISO 20022 payments being
              anchored to the Flare network.
            </p>
          </div>
          <button className="text-xs font-bold text-moss hover:bg-moss/5 px-4 py-2 rounded-full border border-moss/20 transition-all">
            View All Transactions
          </button>
        </div>

        {/* The Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {payments.map((pay) => (
            <div
              key={pay.id}
              className="group bg-slate-50 border border-slate-100 p-5 rounded-[2rem] hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-default"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm group-hover:bg-moss group-hover:text-white transition-colors">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    Amount
                  </span>
                  <span className="text-lg font-black text-slate-900 leading-none">
                    {pay.amount}{" "}
                    <span className="text-xs text-moss">{pay.currency}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-moss transition-colors">
                  {pay.projectTitle}
                </h3>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={12} />
                    {pay.timestamp}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Box size={12} />
                    {pay.txHash}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={`https://coston2-explorer.flare.network/tx/${pay.txHash}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-moss"
                >
                  Verify on Explorer <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Stat */}
        <div className="mt-12 p-8 rounded-[2.5rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Total Verified
              </p>
              <p className="text-3xl font-black font-montserrat tracking-tighter text-moss">
                100+
              </p>
            </div>
            <div className="w-[1px] h-10 bg-slate-800" />
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Payment Proofs Anchored
              </p>
              <p className="text-3xl font-black font-montserrat tracking-tighter text-white">
                500+
              </p>
            </div>
          </div>
          <p className="text-slate-400 text-xs font-medium max-w-sm text-center md:text-right">
            Every transaction above represents a cryptographically signed ISO
            20022 message validated and anchored onchain.
          </p>
        </div>
      </div>
    </section>
  );
}
