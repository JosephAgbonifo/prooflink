"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRequest } from "@/lib/api";
import { Rocket, Target, ArrowRight, Layers, ShieldCheck } from "lucide-react";
import { BrandQRCode } from "@/components/qr";

interface Project {
  projectId: string;
  title: string;
  description: string;
  ImageUrl?: string;
  paymentType: "fundraising" | "onetime";
  fundraisingGoal?: number;
}

interface ProgressMap {
  [key: string]: {
    current: number;
    goal: number;
    raw_percent: number;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [progressMap, setProgressMap] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 1. Fetch all projects
        const allProjects: Project[] = await getRequest("/projects/get_all");
        setProjects(allProjects);

        // 2. Filter fundraising projects and fetch their real-time progress
        const fundraisingIds = allProjects
          .filter((p) => p.paymentType === "fundraising")
          .map((p) => p.projectId);

        if (fundraisingIds.length > 0) {
          const progressResults = await Promise.all(
            fundraisingIds.map(async (id) => {
              try {
                const data = await getRequest(
                  `/payments/fundraising_progress/${id}`
                );
                return { id, data };
              } catch {
                return { id, data: null };
              }
            })
          );

          // 3. Build a map for easy lookup during render
          const newMap: ProgressMap = {};
          progressResults.forEach((res) => {
            if (res.data) newMap[res.id] = res.data;
          });
          setProgressMap(newMap);
        }
      } catch (err) {
        console.error("Failed to fetch ecosystem data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-moss rounded-full animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          ...Fetching...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-moss font-black uppercase tracking-[0.3em] text-[10px] mb-3">
            <ShieldCheck size={14} /> Verified Ecosystem
          </div>
          <h1 className="text-4xl md:text-6xl font-montserrat font-black text-slate-900 leading-tight">
            Explore <span className="text-moss">Projects</span>
          </h1>
          <p className="mt-4 text-slate-500 text-lg font-medium">
            Support builders using cryptographically anchored ISO 20022 payments
            on Flare.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Rocket className="mx-auto text-slate-200 mb-6" size={64} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            No projects active in this sector
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project) => {
            // Get progress from the map, or default to 0
            const stats = progressMap[project.projectId];
            const displayPercent = stats ? Math.min(stats.raw_percent, 100) : 0;

            return (
              <Link
                key={project.projectId}
                href={`/project/${project.projectId}`}
                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col"
              >
                <div className="relative h-60 bg-slate-100 overflow-hidden">
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
                  <div className="absolute top-6 left-6">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl backdrop-blur-md shadow-sm border border-white/20 ${
                        project.paymentType === "fundraising"
                          ? "bg-moss text-white"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      {project.paymentType}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col grow">
                  <h2 className="font-montserrat font-black text-slate-900 text-2xl line-clamp-1 mb-3 group-hover:text-moss transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-8 grow font-medium leading-relaxed">
                    {project.description}
                  </p>

                  {project.paymentType === "fundraising" && (
                    <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Target size={12} /> Progress
                        </span>
                        <span className="text-sm font-black text-slate-900 font-montserrat">
                          {displayPercent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-moss rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${displayPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-50 flex justify-between items-center mt-auto">
                    <span className="text-xs font-black text-slate-900 group-hover:text-moss transition-colors flex items-center gap-2 uppercase tracking-tighter">
                      View Project{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono font-bold">
                      {project.projectId.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <BrandQRCode value={"0x123...abc"} logoImage="/logo.png" />
    </div>
  );
}
