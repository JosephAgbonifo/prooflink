"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import { Menu, MenuSquareIcon } from "lucide-react";

export default function ApiLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Header 
         Only visible on small screens to provide a toggle button
      */}
      <div className="md:hidden fixed top-15 left-0 right-0 h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          <MenuSquareIcon size={20} />
        </button>
        <span className="font-bold text-sm text-slate-900">API Docs</span>
        <div className="w-8" /> {/* Spacer for balance */}
      </div>

      {/* Sidebar Wrapper 
         On Desktop: Occupies fixed space (w-64)
         On Mobile: Controlled by isSidebarOpen state
      */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:block shrink-0
      `}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 mt-14 md:mt-0 md:p-12">
          <div className="max-w-4xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
