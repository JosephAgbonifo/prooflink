"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderSearch, // Changed icon for project context
  Search,
  ArrowRight,
  Hash, // Changed icon for ID context
  Loader2,
} from "lucide-react";

export default function FindProjectPage() {
  const [projectId, setProjectId] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId.trim()) return;

    setIsRedirecting(true);
    // Redirecting to your dynamic project route: /project/[projectId]
    router.push(`/project/${projectId.trim()}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 min-h-[80vh] flex flex-col items-center justify-center">
      {/* Decorative Icon */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-moss/20 blur-3xl rounded-full" />
        <div className="relative w-20 h-20 bg-white border border-slate-100 rounded-[2rem] shadow-xl flex items-center justify-center text-moss">
          <FolderSearch size={40} strokeWidth={1.5} />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-montserrat tracking-tight">
          Find <span className="text-moss">Project</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-md mx-auto">
          Enter a unique Project ID to view its fundraising progress,
          contributors, and blockchain verification status.
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleVerify}
        className="w-full max-w-lg bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex items-center gap-2 group focus-within:ring-4 focus-within:ring-moss/5 transition-all"
      >
        <div className="pl-6 text-slate-300 group-focus-within:text-moss transition-colors">
          <Hash size={24} />
        </div>

        <input
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="Paste Project ID here..."
          className="flex-1 py-6 px-2 outline-none font-mono text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-sans"
          required
        />

        <button
          type="submit"
          disabled={isRedirecting || !projectId}
          className="bg-slate-900 text-white p-5 rounded-[2rem] hover:bg-moss transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:bg-slate-300"
        >
          {isRedirecting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span className="hidden md:block font-black text-[10px] uppercase tracking-widest pl-2">
                Open Project
              </span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      {/* Info Badges */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-px bg-slate-300" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            Real-time Tracking
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-px bg-slate-300" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            Transparent Ledger
          </p>
        </div>
        <div className="hidden md:flex flex-col items-center gap-2">
          <div className="h-8 w-px bg-slate-300" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            Direct Contribution
          </p>
        </div>
      </div>
    </div>
  );
}
