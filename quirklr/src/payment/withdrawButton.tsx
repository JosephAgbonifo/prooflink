"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { getRequest, postRequest } from "@/lib/api";
import { Loader2, TrendingUp, Wallet } from "lucide-react";
import { type Address, type Hash } from "viem";

const VAULT_ABI = [
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_projectId", type: "string" }],
    outputs: [],
  },
] as const;

const VAULT_ADDRESS: Address = "0xEDf96Da0164148fC37886dCA57790054C1322C9A";

type WithdrawStep =
  | "idle"
  | "verifying"
  | "signing"
  | "confirming"
  | "syncing"
  | "success";

export function WithdrawButton({
  projectId,
  className,
}: {
  projectId: string;
  className: string;
}) {
  const [txStep, setTxStep] = useState<WithdrawStep>("idle");
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<Hash | undefined>();

  const { writeContractAsync } = useWriteContract();

  // Watch the withdrawal confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const handleWithdrawClick = async () => {
    setDisplayError(null);
    setTxStep("verifying");

    try {
      // 1. Check fundraising progress from backend
      const progress = await getRequest(
        `/payments/fundraising_progress/${projectId}`
      );

      const rawPercent = Number(progress.raw_percent);

      if (rawPercent < 100) {
        throw new Error(
          `Goal not met. Current progress: ${progress.percent_completion}`
        );
      }

      // 2. Trigger Smart Contract Withdrawal using Async
      setTxStep("signing");
      const hash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "withdraw",
        args: [projectId],
      });

      setTxHash(hash);
      setTxStep("confirming");
    } catch (err: any) {
      console.error("Withdrawal Error:", err);
      setTxStep("idle");
      const msg =
        err.shortMessage ||
        err.cause?.shortMessage ||
        err.message ||
        "Withdrawal failed";
      setDisplayError(msg);
    }
  };

  // 3. Sync with backend once confirmed
  useEffect(() => {
    if (isConfirmed && txHash && txStep === "confirming") {
      const syncWithdrawal = async () => {
        setTxStep("syncing");
        try {
          await postRequest("/projects/withdraw", { projectId, txHash });
          setTxStep("success");
        } catch (err) {
          setDisplayError(
            "Funds withdrawn on-chain, but dashboard update failed."
          );
        }
      };
      syncWithdrawal();
    }
  }, [isConfirmed, txHash, projectId, txStep]);

  const getButtonLabel = () => {
    switch (txStep) {
      case "verifying":
        return "Verifying Goal...";
      case "signing":
        return "Check Wallet...";
      case "confirming":
        return "Processing on Flare...";
      case "syncing":
        return "Updating Records...";
      case "success":
        return "Funds Withdrawn";
      default:
        return "Withdraw Funds (1.5% Fee)";
    }
  };

  return (
    <div className={`w-full space-y-3 ${className}`}>
      <button
        onClick={handleWithdrawClick}
        disabled={txStep !== "idle" && txStep !== "success"}
        className={`w-full text-xs py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-1 px-2 transition-all
          ${
            txStep === "success"
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-moss shadow-xl shadow-slate-200"
          }`}
      >
        {txStep !== "idle" && txStep !== "success" ? (
          <Loader2 className="animate-spin" size={18} />
        ) : txStep === "success" ? (
          <TrendingUp size={18} />
        ) : (
          <Wallet size={18} />
        )}
        <span className="ml-2">{getButtonLabel()}</span>
      </button>

      {displayError && (
        <div className="text-red-500 text-[10px] text-center mt-2 font-bold bg-red-50 p-2 rounded-lg border border-red-100">
          ⚠️ {displayError}
        </div>
      )}

      {txHash && (
        <div className="text-[10px] text-slate-400 font-mono text-center">
          Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
        </div>
      )}
    </div>
  );
}
