"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Plus,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  CreditCard,
  Briefcase,
} from "lucide-react";
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
    { name: "Verify Project", href: "/verify_project" },
    { name: "Verify Payment", href: "/verify" },
    { name: "API", href: "/api" },
  ];

  const userDashboardLinks = [
    {
      name: "My Projects",
      href: "/my-projects",
      icon: <Briefcase size={16} />,
    },
    {
      name: "My Payments",
      href: "/my-payments",
      icon: <CreditCard size={16} />,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Balanced Grid Container */}
          <div className="grid grid-cols-2 lg:grid-cols-3 h-20 items-center">
            {/* 1. LEFT: Logo */}
            <div className="flex justify-start">
              <Link
                href="/"
                className="transition-transform active:scale-95 flex items-center"
              >
                <Image
                  src="/logo.png"
                  alt="Quirklr"
                  width={130}
                  height={35}
                  priority
                  className="h-9 w-auto object-contain"
                />
              </Link>
            </div>

            {/* 2. CENTER: Navigation (Desktop Only) */}
            <nav className="hidden lg:flex items-center justify-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold transition-all hover:text-moss whitespace-nowrap ${
                    pathname === link.href ? "text-moss" : "text-slate-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* 3. RIGHT: Actions */}
            <div className="flex items-center justify-end gap-3">
              {!isConnected ? (
                <div className="scale-90 origin-right">
                  <ConnectButton chainStatus="none" showBalance={false} />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Dashboard Tooltip Dropdown */}
                  <div className="relative group hidden md:block">
                    <button className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-full px-4 py-2 transition-all group-hover:bg-white group-hover:shadow-md">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[11px] font-black text-slate-600 font-mono tracking-tight">
                        {shortAddress}
                      </span>
                      <ChevronDown
                        size={14}
                        className="text-slate-400 group-hover:rotate-180 transition-transform"
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {userDashboardLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-moss rounded-xl transition-colors"
                        >
                          {link.icon}
                          {link.name}
                        </Link>
                      ))}
                      <div className="h-px bg-slate-50 my-1" />
                      <button
                        onClick={() => disconnect()}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut size={16} />
                        Exit Wallet
                      </button>
                    </div>
                  </div>

                  {/* Create Button */}
                  <Link
                    href="/create"
                    className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-[12px] font-black text-white shadow-lg hover:bg-moss transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Plus size={16} strokeWidth={3} />
                    CREATE
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </header>{" "}
      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-100 bg-white transition-transform duration-500 ease-in-out lg:hidden ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col h-full px-8 pt-24 pb-10">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-slate-400"
          >
            <X size={32} />
          </button>

          <div className="space-y-8">
            <nav className="flex flex-col gap-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Main Menu
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-3xl font-black text-slate-900"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {isConnected && (
              <nav className="flex flex-col gap-6 pt-8 border-t border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Dashboard
                </p>
                {userDashboardLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-4 text-2xl font-bold text-slate-700"
                  >
                    {link.icon} {link.name}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="mt-auto pt-10">
            {!isConnected ? (
              <div className="w-full [&>div]:w-full">
                <ConnectButton />
              </div>
            ) : (
              <button
                onClick={() => disconnect()}
                className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-bold"
              >
                Disconnect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
