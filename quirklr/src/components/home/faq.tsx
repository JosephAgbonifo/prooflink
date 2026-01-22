"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";

const faqs = [
  {
    question: "What is ISO 20022 and why does it matter?",
    answer:
      "ISO 20022 is the emerging global standard for financial messaging. Unlike traditional crypto transfers which only contain 'from/to' data, ISO 20022 allows for rich metadata. Quirklr anchors this metadata to the blockchain, ensuring payments are audit-ready and compatible with institutional systems.",
  },
  {
    question: "How are payments verified on the Flare Network?",
    answer:
      "We utilize Flare's State Connector and FTSO protocols to verify that a transaction has occurred on-chain. Once confirmed, the payment data is cryptographically hashed and anchored, creating a permanent, tamper-proof receipt.",
  },
  {
    question: "What are the costs associated with creating a project?",
    answer:
      "Creating a project on Quirklr is free. However, since we operate on the Flare, users will need a small amount of FLR to cover network gas fees when initiating payments or anchoring proofs.",
  },
  {
    question: "Can I integrate Quirklr receipts into my own app?",
    answer:
      "Absolutely. Our Developer API is built for this. You can query any payment by wallet address or transaction hash to retrieve the full ISO 20022 compliant proof and status programmatically.",
  },
  {
    question: "Is my payment data private?",
    answer:
      "While the transaction itself is public on the Flare Network and on Quirklr, Quirklr uses a combination of on-chain anchoring and off-chain (IPFS) encrypted metadata to ensure that sensitive project details are only accessible to authorized parties via the API.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
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
        </motion.div>

        {/* Accordion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                layout
                className={`transition-all duration-300 rounded-4xl border ${
                  isOpen
                    ? "bg-white border-moss shadow-xl shadow-moss/5"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                >
                  <span
                    className={`font-bold text-lg md:text-xl transition-colors ${
                      isOpen ? "text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{
                      rotate: isOpen ? 180 : 0,
                      backgroundColor: isOpen ? "#ff4d00" : "#f1f5f9", // --moss color
                      color: isOpen ? "#ffffff" : "#94a3b8",
                    }}
                    className="shrink-0 ml-4 p-2 rounded-full"
                  >
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1] as const,
                      }}
                    >
                      <div className="p-6 md:p-8 pt-0 text-slate-500 leading-relaxed border-t border-slate-50 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 text-sm font-medium">
            Still have questions?{" "}
            <Link
              href="mailto:joesefair@gmail.com"
              className="text-moss font-bold hover:underline"
            >
              Contact our dev team
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
