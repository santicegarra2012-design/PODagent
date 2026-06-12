"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { DataLibrary } from "@/components/dashboard/DataLibrary";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { GeneratorPanel } from "@/components/dashboard/GeneratorPanel";
import { ResultsPanel } from "@/components/dashboard/ResultsPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { DailyBriefing } from "@/components/dashboard/DailyBriefing";
import type { DashboardSummary } from "@/lib/dashboard/types";

type SeoResult = { title: string; tags: string[]; description: string };

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [niche, setNiche] = useState("");
  const [seoResult, setSeoResult] = useState<string | SeoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [seoRetryCountdown, setSeoRetryCountdown] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetch("/api/dashboard/summary");
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to load dashboard summary");
        }

        setSummary(json.data);
      } catch (error) {
        console.error("[dashboard] Failed to load summary:", error);
      }
    }

    if (isLoaded && user) {
      loadSummary();
    }
  }, [isLoaded, user]);

  async function createProject() {
    if (!user) {
      toast.error("Please sign in to save projects.");
      return;
    }

    if (!seoResult || typeof seoResult !== "object" || !("title" in seoResult)) {
      toast.error("Please generate SEO content first before saving.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/save-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          title: seoResult.title,
          tags: seoResult.tags,
          description: seoResult.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed to save project\n\n" + (data.message || "Unknown error"));
        return;
      }

      toast.success("Project saved to library!");
      setSummary((prev) =>
        prev
          ? {
              ...prev,
              counts: {
                ...prev.counts,
                projects: prev.counts.projects + 1,
              },
              recentProjects: [data.data, ...prev.recentProjects].slice(0, 6),
            }
          : prev
      );
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  }

  async function generateSEO(autoRetry = false) {
    if (!niche.trim()) {
      toast.error("Please enter a niche");
      return;
    }

    if (loading) return;

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < 1000 && !autoRetry) {
      const waitTime = Math.ceil((1000 - timeSinceLastRequest) / 1000);
      toast.error(`Please wait ${waitTime} second${waitTime !== 1 ? "s" : ""} before making another request.`);
      return;
    }

    setLoading(true);
    setLastRequestTime(now);

    try {
      const response = await fetch("/api/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 && data.retryDelay && !autoRetry) {
          const retryDelay = data.retryDelay;
          setSeoRetryCountdown(retryDelay);

          const countdownInterval = setInterval(() => {
            setSeoRetryCountdown((prev) => {
              if (prev === null || prev <= 1) {
                clearInterval(countdownInterval);
                setTimeout(() => {
                  setSeoRetryCountdown(null);
                  generateSEO(true);
                }, 100);
                return null;
              }
              return prev - 1;
            });
          }, 1000);

          return;
        }

        const errorMessage = data?.message || data?.error || "SEO generation failed";
        setSeoResult(errorMessage);
        toast.error("Error\n\n" + errorMessage);
        return;
      }

      if (data && typeof data === "object" && !Array.isArray(data) && "title" in data) {
        const { title, tags, description } = data as {
          title?: string;
          tags?: string[];
          description?: string;
        };
        setSeoResult({
          title: title || "No title generated",
          tags: Array.isArray(tags) ? tags : [],
          description: description || "No description generated",
        });
      } else {
        setSeoResult(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error(error);
      toast.error("SEO generation failed");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAll() {
    if (!seoResult || typeof seoResult !== "object") return;
    const text = `TITLE:\n${seoResult.title}\n\nTAGS:\n${seoResult.tags.join(", ")}\n\nDESCRIPTION:\n${seoResult.description}`;
    navigator.clipboard.writeText(text);
  }

  if (!isLoaded || !summary) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Daily Briefing Skeleton */}
        <div className="w-full rounded-2xl border border-white/10 bg-slate-900/50 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-800 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-slate-800 rounded animate-pulse" />
              <div className="h-3 w-24 bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-20 w-full bg-slate-800 rounded-xl animate-pulse" />
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-slate-900 border border-white/10 rounded-2xl animate-pulse" />
          <div className="h-28 bg-slate-900 border border-white/10 rounded-2xl animate-pulse" />
          <div className="h-28 bg-slate-900 border border-white/10 rounded-2xl animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="h-44 bg-slate-900 border border-white/10 rounded-2xl animate-pulse" />
            <div className="h-64 bg-slate-900 border border-white/10 rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-slate-900 border border-white/10 rounded-2xl animate-pulse" />
            <div className="h-72 bg-slate-900 border border-white/10 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const structuredResult =
    seoResult && typeof seoResult === "object" && "title" in seoResult
      ? (seoResult as SeoResult)
      : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DailyBriefing />
      <StatsCards summary={summary} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <GeneratorPanel
            niche={niche}
            loading={loading}
            seoRetryCountdown={seoRetryCountdown}
            onNicheChange={setNiche}
            onGenerate={() => generateSEO()}
          />

          <AnimatePresence mode="wait">
            {structuredResult && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <ResultsPanel result={structuredResult} />
              </motion.div>
            )}
          </AnimatePresence>

          <DataLibrary summary={summary} />
        </div>

        <div className="space-y-4">
          <QuickActions
            onGenerate={() => generateSEO()}
            onSave={createProject}
            onCopyAll={handleCopyAll}
            isSaving={isSaving}
            hasResult={!!structuredResult}
          />
          <RecentProjects projects={summary.recentProjects} />
        </div>
      </div>
    </div>
  );
}
