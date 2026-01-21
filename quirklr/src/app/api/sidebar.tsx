"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Code2,
  BookOpen,
  Key,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

// Add props to handle closing the sidebar on mobile
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuGroups = [
  {
    title: "Getting Started",
    items: [
      { name: "Overview", href: "/api", icon: BookOpen },
      { name: "Authentication", href: "/api/auth", icon: Key },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay: Only visible when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col h-full border-r border-slate-100
      `}
      >
        {/* Sidebar Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={onClose}
          >
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

          {/* Close button - Only visible on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
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
                      onClick={onClose} // Close menu when a link is clicked
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
        <div className="p-4 border-t border-slate-50">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                Flare
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              API responses include cryptographically anchored ISO 20022 hashes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
