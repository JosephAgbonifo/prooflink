"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest } from "@/lib/api";
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
} from "lucide-react";

export default function ReceiptPage() {
  const { receiptId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    // Construct the full URL
    const paymentLink = `${receiptId}`;

    try {
      await navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      // Reset icon after 2 seconds
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

  const handlePrint = () => {
    window.print();
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse">
        Verifying ISO Receipt...
      </div>
    );
  if (!data) return <div className="p-20 text-center">Receipt not found.</div>;

  const { payment, proof } = data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Action Buttons - Hidden on Print */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-deep/60 hover:text-deep transition text-sm"
        >
          <ArrowLeft size={16} /> Back to History
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white border border-moss text-moss px-4 py-2 rounded-lg hover:bg-opacity-90 transition text-sm font-semibold"
        >
          <Printer size={16} /> Print or Save PDF
        </button>
      </div>

      {/* Main Receipt Card */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 print:shadow-none print:border-none">
        {/* Header - Optimized for Mobile */}
        <div className="bg-slate-900 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <p className="text-moss font-bold tracking-widest text-[10px] md:text-xs uppercase mb-1">
                ISO 20022 Certified
              </p>
              <h1 className="text-xl md:text-2xl font-bold">Payment Receipt</h1>
              <div className="flex items-center gap-3 mt-1 group">
                <p className="text-white/50 font-mono text-xs md:text-sm break-all">
                  Receipt Id: {receiptId}
                </p>

                <button
                  onClick={copyToClipboard}
                  className="shrink-0 p-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
                  title="Copy Payment Link"
                >
                  {copied ? (
                    <Check size={14} className="text-moss" />
                  ) : (
                    <Copy
                      size={14}
                      className="text-white/40 group-hover:text-white/80"
                    />
                  )}
                </button>
              </div>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg w-full md:w-auto text-left md:text-right">
              <p className="text-[10px] uppercase opacity-60">Status</p>
              <p className="font-bold text-moss capitalize">{proof.status}</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6 md:space-y-8">
          {/* Core Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div>
              <label className="text-[10px] md:text-xs uppercase text-deep/40 font-semibold block mb-1">
                Amount Paid
              </label>
              <p className="text-2xl md:text-3xl font-bold text-deep">
                {payment.amount} {payment.asset}
              </p>
            </div>
            <div>
              <label className="text-[10px] md:text-xs uppercase text-deep/40 font-semibold block mb-1">
                Date Anchored
              </label>
              <p className="text-base md:text-lg text-deep">
                {new Date(proof.anchored_at).toLocaleString()}
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ISO 20022 Section - Mobile friendly grid */}
          <div className="bg-gray-50 rounded-2xl p-5 md:p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-moss" size={20} />
              <h3 className="font-bold text-deep text-sm md:text-base">
                ISO 20022 Digital Proof
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 print:hidden">
              <a
                href={
                  "https://middleware-iso20022-v1-3.onrender.com" +
                  proof.xml_url
                }
                target="_blank"
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-moss transition group"
              >
                <div className="flex items-center gap-3">
                  <FileCode
                    className="text-deep/40 group-hover:text-moss"
                    size={18}
                  />
                  <span className="text-xs md:text-sm font-medium">
                    View ISO XML
                  </span>
                </div>
                <ExternalLink size={14} className="text-deep/30" />
              </a>

              <a
                href={
                  "https://middleware-iso20022-v1-3.onrender.com" +
                  proof.bundle_url
                }
                download
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-moss transition group"
              >
                <div className="flex items-center gap-3">
                  <Package
                    className="text-deep/40 group-hover:text-moss"
                    size={18}
                  />
                  <span className="text-xs md:text-sm font-medium">
                    Download Bundle
                  </span>
                </div>
                <Download size={14} className="text-deep/30" />
              </a>
            </div>

            {/* Print-only View of Links */}
            <div className="hidden print:block text-[10px] space-y-1">
              <p>
                XML URL:{" "}
                {"https://middleware-iso20022-v1-3.onrender.com" +
                  proof.xml_url}
              </p>
              <p>
                Bundle URL:{" "}
                {"https://middleware-iso20022-v1-3.onrender.com" +
                  proof.bundle_url}
              </p>
            </div>
          </div>

          {/* Wallet & TX details - Break-all for mobile addresses */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:justify-between gap-1 border-b border-gray-50 pb-3">
              <span className="text-xs md:text-sm text-deep/50 font-semibold">
                Payer Wallet
              </span>
              <span className="font-mono text-[10px] md:text-sm text-deep break-all">
                {payment.payerWallet}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between gap-1 border-b border-gray-50 pb-3">
              <span className="text-xs md:text-sm text-deep/50 font-semibold">
                Project ID
              </span>
              <span className="font-mono text-[10px] md:text-sm text-deep break-all">
                {payment.projectId}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between gap-1 border-b border-gray-50 pb-3">
              <span className="text-xs md:text-sm text-deep/50 font-semibold">
                Proof Hash
              </span>
              <span className="font-mono text-[10px] md:text-sm text-deep break-all">
                {payment.proofHash}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between gap-1 border-b border-gray-50 pb-3">
              <span className="text-xs md:text-sm text-deep/50 font-semibold">
                Flare Transaction
              </span>
              <span className="font-mono text-[10px] md:text-sm text-moss break-all">
                {proof.flare_txid}
              </span>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="pt-6 flex flex-col items-center gap-2 text-center">
            <p className="text-[10px] text-deep/40 uppercase tracking-widest font-bold">
              Powered by
            </p>
            <span className="font-montserrat font-black text-xl tracking-tighter text-deep">
              PROOFRAILS
            </span>
            <p className="text-[10px] text-deep/30 max-w-xs px-4">
              Cryptographically anchored ISO 20022 messaging. Verified on Flare
              Network.
            </p>
          </div>
        </div>
      </div>

      {/* Tailwind Print Overrides */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\:hidden {
            display: none !important;
          }
          nav,
          footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
