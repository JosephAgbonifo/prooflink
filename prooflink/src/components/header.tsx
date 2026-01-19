"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Plus, ShieldCheck, LayoutDashboard } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  // Close menu when route changes
  useEffect(() => setMenuOpen(false), [pathname]);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const navLinks = [
    { name: "Projects", href: "/projects" },
    {
      name: "Verify Project",
      href: "/verify_project",
      icon: <ShieldCheck size={16} />,
    },
    {
      name: "Verify Payment",
      href: "/verify",
      icon: <ShieldCheck size={16} />,
    },
    { name: "API", href: "/api" },
  ];

  const authLinks = [
    { name: "My Payments", href: "/my-payments" },
    { name: "My Projects", href: "/my-projects" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 transition hover:opacity-80">
            <Image
              src="/logo.png"
              alt="ProofLink"
              width={120}
              height={30}
              priority
              className="h-auto w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-moss ${
                  pathname === link.href ? "text-moss" : "text-slate-600"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {isConnected && (
              <div className="flex items-center gap-6 border-l border-gray-200 ml-2 pl-6">
                {authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-slate-600 hover:text-moss transition"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!isConnected ? (
              <ConnectButton chainStatus="icon" showBalance={false} />
            ) : (
              <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-100">
                <span className="pl-2 text-xs font-mono font-semibold text-slate-500">
                  {shortAddress}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="rounded-md bg-white px-3 py-1.5 text-xs font-bold text-red-500 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-50 transition"
                >
                  Exit
                </button>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-1.5 rounded-md bg-moss px-4 py-1.5 text-sm font-semibold text-white shadow-md hover:brightness-110 transition"
                >
                  <Plus size={16} strokeWidth={3} />
                  Create
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex md:hidden p-2 text-slate-600 hover:bg-gray-100 rounded-lg transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Content */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white px-6 py-6 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Image src="/logo.png" alt="Logo" width={100} height={25} />
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-slate-500"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 py-3 text-base font-semibold text-slate-700 hover:text-moss border-b border-gray-50"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          {isConnected && (
            <>
              <div className="pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Account
              </div>
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 py-3 text-base font-semibold text-slate-700 hover:text-moss border-b border-gray-50"
                >
                  <LayoutDashboard size={18} />
                  {link.name}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="mt-8 space-y-4">
          {!isConnected ? (
            <div className="w-full flex justify-center">
              <ConnectButton />
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/create"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-moss py-4 text-white font-bold shadow-lg"
              >
                <Plus size={20} />
                Create New Project
              </Link>
              <button
                onClick={() => disconnect()}
                className="w-full py-3 text-sm font-bold text-red-500 border border-red-100 rounded-xl hover:bg-red-50"
              >
                Disconnect Wallet ({shortAddress})
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
