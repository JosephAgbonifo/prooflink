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

  // 1. Contract Reads - Added error logging
  const {
    data: finances,
    refetch,
    isLoading: isReading,
    error: readError,
  } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getProtocolFinances",
    account: address, // <--- ADD THIS LINE
    args: [selectedToken.address],
    query: {
      enabled: isAuthenticated && isConnected,
      retry: 2,
    },
  });

  // 2. Contract Writes
  const { writeContractAsync, isPending: isSigning } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the prefix-compatible env variable
    const correctPasskey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY;

    if (passkey === correctPasskey) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid Passkey. Ensure NEXT_PUBLIC_ADMIN_PASSKEY is set in .env");
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
      console.error("Withdraw Error:", err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      const timer = setTimeout(() => setWithdrawHash(undefined), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, refetch]);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-moss/10 rounded-full flex items-center justify-center mx-auto text-moss">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Admin Access</h2>
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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Error Banner if contract read fails */}
      {readError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-mono">
          Contract Error: {readError.message}
        </div>
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

        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
          {TOKENS.map((t) => (
            <button
              key={t.symbol}
              onClick={() => setSelectedToken(t)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedToken.symbol === t.symbol
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.symbol}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          icon={<ArrowDownCircle className="text-moss" />}
        />
      </div>

      <div className="mt-12 bg-white border border-slate-100 rounded-[3rem] p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => refetch()}
            disabled={isReading}
            className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-moss transition-colors disabled:opacity-50"
          >
            {isReading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <RefreshCcw size={24} />
            )}
          </button>
          <div>
            <h3 className="font-black text-slate-900">
              Withdraw {selectedToken.symbol} Fees
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Target Wallet:{" "}
              <span className="font-mono text-moss">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Not Connected"}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={
            !finances ||
            finances[2] === 0n ||
            isSigning ||
            isConfirming ||
            !isConnected
          }
          className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-moss disabled:bg-slate-100 disabled:text-slate-300 transition-all flex items-center gap-3"
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
        </button>
      </div>
    </div>
  );
}

// FinanceCard remains the same as your code...
function FinanceCard({
  title,
  amount,
  symbol,
  icon,
  highlight = false,
}: {
  title: string;
  amount: string;
  symbol: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-8 rounded-[2.5rem] border ${
        highlight
          ? "bg-moss text-white border-moss shadow-2xl shadow-moss/20"
          : "bg-white border-slate-100 shadow-xl shadow-slate-100"
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-2xl ${
            highlight ? "bg-white/20" : "bg-slate-50"
          }`}
        >
          {icon}
        </div>
      </div>
      <p
        className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
          highlight ? "text-white/60" : "text-slate-400"
        }`}
      >
        {title}
      </p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-black">
          {parseFloat(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </h2>
        <span
          className={`text-xs font-bold ${
            highlight ? "text-white/80" : "text-slate-500"
          }`}
        >
          {symbol}
        </span>
      </div>
    </div>
  );
}
