"use client";

import {
  Copy,
  Check,
  Terminal,
  Globe,
  ShieldCheck,
  Hash,
  User,
} from "lucide-react";
import { useState } from "react";

export default function ApiDocsPage() {
  const [copied, setCopied] = useState(false);

  // Updated snippet to reflect checking specific payment status
  const codeSnippet = `curl -X GET "https://prooflink.onrender.com/api/public/verify?projectId=YOUR_PROJECT_ID&walletAddress=0x..." \\
  -H "X-API-KEY: your_api_key_here"`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4 font-montserrat">
          Verify Project Payment
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          Check if a specific wallet address has completed a payment for a given
          project. This endpoint returns full ISO 20022 metadata and
          cryptographic proof hashes.
        </p>
      </section>

      {/* Endpoint Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200">
            GET
          </span>
          <code className="text-sm font-mono text-slate-800 bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200">
            /api/v1/payments/verify
          </code>
        </div>

        {/* Parameters Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-900">
                  Query Parameter
                </th>
                <th className="p-4 font-bold text-slate-900">Type</th>
                <th className="p-4 font-bold text-slate-900">Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-mono text-moss font-bold">projectId</td>
                <td className="p-4 text-slate-500 italic">string</td>
                <td className="p-4 text-rose-500 font-medium">Yes</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-moss font-bold">
                  walletAddress
                </td>
                <td className="p-4 text-slate-500 italic">string</td>
                <td className="p-4 text-rose-500 font-medium">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Code Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Example */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-widest">
            <Terminal size={16} className="text-moss" /> Request Example
          </h3>
          <div className="relative group bg-slate-900 rounded-2xl p-6 shadow-xl">
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              {copied ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <Copy size={14} className="text-slate-400" />
              )}
            </button>
            <pre className="text-sm font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {codeSnippet}
            </pre>
          </div>
        </div>

        {/* Response Example */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-widest">
            <Globe size={16} className="text-moss" /> Payment Data Response
          </h3>
          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl overflow-hidden">
            <pre className="text-sm font-mono text-emerald-400/90 overflow-x-auto leading-relaxed">
              {`{
  "hasPaid": true,
  "payment": {
    "projectId": "solar-farm-2026",
    "paymentId": "PAY-8821-X",
    "receiptId": "RCPT-992-ZZ",
    "payerWallet": "0x123...abc",
    "reference": "Order_Ref_001",
    "amount": 150.5,
    "asset": "FLR",
    "proofHash": "0xaf...2b",
    "timestamp": "2026-01-18T20:57:43Z"
  }
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
        <ShieldCheck className="text-amber-600 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-amber-900 text-sm">
            Security & Rate Limiting
          </h4>
          <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
            All API requests must be authenticated via the{" "}
            <code className="bg-amber-100 px-1 rounded">X-API-KEY</code> header.
            Unverified keys are limited to 1,000 requests per hour.
          </p>
        </div>
      </div>
    </div>
  );
}
