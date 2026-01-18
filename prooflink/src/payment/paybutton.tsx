"use client";
import * as React from "react";
import {
  type BaseError,
  useWriteContract, // Changed from useSendTransaction
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { postRequest } from "@/lib/api";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

// 1. Add your Contract ABI (just the contribute function for now)
const VAULT_ABI = [
  {
    name: "contribute",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "_projectId", type: "string" }],
    outputs: [],
  },
] as const;

const VAULT_ADDRESS = "0xf40F7818a0FaA8834BA157DaF4822d7821Bf8c15"; // Replace with your deployed contract address

interface Data {
  amount: string;
  text: string;
  paymentId: string;
  projectId: string;
  payerWallet: `0x${string}` | undefined;
}

export function SendTransaction({
  amount,
  text,
  projectId,
  className,
  disabled,
}: {
  amount: string;
  text: string;
  projectId: string;
  className: string;
  disabled: "true" | "false";
}) {
  const [paymentId, setPaymentId] = useState("");
  const { address } = useAccount();
  const router = useRouter();

  // 2. Setup the Write Contract Hook
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // Handle Form Submission
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Call the 'contribute' function on your smart contract
    writeContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "contribute",
      args: [projectId], // Pass the projectId to the contract
      value: parseEther(amount), // Send the actual FLR amount
    });
  }

  // 3. Monitor Transaction Progress
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Update paymentId locally once we have a hash
  useEffect(() => {
    if (hash) setPaymentId(hash);
  }, [hash]);

  // 4. Send to Backend only after Blockchain confirmation
  useEffect(() => {
    if (isConfirmed && paymentId) {
      const syncBackend = async () => {
        try {
          const res = await postRequest("/proofrails/add_payment", {
            amount,
            text,
            paymentId,
            projectId,
            payerWallet: address,
          });
          router.push("/my-payments/" + res.payment.receiptId);
        } catch (err) {
          console.error("Backend sync failed:", err);
        }
      };
      syncBackend();
    }
  }, [isConfirmed, paymentId, amount, text, projectId, address, router]);

  return (
    <form onSubmit={submit} className={`space-y-2 ${className}`}>
      <button
        disabled={isPending || isConfirming || disabled === "true"}
        type="submit"
        className="bg-moss text-white w-full h-12 rounded-xl font-bold flex items-center justify-center transition-all hover:opacity-90 disabled:bg-slate-300"
      >
        {isPending
          ? "Waiting for Wallet..."
          : isConfirming
          ? "Processing..."
          : text}
      </button>

      {/* Transaction Status UI */}
      {hash && (
        <div className="text-[10px] text-slate-500 font-mono text-center">
          Hash: {hash.slice(0, 6)}...{hash.slice(-4)}
        </div>
      )}

      {error && (
        <div className="text-red-500 text-xs text-center mt-2">
          {(error as BaseError).shortMessage || "Transaction failed"}
        </div>
      )}
    </form>
  );
}
