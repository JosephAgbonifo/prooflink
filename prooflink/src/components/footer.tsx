"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Github,
  Twitter,
  ExternalLink,
  ShieldCheck,
  Mail,
  Globe,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="ProofLink"
                width={130}
                height={32}
                priority
              />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              The bridge between traditional financial messaging and blockchain
              truth. Cryptographically anchoring ISO 20022 payments on Flare.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-moss transition"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-moss transition"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Ecosystem */}
          <div>
            <h4 className="font-montserrat font-black text-slate-900 text-xs uppercase tracking-widest mb-6">
              Ecosystem
            </h4>
            <ul className="space-y-4 text-sm font-semibold text-slate-500">
              <li>
                <Link href="/projects" className="hover:text-moss transition">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-moss transition">
                  Verify Proofs
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-moss transition">
                  Launch Project
                </Link>
              </li>
              <li>
                <Link href="/stats" className="hover:text-moss transition">
                  Network Stats
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Developers */}
          <div>
            <h4 className="font-montserrat font-black text-slate-900 text-xs uppercase tracking-widest mb-6">
              Developers
            </h4>
            <ul className="space-y-4 text-sm font-semibold text-slate-500">
              <li>
                <Link href="/api" className="hover:text-moss transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api/auth" className="hover:text-moss transition">
                  API Keys
                </Link>
              </li>
              <li>
                <Link
                  href="/api/webhooks"
                  className="hover:text-moss transition"
                >
                  Webhooks
                </Link>
              </li>
              <li>
                <a
                  href="https://coston2-explorer.flare.network"
                  target="_blank"
                  className="flex items-center gap-1 hover:text-moss transition"
                >
                  Flare Explorer <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Network */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-moss" size={20} />
              <span className="font-bold text-slate-900 text-sm">
                Security First
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
              All transactions are processed through the Flare Coston2 Testnet
              and are cryptographically verifiable using state-connector
              protocols.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-moss bg-moss/10 px-3 py-1.5 rounded-full w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-moss animate-pulse" />
              Network Live
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">
            © {currentYear} ProofLink Ecosystem. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-bold text-slate-400">
            <Link href="/privacy" className="hover:text-slate-900 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-900 transition">
              Terms of Service
            </Link>
            <div className="flex items-center gap-1">
              <Globe size={14} />
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
