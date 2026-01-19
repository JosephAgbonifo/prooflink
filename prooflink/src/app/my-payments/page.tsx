"use client";

import { useEffect, useState } from "react";
import { getRequest } from "@/lib/api";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Receipt,
  History,
  Wallet,
  Calendar,
  ArrowRight,
} from "lucide-react";

interface Payment {
  _id: string;
  projectId: string;
  payerWallet: string;
  amount: number;
  asset: string;
  proofHash?: string;
  receiptId: string;
  timestamp: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    const fetchPayments = async () => {
      if (!address) return;
      try {
        const res = await getRequest(
          `/payments/get_payments?walletaddress=${address}`
        );
        setPayments(res);
      } catch (err) {
        console.error("Failed to fetch payments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [address]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-moss rounded-full animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          ...Fetching...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-moss font-bold uppercase tracking-widest text-xs mb-2">
            <History size={14} />
            Transactions
          </div>
          <h1 className="text-4xl md:text-5xl font-montserrat font-black text-slate-900">
            Payment <span className="text-moss">History</span>
          </h1>
        </div>
        <p className="text-slate-500 text-sm md:text-base max-w-xs md:text-right">
          Review your ISO 20022 anchored payments on the Flare Network.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
            <Receipt size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            No transactions yet
          </h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            Once you make a payment, your cryptographically anchored receipts
            will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile View (Cards) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {payments.map((payment) => (
              <div
                key={payment._id}
                onClick={() => router.push(`/my-payments/${payment.receiptId}`)}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-transform"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-moss/10 text-moss p-2 rounded-lg">
                    <Receipt size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium uppercase">
                      Amount
                    </p>
                    <p className="font-bold text-slate-900">
                      {payment.amount} {payment.asset}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-slate-600">
                      {new Date(payment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Wallet size={14} className="text-slate-400" />
                    <span className="text-slate-600 font-mono">{`${payment.payerWallet.slice(
                      0,
                      6
                    )}...${payment.payerWallet.slice(-4)}`}</span>
                  </div>
                </div>
                <button className="w-full bg-slate-50 py-3 rounded-xl text-slate-900 font-bold text-sm flex items-center justify-center gap-2">
                  View ISO Receipt <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Desktop View (Table) */}
          <div className="hidden md:block overflow-hidden bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 font-montserrat font-bold text-slate-400 text-xs uppercase tracking-wider">
                    Project
                  </th>
                  <th className="p-6 font-montserrat font-bold text-slate-400 text-xs uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="p-6 font-montserrat font-bold text-slate-400 text-xs uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="p-6 font-montserrat font-bold text-slate-400 text-xs uppercase tracking-wider">
                    Date
                  </th>
                  <th className="p-6 font-montserrat font-bold text-slate-400 text-xs uppercase tracking-wider text-right">
                    Proof
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    onClick={() =>
                      router.push(`/my-payments/${payment.receiptId}`)
                    }
                    className="group border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-all"
                  >
                    <td className="p-6">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-moss transition-colors">
                        {payment.projectId}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">
                        {payment.receiptId}
                      </p>
                    </td>
                    <td className="p-6">
                      <div className="inline-flex items-center bg-moss/5 px-3 py-1 rounded-full">
                        <span className="font-black text-moss text-sm">
                          {payment.amount} {payment.asset}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-sm font-mono text-slate-500">
                      {`${payment.payerWallet.slice(
                        0,
                        8
                      )}...${payment.payerWallet.slice(-6)}`}
                    </td>
                    <td className="p-6 text-sm text-slate-500">
                      {new Date(payment.timestamp).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td
                      className="p-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {payment.proofHash ? (
                        <a
                          href={`https://coston2-explorer.flare.network/tx/${payment.proofHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-moss transition-colors"
                        >
                          FLR SCAN <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300 italic">
                          Processing
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
