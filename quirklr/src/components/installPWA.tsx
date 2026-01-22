"use client";
import { useState, useEffect } from "react";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on client
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 w-[calc(100%-3rem)] md:w-80 bg-[#171717] text-white p-6 rounded-[2rem] shadow-2xl border border-white/10 z-[200] flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#ff4d00] rounded-xl flex items-center justify-center font-black text-white text-xl">
          Q
        </div>
        <div>
          <p className="text-sm font-black">Install Quirklr</p>
          <p className="text-[10px] text-slate-400 font-medium">
            Add to your home screen for instant access.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsVisible(false)}
          className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          Later
        </button>
        <button
          onClick={handleInstallClick}
          className="flex-[2] py-3 bg-[#ff4d00] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all"
        >
          Install Now
        </button>
      </div>
    </div>
  );
}
