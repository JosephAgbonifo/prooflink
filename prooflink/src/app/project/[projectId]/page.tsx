"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest, postRequest } from "@/lib/api";
import { AxiosError } from "axios";
import { SendTransaction } from "@/payment/paybutton";
import { useAccount } from "wagmi";
import {
  Target,
  ShieldCheck,
  Info,
  Award,
  Loader2,
  Trash2,
  Wallet2,
  CheckCheck,
} from "lucide-react";
import ProjectContributions from "@/components/paymentContribution";
import { WithdrawButton } from "@/payment/withdrawButton";

interface Project {
  projectId: string;
  title: string;
  description: string;
  ImageUrl?: string;
  paymentType: "fundraising" | "onetime";
  minimumPayment?: number;
  fixedAmount?: number;
  fundraisingGoal?: number;
  withdrawalStatus: boolean;
  creatorWallet: string;
}

interface Progress {
  current: number;
  goal: number;
  raw_percent: number;
  percent_completion: string;
  balance: number;
  payeeCount?: number;
}

interface Check {
  hasPaid: boolean;
  paymentCount: number;
}

export default function ProjectPage() {
  const [amount, setAmount] = useState("");
  const params = useParams();
  const projectId = params?.projectId as string;
  const [inputError, setInputError] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [progressData, setProgressData] = useState<Progress | null>(null);
  const [check, setCheck] = useState<Check | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); // New state
  const router = useRouter(); // Initialize router
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    if (!projectId) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch Project Details & Progress in Parallel
        const [projectRes, progressRes, check] = await Promise.all([
          getRequest(`/projects/get_project/${projectId}`),
          getRequest(`/payments/fundraising_progress/${projectId}`), // Corrected Endpoint
          postRequest(`/payments/check`, { projectId, walletAddress: address }),
        ]);

        setProject(projectRes);
        setProgressData(progressRes);
        setCheck(check);

        // Auto-set amount if it's a one-time fixed payment
        if (projectRes.fixedAmount) {
          setAmount(projectRes.fixedAmount.toString());
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("❌ Project not found or network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [projectId]);

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await postRequest(`/projects/delete`, { projectId });
      router.push("/projects");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // 1. Check if the error came from the server (AxiosError)
        if (err.response && err.response.data) {
          // This pulls the "message" you wrote in the backend: res.status(400).json({ message: "..." })
          const errorMessage = err.response.data.message;
          setError(errorMessage);
        }
        // 2. Check if it's a network error (server is down)
        else if (err.request) {
          setError(
            "The server is not responding. Please check your connection."
          );
        }
        // 3. Something else happened during setup
        else {
          setError("An error occurred: " + err.message);
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
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

  if (error || !project)
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 font-medium font-montserrat">
        {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <Trash2 className="text-red-500" size={32} />
            </div>

            <h2 className="text-3xl font-black text-slate-900 font-montserrat mb-4">
              Delete Project?
            </h2>

            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              You are about to remove{" "}
              <span className="text-slate-900 font-bold">{project.title}</span>{" "}
              from the ecosystem. This action is cryptographically final and
              cannot be undone.
              <strong>All supports will be returned to donator's wallet</strong>
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Nevermind
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-200 hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: Media & Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moss/10 text-moss text-[10px] font-black uppercase tracking-widest">
              <Award size={14} /> Verified Protocol Project
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight font-montserrat">
              {project.title}
            </h1>
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
            <img
              src={project.ImageUrl || "/placeholder.png"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4 font-montserrat">
              <Info className="text-moss" size={20} /> Project Brief
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              {project.description}
            </p>
          </div>
          <ProjectContributions projectId={projectId} />
        </div>

        {/* RIGHT COLUMN: Payment Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 space-y-8">
            {/* Progress Section */}
            {project.paymentType === "fundraising" && progressData && (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Total Raised
                    </span>
                    <span className="text-3xl font-black text-slate-900 font-montserrat">
                      {progressData.current.toLocaleString()}{" "}
                      <span className="text-sm text-moss">FLR</span>
                    </span>
                  </div>
                  <span className="text-xl font-black text-moss font-montserrat bg-moss/5 px-3 py-1 rounded-xl">
                    {progressData.percent_completion}
                  </span>
                </div>

                <div className="h-4 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden p-1">
                  <div
                    className="h-full bg-moss rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_12px_rgba(58,111,81,0.2)]"
                    style={{
                      width: `${Math.min(progressData.raw_percent, 100)}%`,
                    }}
                  />
                </div>

                <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-tighter">
                  Goal: {progressData.goal.toLocaleString()} FLR
                </p>
                <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-tighter">
                  Balance: {progressData.balance} FLR
                </p>
              </div>
            )}
            {project.paymentType === "onetime" && progressData && (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Total Paid
                    </span>
                    <span className="text-3xl font-black text-slate-900 font-montserrat">
                      {progressData.current}{" "}
                      <span className="text-sm text-moss">FLR</span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Balance
                    </span>
                    <span className="text-3xl font-black text-slate-900 font-montserrat">
                      {progressData.balance}{" "}
                      <span className="text-sm text-moss">FLR</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900 font-montserrat">
                    <span className="text-xs text-moss">
                      {" "}
                      {progressData.payeeCount
                        ? progressData.payeeCount
                        : 0}{" "}
                      person(s) paid
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Input Section */}
            {progressData?.percent_completion === "100%" ? (
              <p>Project Complete, Thanks for your contribution</p>
            ) : (
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest">
                  {project.fixedAmount
                    ? "Fixed Contribution"
                    : "Contribution Amount"}
                </label>
                <div className="relative">
                  <input
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-moss focus:bg-white rounded-2xl outline-none transition-all font-black text-2xl text-slate-900"
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      if (
                        progressData &&
                        Number(e.target.value) <= progressData.balance
                      ) {
                        setAmount(e.target.value);
                        setInputError("");
                      } else {
                        setInputError(
                          "Support cannot be greater than project balance"
                        );
                      }
                    }}
                    disabled={!!project.fixedAmount}
                    placeholder="0.00"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">
                    FLR
                  </span>
                </div>
                {inputError ? <p className="text-red-500">{inputError}</p> : ""}

                {project.minimumPayment && !project.fixedAmount && (
                  <p className="text-center text-[10px] font-bold text-slate-400">
                    Min required: {project.minimumPayment} FLR
                  </p>
                )}
              </div>
            )}

            <SendTransaction
              className={`${
                progressData?.percent_completion === "100%" ||
                (check?.paymentCount != 0 && project.paymentType === "onetime")
                  ? "hidden"
                  : ""
              }`}
              text={
                project.paymentType === "fundraising"
                  ? "Support Project"
                  : "Buy Now"
              }
              amount={amount}
              projectId={projectId}
              disabled={amount != "" ? "false" : "true"}
            />

            {check?.hasPaid ? (
              <p className="text-center text-moss text-xs">You've paid</p>
            ) : (
              ""
            )}

            <WithdrawButton
              className={`${
                !project.withdrawalStatus ||
                project.creatorWallet != String(address) ||
                Number(progressData?.current) != Number(progressData?.goal)
                  ? "hidden"
                  : ""
              }`}
              projectId={projectId}
            />

            <WithdrawButton
              className={`${
                project.paymentType != "onetime" ||
                project.creatorWallet != String(address) ||
                Number(progressData?.balance) === 0
                  ? "hidden"
                  : ""
              }`}
              projectId={projectId}
            />

            <button
              onClick={() => setShowDeleteModal(true)} // Open modal instead of alert
              className={`mt-2 p-3 text-red-500 hover:text-red-50 bg-red-50 hover:bg-red-500 border-red-500 boorder-2 rounded-2xl transition-all duration-300 ${
                project.withdrawalStatus === true ? "hidden" : ""
              }`}
            >
              <Trash2 size={20} />
            </button>

            <div className="pt-6 border-t border-slate-50 space-y-4">
              <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                <ShieldCheck size={18} className="text-moss" />
                ISO 20022 Verified Receipt
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
