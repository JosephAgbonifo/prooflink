"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest } from "@/lib/api";
import { BrandQRCode } from "@/components/qr"; // Ensure path is correct
import {
  ArrowLeft,
  ExternalLink,
  FileCode,
  Package,
  ShieldCheck,
  Printer,
  Download,
  Copy,
  Check,
  QrCode,
} from "lucide-react";

export default function ReceiptPage() {
  const { receiptId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // The verification URL for the QR Code
  const verifyUrl = `https://quirklronchain/verify/verify_receipt/${receiptId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getRequest(`/payments/receipt/${receiptId}`);
        setData(res);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (receiptId) fetchDetails();
  }, [receiptId]);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-moss rounded-full animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          ...Fetching...
        </p>
      </div>
    );

  if (!data) return <div className="p-20 text-center">Receipt not found.</div>;

  const { payment, proof } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-sm font-bold uppercase tracking-tighter"
        >
          <ArrowLeft size={16} /> Back to History
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-moss transition text-sm font-black uppercase tracking-widest shadow-lg shadow-slate-200"
        >
          <Printer size={16} /> Print Receipt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Receipt Card */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 print:shadow-none print:border-none">
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-moss font-black tracking-[0.2em] text-[10px] uppercase mb-2">
                  ISO 20022 Certified
                </p>
                <h1 className="text-2xl font-black font-montserrat uppercase tracking-tighter">
                  Payment Receipt
                </h1>
                <p className="text-white/40 font-mono text-xs mt-2 break-all">
                  ID: {receiptId}
                </p>
              </div>
              <div className="bg-moss/20 border border-moss/30 px-4 py-2 rounded-xl text-right">
                <p className="text-[10px] uppercase font-black text-moss tracking-widest">
                  Status
                </p>
                <p className="font-bold text-white capitalize">
                  {proof.status}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] uppercase text-slate-400 font-black tracking-widest block mb-1">
                  Amount Paid
                </label>
                <p className="text-3xl font-black text-slate-900">
                  {payment.amount}{" "}
                  <span className="text-moss">{payment.currency}</span>
                </p>
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-400 font-black tracking-widest block mb-1">
                  Date Anchored
                </label>
                <p className="text-sm font-bold text-slate-700">
                  {new Date(proof.anchored_at).toLocaleString()}
                </p>
              </div>
            </div>

            <hr className="border-slate-50" />

            {/* Wallet Details */}
            <div className="space-y-4">
              {[
                { label: "Payer Wallet", value: payment.payerWallet },
                { label: "Project ID", value: payment.projectId },
                {
                  label: "Flare TXID",
                  value: proof.flare_txid,
                  color: "text-moss",
                },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    {item.label}
                  </span>
                  <span
                    className={`font-mono text-xs break-all font-bold ${
                      item.color || "text-slate-900"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* ISO Proof Section */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="text-moss" size={18} />
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">
                  ISO 20022 Digital Proof
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:hidden">
                <a
                  href={
                    "https://middleware-iso20022-v1-3.onrender.com" +
                    proof.xml_url
                  }
                  target="_blank"
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-moss transition group"
                >
                  <div className="flex items-center gap-3">
                    <FileCode
                      className="text-slate-300 group-hover:text-moss"
                      size={18}
                    />
                    <span className="text-xs font-bold uppercase tracking-tighter">
                      View ISO XML
                    </span>
                  </div>
                  <ExternalLink size={14} className="text-slate-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: QR Verification (Shows on top on mobile, right on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col items-center text-center">
            <div className="mb-6">
              <BrandQRCode
                value={verifyUrl}
                size={200}
                logoImage="/logo-dark.png" // Center logo for the QR
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center justify-center gap-2">
                <QrCode size={16} className="text-moss" /> Scan to Verify
              </h3>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tighter">
                Scan this code to verify the cryptographic anchor of this
                receipt on the Flare Network.
              </p>
            </div>

            <button
              onClick={copyToClipboard}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-100"
            >
              {copied ? (
                <Check size={14} className="text-moss" />
              ) : (
                <Copy size={14} />
              )}
              {copied ? "Link Copied" : "Copy Verify Link"}
            </button>
          </div>

          <div className="px-6 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-2">
              Powered by
            </p>
            <p className="font-montserrat font-black text-xl text-slate-900 tracking-tighter">
              QUIRKLR <span className="text-moss">ONCHAIN</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\:hidden {
            display: none !important;
          }
          .lg\:col-span-4 {
            margin-top: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
