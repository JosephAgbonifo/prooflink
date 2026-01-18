"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRequest } from "@/lib/api";
import { useAccount } from "wagmi";
import { Rocket, Target, ArrowRight, ShieldCheck, Search } from "lucide-react";

interface ProgressData {
  goal: number;
  current: number;
  percent_completion: string;
  raw_percent: number;
  currency: string;
}

interface Project {
  projectId: string;
  title: string;
  description: string;
  ImageUrl?: string;
  paymentType: "fundraising" | "onetime";
  fundraisingGoal?: number;
  currentRaised?: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Added address to dependency array if you want to filter by user eligibility
        const res = await getRequest(
          `/projects/get_all?walletaddress=${address || ""}`
        );
        setProjects(res);

        // Fetch progress for fundraising projects
        const fundraisingProjects = res.filter(
          (p: Project) => p.paymentType === "fundraising"
        );
        if (fundraisingProjects.length > 0) {
          const progressPromises = fundraisingProjects.map(
            async (p: Project) => {
              try {
                const data = await getRequest(
                  `/payments/fundraising_progress/${p.projectId}`
                );
                const progress = data.goal
                  ? Math.min(((data.current || 0) / data.goal) * 100, 100)
                  : 0;
                return { projectId: p.projectId, progress };
              } catch (err) {
                console.error(
                  `Failed to fetch progress for ${p.projectId}`,
                  err
                );
                return { projectId: p.projectId, progress: 0 };
              }
            }
          );
          const progressResults = await Promise.all(progressPromises);
          const newProgressMap = progressResults.reduce(
            (acc, { projectId, progress }) => {
              acc[projectId] = progress;
              return acc;
            },
            {} as Record<string, number>
          );
          setProgressMap(newProgressMap);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [address]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-moss rounded-full animate-spin" />
        <p className="text-slate-400 font-montserrat animate-pulse">
          Scanning Flare Ecosystem...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-moss font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
            <ShieldCheck size={14} />
            Verified Coston2 Projects
          </div>
          <h1 className="text-4xl md:text-6xl font-montserrat font-black text-slate-900 leading-tight">
            Explore <span className="text-moss">Opportunities</span>
          </h1>
          <p className="mt-4 text-slate-500 text-lg">
            Support builders and creators using cryptographically anchored ISO
            20022 payments.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="py-24 text-center bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
          <div className="bg-white w-20 h-20 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
            <Rocket className="text-slate-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            No projects found
          </h3>
          <p className="text-slate-500 mt-2">
            Check back later or try connecting a different wallet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projects.map((project) => {
            const progress = progressMap[project.projectId] || 0;

            return (
              <Link
                key={project.projectId}
                href={`/project/${project.projectId}`}
                className="group relative bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Media Section */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  {project.ImageUrl ? (
                    <img
                      src={project.ImageUrl}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-slate-50 text-slate-300">
                      <Rocket
                        size={40}
                        className="group-hover:rotate-12 transition-transform"
                      />
                    </div>
                  )}

                  {/* Status Overlay */}
                  <div className="absolute top-5 left-5">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl backdrop-blur-md shadow-sm ${
                        project.paymentType === "fundraising"
                          ? "bg-moss text-white"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      {project.paymentType === "fundraising"
                        ? "Fundraising"
                        : "One Time"}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col grow">
                  <h2 className="font-montserrat font-bold text-slate-900 text-2xl line-clamp-1 mb-3 group-hover:text-moss transition-colors">
                    {project.title}
                  </h2>

                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-8 grow">
                    {project.description}
                  </p>

                  {project.paymentType === "fundraising" && (
                    <div className="mb-8 space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Target size={12} /> Goal Progress
                        </span>
                        <span className="text-sm font-black text-slate-900">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-moss rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-50 flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-moss transition-colors">
                      View Project{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono">
                      ID: {project.projectId.slice(0, 6)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
