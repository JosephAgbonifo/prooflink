"use client";

import { useEffect, useState } from "react";
import { getRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ExternalLink, Users, Calendar, ArrowRight } from "lucide-react";

interface PaymentRecord {
  receiptId: string;
  payerWallet: string;
  amount: number;
  createdAt: string;
  currency: string;
}

export default function ProjectContributions({
  projectId,
}: {
  projectId: string;
}) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Updated endpoint to match your request
        const response = await getRequest(`/payments/${projectId}`);
        setPayments(response || []);
      } catch (err) {
        console.error("Failed to load payments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchPayments();
  }, [projectId]);

  if (loading)
    return (
      <div className="mt-12 text-center text-slate-400 animate-pulse font-bold uppercase tracking-widest text-xs">
        Loading Contributions...
      </div>
    );
  if (payments.length === 0) return null; // Hide if no payments yet

  return (
    <div className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-900 font-montserrat flex items-center gap-3">
          <Users className="text-moss" size={24} />
          Community Supporters
        </h2>
        <span className="bg-slate-100 px-4 py-1 rounded-full text-xs font-black text-slate-500 uppercase tracking-widest">
          {payments.length} Contributions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {payments.map((pay) => (
          <div
            key={pay.receiptId}
            onClick={() => router.push(`/my-payments/${pay.receiptId}`)}
            className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-moss hover:shadow-xl hover:shadow-moss/5 transition-all cursor-pointer relative overflow-hidden"
          >
            {/* Hover Accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-moss opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-1">
              <p className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                From:{" "}
                {pay.payerWallet
                  ? `${pay.payerWallet.slice(0, 6)}...${pay.payerWallet.slice(
                      -4
                    )}`
                  : "Unknown"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 font-montserrat">
                  {pay.amount.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-moss uppercase tracking-widest">
                  {pay.currency}
                </span>
              </div>
              <p className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <Calendar size={12} />{" "}
                {new Date(pay.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-moss group-hover:text-white transition-colors">
              <ArrowRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
