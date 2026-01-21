"use client";

import { useState, useEffect } from "react";
import { Key, Copy, Check, Loader2, Plus } from "lucide-react";
import { getRequest } from "@/lib/api";
import { useAccount } from "wagmi";

export default function ApiKeyManager() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [alreadyHave, setAlreadyHave] = useState("");
  const [copied, setCopied] = useState(false);
  const { address } = useAccount();
  const walletAddress = address;
  // 1. Check if user already has a key
  useEffect(() => {
    const checkKey = async () => {
      try {
        const res = await getRequest(`/auth/check-key?wallet=${walletAddress}`);
        if (res) setAlreadyHave("true");
      } catch (err) {
        console.error("Failed to fetch API key");
      } finally {
        setLoading(false);
      }
    };
    if (walletAddress) checkKey();
  }, [walletAddress]);

  // 2. Create a new key
  const generateKey = async () => {
    setCreating(true);
    try {
      const res = await getRequest(
        `/auth/generate-key?wallet=${walletAddress}`
      );
      if (res) setApiKey(res.apiKey);
    } catch (err) {
      console.error("Failed to generate API key");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-moss rounded-full animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          ...Fetching...
        </p>
      </div>
    );

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-moss/10 rounded-lg">
          <Key className="text-moss" size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Developer API Key</h2>
      </div>

      {apiKey ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Your secret API key (keep this safe!):
          </p>
          <div className="relative group">
            <div className="bg-slate-900 text-emerald-400 font-mono text-sm p-4 rounded-xl break-all border border-slate-800">
              {apiKey}
            </div>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              {copied ? (
                <Check size={16} className="text-emerald-400" />
              ) : (
                <Copy size={16} className="text-slate-300" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-slate-500 mb-6 text-sm">
            {alreadyHave === "true"
              ? "You already have an ApiKey regenerating will render the previous invalid"
              : "You haven't generated an API key for this wallet yet."}
          </p>
          <button
            onClick={generateKey}
            disabled={creating}
            className="w-full flex items-center justify-center gap-2 bg-moss text-white py-3 px-4 rounded-xl font-bold hover:bg-moss/90 transition disabled:opacity-50"
          >
            {creating ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Plus size={18} />
            )}
            {alreadyHave === "true" ? "Regenerate Key" : "Generate Key"}
          </button>
        </div>
      )}
    </div>
  );
}
