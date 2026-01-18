"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  BookOpen,
  Terminal,
  Database,
  Key,
  ShieldCheck,
  Activity,
  ChevronRight,
} from "lucide-react";

const menuGroups = [
  {
    title: "Getting Started",
    items: [
      { name: "Overview", href: "/api", icon: BookOpen },
      { name: "Authentication", href: "/api/auth", icon: Key },
    ],
  },
  {
    title: "Endpoints",
    items: [
      { name: "Query Payments", href: "/api/payments", icon: Database },
      { name: "Project Metadata", href: "/api/projects", icon: Terminal },
    ],
  },
  {
    title: "Webhooks & Security",
    items: [
      { name: "Payment Hooks", href: "/api/webhooks", icon: ShieldCheck },
      { name: "Network Status", href: "/api/status", icon: Activity },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Sidebar Header */}
      <div className="p-8 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-slate-900 group-hover:bg-moss p-2 rounded-xl transition-colors">
            <Code2 className="text-white" size={22} />
          </div>
          <div>
            <span className="block font-montserrat font-black text-slate-900 tracking-tighter leading-none">
              ISO-API
            </span>
            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
              v1.0.0
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 py-4 space-y-8">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between group px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-moss/5 text-moss shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={18}
                        className={
                          isActive
                            ? "text-moss"
                            : "text-slate-400 group-hover:text-slate-600"
                        }
                      />
                      {item.name}
                    </div>
                    {isActive && (
                      <ChevronRight size={14} className="animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              Flare Coston2
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            API responses include cryptographically anchored ISO 20022 hashes.
          </p>
        </div>
      </div>
    </div>
  );
}
