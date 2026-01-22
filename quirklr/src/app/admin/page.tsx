"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { formatUnits, type Address, type Hash } from "viem";
import {
  ShieldAlert,
  Lock,
  Wallet,
  ArrowDownCircle,
  Coins,
  RefreshCcw,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const VAULT_ADDRESS: Address = "0xEDf96Da0164148fC37886dCA57790054C1322C9A";
const NATIVE_TOKEN: Address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const TOKENS = [
  { symbol: "C2FLR", address: NATIVE_TOKEN, decimals: 18 },
  {
    symbol: "USDT0",
    address: "0xC1A5B41512496B80903D1f32d6dEa3a73212E71F" as Address,
    decimals: 6,
  },
  {
    symbol: "FXRP",
    address: "0x8b4abA9C4BD7DD961659b02129beE20c6286e17F" as Address,
    decimals: 6,
  },
];

const VAULT_ABI = [
  {
    name: "getProtocolFinances",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_tokenAddress", type: "address" }],
    outputs: [
      { name: "projectObligations", type: "uint256" },
      { name: "actualContractBalance", type: "uint256" },
      { name: "protocolFeesAvailable", type: "uint256" },
    ],
  },
  {
    name: "withdrawProtocolFees",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_tokenAddress", type: "address" }],
    outputs: [],
  },
] as const;

export default function AdminFinanceDashboard() {
  const { address, isConnected } = useAccount();
  const [passkey, setPasskey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [withdrawHash, setWithdrawHash] = useState<Hash | undefined>();

  const {
    data: finances,
    refetch,
    isLoading: isReading,
    error: readError,
  } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getProtocolFinances",
    account: address,
    args: [selectedToken.address],
    query: { enabled: isAuthenticated && isConnected, retry: 2 },
  });

  const { writeContractAsync, isPending: isSigning } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid Passkey.");
    }
  };

  const handleWithdraw = async () => {
    try {
      const hash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "withdrawProtocolFees",
        args: [selectedToken.address],
      });
      setWithdrawHash(hash);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      const timer = setTimeout(() => setWithdrawHash(undefined), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, refetch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white max-w-md w-full rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-moss/10 rounded-full flex items-center justify-center mx-auto text-moss">
                <Lock size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Admin Access
              </h2>
              <form onSubmit={handleAuth} className="space-y-4">
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter Passkey"
                  className="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-2xl text-center font-mono text-lg focus:border-moss outline-none transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-moss transition-all"
                >
                  Unlock Dashboard
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4 py-12"
      >
        {readError && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-mono overflow-hidden"
          >
            Contract Error: {readError.message}
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-moss font-bold text-xs uppercase tracking-widest">
              <ShieldAlert size={16} /> Protocol Treasury
            </div>
            <h1 className="text-4xl font-black text-slate-900">
              System Finances
            </h1>
          </div>

          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl gap-1">
            {TOKENS.map((t) => (
              <button
                key={t.symbol}
                onClick={() => setSelectedToken(t)}
                className={`relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedToken.symbol === t.symbol
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {selectedToken.symbol === t.symbol && (
                  <motion.div
                    layoutId="activeToken"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm z-0"
                  />
                )}
                <span className="relative z-10">{t.symbol}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FinanceCard
            title="Project Obligations"
            amount={
              finances?.[0]
                ? formatUnits(finances[0], selectedToken.decimals)
                : "0"
            }
            symbol={selectedToken.symbol}
            icon={<Coins className="text-blue-500" />}
          />
          <FinanceCard
            title="Total On-Chain"
            amount={
              finances?.[1]
                ? formatUnits(finances[1], selectedToken.decimals)
                : "0"
            }
            symbol={selectedToken.symbol}
            icon={<Wallet className="text-slate-400" />}
          />
          <FinanceCard
            title="Available Fees"
            amount={
              finances?.[2]
                ? formatUnits(finances[2], selectedToken.decimals)
                : "0"
            }
            symbol={selectedToken.symbol}
            highlight
            icon={<ArrowDownCircle className="text-white" />}
          />
        </motion.div>

        <motion.div
          layout
          className="mt-12 bg-white border border-slate-100 rounded-[3rem] p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => refetch()}
              disabled={isReading}
              className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-moss transition-colors"
            >
              <RefreshCcw
                size={24}
                className={isReading ? "animate-spin" : ""}
              />
            </motion.button>
            <div>
              <h3 className="font-black text-slate-900">
                Withdraw {selectedToken.symbol} Fees
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Target:{" "}
                <span className="font-mono text-moss">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWithdraw}
            disabled={
              !finances ||
              finances[2] === 0n ||
              isSigning ||
              isConfirming ||
              !isConnected
            }
            className={`px-10 py-5 rounded-4xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg ${
              isSuccess
                ? "bg-emerald-500 text-white"
                : "bg-slate-900 text-white hover:bg-moss"
            } disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none`}
          >
            {isSigning || isConfirming ? (
              <Loader2 className="animate-spin" size={18} />
            ) : isSuccess ? (
              <CheckCircle2 size={18} />
            ) : (
              <ArrowDownCircle size={18} />
            )}
            {isSigning
              ? "Signing..."
              : isConfirming
              ? "Confirming..."
              : isSuccess
              ? "Success"
              : "Withdraw Fees"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function FinanceCard({ title, amount, symbol, icon, highlight = false }: any) {
  return (
    <motion.div
      layout
      className={`p-8 rounded-[2.5rem] border ${
        highlight
          ? "bg-moss text-white border-moss shadow-2xl shadow-moss/20"
          : "bg-white border-slate-100 shadow-xl"
      }`}
    >
      <div
        className={`p-3 w-fit rounded-2xl mb-6 ${
          highlight ? "bg-white/20" : "bg-slate-50"
        }`}
      >
        {icon}
      </div>
      <p
        className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
          highlight ? "text-white/60" : "text-slate-400"
        }`}
      >
        {title}
      </p>
      <div className="flex items-baseline gap-2">
        <motion.h2
          key={amount}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black"
        >
          {parseFloat(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </motion.h2>
        <span
          className={`text-xs font-bold ${
            highlight ? "text-white/80" : "text-slate-500"
          }`}
        >
          {symbol}
        </span>
      </div>
    </motion.div>
  );
}
