"use client";

import { useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useForm, Controller } from "react-hook-form";
import {
  Plus,
  Image as ImageIcon,
  Wallet,
  Target,
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { postRequest } from "@/lib/api";
import { uploadToCloudinary } from "@/upload";

type PaymentType = "fundraising" | "onetime";

interface CreateProjectForm {
  title: string;
  description: string;
  paymentType: PaymentType;
  minimumPayment?: number;
  fixedAmount?: number;
  fundraisingGoal?: number;
}

export default function CreateProjectPage() {
  const { address, isConnected } = useAccount();
  const [submittedProject, setSubmittedProject] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    defaultValues: { paymentType: "fundraising" },
  });

  const paymentType = watch("paymentType");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData: CreateProjectForm) => {
    if (!isConnected) return;

    try {
      setLoading(true);
      setMessage(null);

      let finalImageUrl = null;
      const file = fileInputRef.current?.files?.[0];

      if (file) {
        // 1. Wait for Cloudinary to finish
        const uploadedUrl = await uploadToCloudinary(file);
        if (!uploadedUrl) throw new Error("Image upload failed");
        finalImageUrl = uploadedUrl;
      }

      // 2. Build the payload EXPLICITLY
      // Do not just spread formData if you need to add the URL manually
      const payload = {
        title: formData.title,
        description: formData.description,
        paymentType: formData.paymentType,
        fundraisingGoal: formData.fundraisingGoal
          ? Number(formData.fundraisingGoal)
          : undefined,
        minimumPayment: formData.minimumPayment
          ? Number(formData.minimumPayment)
          : undefined,
        fixedAmount: formData.fixedAmount
          ? Number(formData.fixedAmount)
          : undefined,
        imageUrl: finalImageUrl, // <--- This ensures the URL is sent
        creatorWallet: address,
      };

      console.log("Final Payload being sent:", payload);

      const response = await postRequest("/projects/create_project", payload);

      setSubmittedProject(response.project);
      setMessage({
        type: "success",
        text: "✨ Project anchored successfully!",
      });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to create project" });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-xl max-w-md">
          <Wallet className="mx-auto text-moss mb-6" size={48} />
          <h2 className="text-2xl font-black text-slate-900 mb-2 font-montserrat uppercase">
            Wallet Disconnected
          </h2>
          <p className="text-slate-500 mb-8 font-medium">
            Please connect your wallet to access the creator launchpad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-24">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <span className="text-moss font-black uppercase tracking-[0.3em] text-[10px] bg-moss/10 px-4 py-2 rounded-full mb-4 inline-block">
          Creator Launchpad
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 font-montserrat flex flex-col md:flex-row items-center gap-4">
          Launch your <span className="text-moss">Idea</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Main Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50"
          >
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Info size={14} /> Basic Information
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-tighter">
                  Project Title
                </label>
                <input
                  {...register("title", { required: true })}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-moss focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-900"
                  placeholder="e.g., Carbon Credit Protocol"
                />
                {errors.title && (
                  <span className="text-red-500 text-[10px] font-bold ml-1 uppercase">
                    Title is required
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-tighter">
                  Description
                </label>
                <textarea
                  {...register("description", { required: true })}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-moss focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-900 min-h-30 resize-none"
                  placeholder="What are you building on Flare?"
                />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={14} /> Economic Model
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-tighter">
                    Payment Strategy
                  </label>
                  <Controller
                    control={control}
                    name="paymentType"
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-moss focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 cursor-pointer appearance-none"
                      >
                        <option value="fundraising">Fundraising</option>
                        <option value="onetime">One-time Payment</option>
                      </select>
                    )}
                  />
                </div>

                {paymentType === "fundraising" ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-tighter">
                      Goal (FLR)
                    </label>
                    <input
                      {...register("fundraisingGoal", {
                        required: true,
                        min: 1,
                      })}
                      type="number"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-moss focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900"
                      placeholder="10000"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-tighter">
                      Fixed Price (FLR)
                    </label>
                    <input
                      {...register("fixedAmount")}
                      type="number"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-moss focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900"
                      placeholder="Leave blank for open"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-moss transition-all duration-300 shadow-xl shadow-slate-200 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus size={20} />
              )}
              {loading ? "Deploying Project..." : "Deploy Project"}
            </button>
          </form>
        </div>

        {/* Sidebar / Preview */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Upload Area */}
          <div className="bg-slate-50 p-8 rounded-[3rem] border-2 border-dashed border-slate-200 hover:border-moss transition-colors group relative overflow-hidden">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              required
            />
            {previewUrl ? (
              <img
                src={previewUrl}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon
                    className="text-slate-300 group-hover:text-moss transition-colors"
                    size={32}
                  />
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                  Upload Cover Image
                </p>
              </div>
            )}
          </div>

          {/* Wallet Summary Card */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-moss/20 rounded-xl flex items-center justify-center">
                <Wallet className="text-moss" size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
                Creator Identity
              </p>
            </div>
            <p className="font-mono text-sm break-all text-moss font-bold">
              {address}
            </p>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`p-6 rounded-4xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="shrink-0" />
              ) : (
                <AlertCircle className="shrink-0" />
              )}
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-1">
                  {message.type}
                </p>
                <p className="text-sm font-bold leading-tight">
                  {message.text}
                </p>
              </div>
            </div>
          )}

          {submittedProject && (
            <div className="bg-moss p-8 rounded-[2.5rem] text-white shadow-xl animate-in zoom-in-95 duration-500">
              <h4 className="font-black font-montserrat uppercase text-sm mb-4">
                Project Anchored!
              </h4>
              <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold mb-1">
                Project ID
              </p>
              <code className="block bg-black/10 p-4 rounded-xl font-mono text-xs break-all mb-4">
                {submittedProject.projectId}
              </code>
              <p className="text-xs font-medium leading-relaxed">
                Supporters can now contribute using this ID on Prooflink.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
