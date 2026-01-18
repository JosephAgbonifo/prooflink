"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Wallet, Plus, ShieldCheck } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const shortAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-3)}`
    : "";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-deep/10">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="ProofLink"
            width={115}
            height={28}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-montserrat text-[13px] text-deep">
          <Link href="/projects" className="hover:text-moss transition">
            Projects
          </Link>
          <Link
            href="/verify"
            className="flex items-center gap-1 hover:text-moss transition"
          >
            <ShieldCheck size={14} />
            Verify Payment
          </Link>
          <Link href="/api" className="hover:text-moss transition">
            API
          </Link>
          {isConnected && (
            <>
              <Link href="/my-payments" className="hover:text-moss transition">
                My Payments
              </Link>
              <Link href="/my-projects" className="hover:text-moss transition">
                My Projects
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {!isConnected ? (
            <ConnectButton showBalance={true} />
          ) : (
            <>
              <span className="text-sm text-deep font-mono">
                {shortAddress}
              </span>
              <button
                onClick={() => disconnect()}
                className="rounded-md bg-red-500 px-3 py-1.5 text-white text-sm font-medium hover:opacity-90 transition"
              >
                Disconnect
              </button>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-md bg-moss px-3 py-1.5 text-white font-poppins text-sm font-medium hover:opacity-90 transition"
              >
                <Plus size={15} />
                Create
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-deep"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-deep/10">
          <nav className="flex flex-col gap-4 px-4 py-5 font-montserrat text-sm text-deep">
            <Link href="/projects" onClick={() => setMenuOpen(false)}>
              Projects
            </Link>
            <Link href="/verify" onClick={() => setMenuOpen(false)}>
              Verify Payment
            </Link>
            <Link href="/api" onClick={() => setMenuOpen(false)}>
              API
            </Link>

            {isConnected && (
              <>
                <Link href="/my-payments" onClick={() => setMenuOpen(false)}>
                  My Payments
                </Link>
                <Link href="/my-projects" onClick={() => setMenuOpen(false)}>
                  My Projects
                </Link>
              </>
            )}

            {!isConnected ? (
              <div onClick={() => setMenuOpen(false)}>
                <ConnectButton
                  showBalance={false}
                  chainStatus="icon"
                  accountStatus="avatar"
                  label={shortAddress}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-deep font-mono">
                    {shortAddress}
                  </span>
                  <button
                    onClick={() => {
                      disconnect();
                      setMenuOpen(false);
                    }}
                    className="rounded-md bg-red-500 px-3 py-1.5 text-white text-sm font-medium"
                  >
                    Disconnect
                  </button>
                </div>
                <Link
                  href="/create"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-moss px-3 py-2 text-white font-poppins font-medium"
                >
                  <Plus size={16} />
                  Create Project
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
