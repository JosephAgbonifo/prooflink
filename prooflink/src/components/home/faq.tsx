"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "What is ISO 20022 and why does it matter?",
    answer:
      "ISO 20022 is the emerging global standard for financial messaging. Unlike traditional crypto transfers which only contain 'from/to' data, ISO 20022 allows for rich metadata. ProofLink anchors this metadata to the blockchain, ensuring payments are audit-ready and compatible with institutional systems.",
  },
  {
    question: "How are payments verified on the Flare Network?",
    answer:
      "We utilize Flare's State Connector and FTSO protocols to verify that a transaction has occurred on-chain. Once confirmed, the payment data is cryptographically hashed and anchored, creating a permanent, tamper-proof receipt.",
  },
  {
    question: "What are the costs associated with creating a project?",
    answer:
      "Creating a project on ProofLink is free. However, since we operate on the Flare, users will need a small amount of FLR to cover network gas fees when initiating payments or anchoring proofs.",
  },
  {
    question: "Can I integrate ProofLink receipts into my own app?",
    answer:
      "Absolutely. Our Developer API is built for this. You can query any payment by wallet address or transaction hash to retrieve the full ISO 20022 compliant proof and status programmatically.",
  },
  {
    question: "Is my payment data private?",
    answer:
      "While the transaction itself is public on the Flare Network and on ProofLink, ProofLink uses a combination of on-chain anchoring and off-chain (IPFS) encrypted metadata to ensure that sensitive project details are only accessible to authorized parties via the API.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moss/10 text-moss text-[10px] font-black uppercase tracking-widest mb-4">
            <HelpCircle size={14} />
            Common Questions
          </div>
          <h2 className="text-4xl font-black text-slate-900 font-montserrat tracking-tight mb-4">
            Everything you need <span className="text-moss">to know.</span>
          </h2>
          <p className="text-slate-500 font-medium">
            New to ISO 20022 or Flare? We've got you covered.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`transition-all duration-300 rounded-[2rem] border ${
                  isOpen
                    ? "bg-white border-moss shadow-xl shadow-moss/5"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                >
                  <span
                    className={`font-bold text-lg md:text-xl transition-colors ${
                      isOpen ? "text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 ml-4 p-2 rounded-full transition-all ${
                      isOpen
                        ? "bg-moss text-white rotate-180"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 md:p-8 pt-0 text-slate-500 leading-relaxed border-t border-slate-50 mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Still have questions?{" "}
            <Link
              href="mailto:joesefair@gmail.com"
              className="text-moss font-bold hover:underline"
            >
              Contact our dev team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
