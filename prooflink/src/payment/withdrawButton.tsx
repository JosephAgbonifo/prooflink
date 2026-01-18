"use client";
import * as React from "react";
import { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { getRequest, postRequest } from "@/lib/api";
import { Loader2, TrendingUp, Wallet } from "lucide-react";

const VAULT_ABI = [
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_projectId", type: "string" }],
    outputs: [],
  },
] as const;

const VAULT_ADDRESS = "0xf40F7818a0FaA8834BA157DaF4822d7821Bf8c15";

export function WithdrawButton({
  projectId,
  className,
}: {
  projectId: string;
  className: string;
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    data: hash,
    error: contractError,
    isPending,
    writeContract,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const handleWithdrawClick = async () => {
    setErrorMsg("");
    setIsVerifying(true);

    try {
      // 1. Check fundraising progress from backend
      const progress = await getRequest(
        `/payments/fundraising_progress/${projectId}`
      );

      // Check if goal is met (removing % sign and converting to number)
      const rawPercent = Number(progress.raw_percent);

      if (rawPercent < 100) {
        throw new Error(
          `Goal not met. Current progress: ${progress.percent_completion}`
        );
      }

      // 2. If met, trigger Smart Contract Withdrawal
      writeContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "withdraw",
        args: [projectId],
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  // 3. Notify backend when on-chain withdrawal is successful
  React.useEffect(() => {
    if (isConfirmed) {
      postRequest("/projects/withdraw", { projectId, txHash: hash });
    }
  }, [isConfirmed, projectId, hash]);

  return (
    <div className={`w-full space-y-3 ${className}`}>
      <button
        onClick={handleWithdrawClick}
        disabled={isVerifying || isPending || isConfirming || isConfirmed}
        className={`w-full text-xs py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-1 px-2 transition-all
          ${
            isConfirmed
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-moss shadow-xl shadow-slate-200"
          }`}
      >
        {isVerifying ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Verifying Goal...
          </>
        ) : isPending ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Awaiting Wallet...
          </>
        ) : isConfirming ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Processing
            On-Chain...
          </>
        ) : isConfirmed ? (
          <>
            <TrendingUp size={18} /> Funds Withdrawn
          </>
        ) : (
          <>
            <Wallet size={18} /> Withdraw Funds (1.5% Fee)
          </>
        )}
      </button>

      {errorMsg && (
        <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-tighter bg-red-50 py-2 rounded-lg">
          ⚠️ {errorMsg}
        </p>
      )}

      {contractError && (
        <p className="text-red-500 text-[10px] font-bold text-center uppercase">
          {(contractError as BaseError).shortMessage || "Contract Error"}
        </p>
      )}
    </div>
  );
}
