"use client";

import {
  ShieldCheck,
  Globe,
  Layers,
  Zap,
  Network,
  FileCode,
  Lock,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

export default function AboutPage() {
  const router = useRouter();

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const fadeInScale: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 py-12 md:py-24 space-y-32"
    >
      {/* 1. VISION & PROBLEM SOLVING */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-moss/10 blur-[120px] rounded-full -z-10"
        />
        <motion.div variants={containerVariants} className="max-w-4xl">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 text-moss font-black uppercase tracking-[0.3em] text-[10px] mb-6"
          >
            <Network size={14} /> Financial Metadata Infrastructure
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black text-[#171717] leading-[1.1] mb-8 italic"
          >
            Standardizing <span className="text-moss">Web3 Value</span>.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-600 font-medium leading-relaxed"
          >
            Quirklr is a financial verification layer built for the Flare
            Network. We solve the <strong>Context Gap</strong> in blockchain
            transfers by wrapping raw on-chain data in{" "}
            <strong>ISO 20022 compliant structures</strong>, providing the first
            auditable bridge between decentralized liquidity and institutional
            financial reporting.
          </motion.p>
        </motion.div>
      </section>

      {/* 2. THE DUAL-BUILDER ECOSYSTEM */}
      <motion.section
        variants={containerVariants}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-2 gap-12"
      >
        <motion.div
          variants={itemVariants}
          className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl border border-slate-800"
        >
          <h3 className="text-moss font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
            <TrendingUp size={18} /> For Fundraising Builders
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Launch projects with absolute transparency. Quirklr provides a
            secure treasury vault where every contribution is automatically
            indexed and anchored to a unique Receipt ID.
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            {[
              "Automated 1.5% Fee Calculation",
              "Real-time Contributor Tracking",
              "Tax-Ready Financial Metadata",
            ].map((text, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex gap-2"
              >
                <span className="text-moss">✔</span> {text}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[3rem] p-10 text-slate-900 shadow-xl border border-slate-100 flex flex-col justify-center"
        >
          <h3 className="text-moss font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
            <Zap size={18} /> For Service Merchants
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Integrate one-time payment links directly into your existing apps.
            Use our Verification API to instantly confirm a user’s payment
            status and unlock digital services without manual oversight.
          </p>
          <div className="flex gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl flex-1 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase">
                Verification
              </p>
              <p className="text-sm font-bold text-slate-700">Instant API</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl flex-1 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase">
                Standards
              </p>
              <p className="text-sm font-bold text-slate-700">ISO 20022</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* 3. TECHNICAL LIFECYCLE */}
      <section className="space-y-12">
        <motion.div
          variants={fadeInScale}
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-black text-[#171717] mb-4">
            The Lifecycle of a Receipt
          </h2>
          <p className="text-slate-500 text-sm">
            How Quirklr transforms a raw Flare transaction into an auditable
            financial record.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "1. Smart Vault Detection",
              desc: "A user pays via C2FLR, USDT0, or FXRP. Our frontend captures the 0x-hash and binds it to your Project ID.",
              icon: <Lock />,
            },
            {
              title: "2. ISO 20022 Mapping",
              desc: "Data is processed through our engine to generate a 'pain.001' XML structure, identifying the purpose of payment.",
              icon: <FileCode />,
            },
            {
              title: "3. Metadata Anchoring",
              desc: "A unique Receipt ID is generated and indexed in our database, creating a searchable cryptographic anchor.",
              icon: <Layers />,
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-moss shadow-sm mb-6">
                {step.icon}
              </div>
              <h4 className="font-black text-[#171717] mb-2">{step.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. BUSINESS LOGIC & SUSTAINABILITY */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row gap-12 relative z-10">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-black leading-tight mb-6">
              Sustainable <br />{" "}
              <span className="text-moss">Business Logic.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Quirklr is built for longevity. To maintain the verification
              infrastructure and indexing services, the system implements a
              transparent <strong>1.5% protocol charge</strong> on all project
              withdrawals.
            </p>
            <div className="flex gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 p-6 rounded-3xl"
              >
                <p className="text-moss text-3xl font-black">1.5%</p>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Fixed Service Fee
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 p-6 rounded-3xl"
              >
                <p className="text-white text-3xl font-black">0.0s</p>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Sync Latency
                </p>
              </motion.div>
            </div>
          </div>
          <div className="md:w-1/2 grid grid-cols-1 gap-6">
            <motion.div
              variants={fadeInScale}
              className="p-6 bg-white/5 rounded-3xl border border-white/10"
            >
              <h4 className="font-bold text-moss mb-2">Institutional Ready</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our XML metadata exports are designed to be ingested by SAP,
                Oracle, and SWIFT-compatible bank portals.
              </p>
            </motion.div>
            <motion.div
              variants={fadeInScale}
              className="p-6 bg-white/5 rounded-3xl border border-white/10"
            >
              <h4 className="font-bold text-moss mb-2">Developer First</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Secure your services with API keys that offer a 200ms
                verification response time for all Flare transactions.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 5. FUTURE ROADMAP */}
      <section className="grid md:grid-cols-2 gap-16 items-center px-4">
        <motion.div
          variants={containerVariants}
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-black text-[#171717] mb-6 tracking-tight"
          >
            The Roadmap to <br />
            Global Compliance.
          </motion.h2>
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="flex gap-4">
              <Globe className="text-moss shrink-0" />
              <div>
                <p className="font-bold text-[#171717]">
                  Cross-Chain Verification
                </p>
                <p className="text-sm text-slate-500 italic">
                  Expanding via Flare Data Connector to verify BTC and XRP
                  payments.
                </p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex gap-4">
              <ShieldCheck className="text-moss shrink-0" />
              <div>
                <p className="font-bold text-[#171717]">
                  Zero-Knowledge Privacy
                </p>
                <p className="text-sm text-slate-500 italic">
                  Proving "Status: Paid" without revealing full wallet balances.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 text-center"
        >
          <h3 className="text-2xl font-black text-[#171717] mb-6">
            Build with Quirklr
          </h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/api/auth")}
              className="h-14 bg-[#171717] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-moss transition-all hover:shadow-lg active:scale-95"
            >
              Get Your API Key
            </button>
            <button
              onClick={() => router.push("/api")}
              className="h-14 bg-white border border-slate-200 text-[#171717] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
            >
              Documentation
            </button>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
