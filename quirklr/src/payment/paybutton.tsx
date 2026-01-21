"use client";
import * as React from "react";
import {
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useConfig,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { parseUnits, erc20Abi, type Address, type Hash } from "viem";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { myAbi } from "@/data";
import { postRequest } from "@/lib/api";

// Constants
const VAULT_ADDRESS: Address = "0xEDf96Da0164148fC37886dCA57790054C1322C9A";
const NATIVE_TOKEN: Address = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

interface SendTransactionProps {
  amount: string;
  text: string;
  projectId: string;
  currency: string;
  className?: string;
  disabled?: string;
}

type TxStep = "idle" | "approving" | "paying" | "syncing" | "error";

export function SendTransaction({
  amount,
  text,
  projectId,
  currency,
  className = "",
  disabled = "false",
}: SendTransactionProps) {
  const { address } = useAccount();
  const config = useConfig();
  const router = useRouter();

  const [txStep, setTxStep] = useState<TxStep>("idle");
  const [displayError, setDisplayError] = useState<string | null>(null);

  // Track the FINAL contribution hash specifically to prevent state tangling
  const [contributionHash, setContributionHash] = useState<Hash | undefined>();

  const { writeContractAsync } = useWriteContract();

  // Specifically watch the second (final) transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: contributionHash });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTxStep("idle");
    setDisplayError(null);
    setContributionHash(undefined);

    // 1. Determine Decimals and Address (USDT0/FXRP = 6, C2FLR = 18)
    let tokenAddr: Address = NATIVE_TOKEN;
    let decimals = 18;

    if (currency === "USDT0") {
      tokenAddr = "0xC1A5B41512496B80903D1f32d6dEa3a73212E71F";
      decimals = 6;
    } else if (currency === "FXRP") {
      tokenAddr = "0x8b4abA9C4BD7DD961659b02129beE20c6286e17F";
      decimals = 6;
    }

    const amountInSmallestUnit = parseUnits(amount, decimals);

    try {
      // STEP 1: APPROVAL (Only for ERC20s)
      if (tokenAddr.toLowerCase() !== NATIVE_TOKEN.toLowerCase()) {
        setTxStep("approving");
        const approveHash = await writeContractAsync({
          address: tokenAddr,
          abi: erc20Abi,
          functionName: "approve",
          args: [VAULT_ADDRESS, amountInSmallestUnit],
        });

        // Block until approved
        await waitForTransactionReceipt(config, {
          hash: approveHash,
          confirmations: 1,
        });
      }

      // STEP 2: CONTRIBUTION
      setTxStep("paying");
      const finalHash = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: myAbi,
        functionName: "contribute",
        args: [projectId, amountInSmallestUnit],
        value:
          tokenAddr.toLowerCase() === NATIVE_TOKEN.toLowerCase()
            ? amountInSmallestUnit
            : 0n,
      });

      // Update specific hash to trigger the second listener
      setContributionHash(finalHash);
    } catch (err: any) {
      console.error("Tx Flow Failed:", err);
      setTxStep("error");
      const msg =
        err.shortMessage ||
        err.cause?.shortMessage ||
        err.message ||
        "Transaction failed";
      setDisplayError(msg);
      setTimeout(() => setTxStep("idle"), 3000);
    }
  }

  // STEP 3: BACKEND SYNC
  useEffect(() => {
    if (isConfirmed && contributionHash && txStep === "paying") {
      const syncBackend = async () => {
        setTxStep("syncing");
        try {
          const res = await postRequest("/proofrails/add_payment", {
            amount,
            text,
            paymentId: contributionHash,
            projectId,
            payerWallet: address,
            currency,
          });
          router.push(`/my-payments/${res.payment.receiptId}`);
        } catch (err) {
          setDisplayError("Payment successful, but dashboard sync failed.");
          setTxStep("error");
        }
      };
      syncBackend();
    }
  }, [
    isConfirmed,
    contributionHash,
    txStep,
    amount,
    text,
    projectId,
    address,
    router,
  ]);

  const getButtonLabel = () => {
    if (txStep === "approving") return "Approve Token...";
    if (txStep === "paying")
      return isConfirming ? "Confirming on Flare..." : "Sign Payment...";
    if (txStep === "syncing") return "Saving Receipt...";
    if (txStep === "error") return "Try Again";
    return text;
  };

  return (
    <form onSubmit={submit} className={`space-y-2 ${className}`}>
      <button
        disabled={txStep !== "idle" || disabled === "true"}
        type="submit"
        className="bg-moss text-white w-full h-12 rounded-xl font-bold transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {getButtonLabel()}
      </button>

      {displayError && (
        <div className="text-red-500 text-[10px] text-center mt-2 font-bold bg-red-50 p-2 rounded-lg border border-red-100">
          ⚠️ {displayError}
        </div>
      )}

      {contributionHash && (
        <div className="text-[10px] text-slate-400 font-mono text-center">
          Tx: {contributionHash.slice(0, 10)}...{contributionHash.slice(-8)}
        </div>
      )}
    </form>
  );
}
