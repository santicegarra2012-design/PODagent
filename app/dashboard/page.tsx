"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

import { StatsCards } from "@/components/dashboard/StatsCards";
import { GeneratorPanel } from "@/components/dashboard/GeneratorPanel";
import { ResultsPanel } from "@/components/dashboard/ResultsPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentProjects } from "@/components/dashboard/RecentProjects";

// ─── Types ───────────────────────────────────────────────────────────────────
type SeoResult = { title: string; tags: string[]; description: string };

// ─── Page ────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const [niche, setNiche] = useState("");
  const [seoResult, setSeoResult] = useState<string | SeoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [seoRetryCountdown, setSeoRetryCountdown] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ─── Save project ─────────────────────────────────────────────────────────
  async function createProject() {
    if (!user) {
      alert("Please sign in to save projects.");
      return;
    }

    if (!seoResult || typeof seoResult !== "object" || !("title" in seoResult)) {
      alert("Please generate SEO content first before saving.");
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
        alert("❌ Failed to save project\n\n" + (data.message || "Unknown error"));
        return;
      }

      alert("✅ Project saved to library!");
    } catch (error) {
      console.error("Error saving project:", error);
      alert("❌ An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  }

  // ─── Generate SEO ─────────────────────────────────────────────────────────
  async function generateSEO(autoRetry: boolean = false) {
    if (!niche.trim()) {
      alert("Please enter a niche");
      return;
    }

    if (loading) return;

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < 1000 && !autoRetry) {
      const waitTime = Math.ceil((1000 - timeSinceLastRequest) / 1000);
      alert(`⏰ Please wait ${waitTime} second${waitTime !== 1 ? "s" : ""} before making another request.`);
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
      console.log(data);

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
        alert("❌ Error\n\n" + errorMessage);
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
      alert("SEO generation failed");
    } finally {
      setLoading(false);
    }
  }

  // ─── Copy all helper ──────────────────────────────────────────────────────
  function handleCopyAll() {
    if (!seoResult || typeof seoResult !== "object") return;
    const text = `TITLE:\n${seoResult.title}\n\nTAGS:\n${seoResult.tags.join(", ")}\n\nDESCRIPTION:\n${seoResult.description}`;
    navigator.clipboard.writeText(text);
  }

  // ─── Loading gate ─────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  const structuredResult =
    seoResult && typeof seoResult === "object" && "title" in seoResult
      ? (seoResult as SeoResult)
      : null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Stats */}
      <StatsCards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Generator + Results */}
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

          {/* AI Image Generation Teaser */}
          <AnimatePresence>
            {structuredResult && !loading && (
              <motion.div
                key="image-teaser"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="glass border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-400/10 border border-pink-400/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">AI Image Generation</h4>
                    <p className="text-xs text-zinc-500">Coming soon — generate product mockups with AI directly from your niche.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-500 font-medium">
                    Coming Soon
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Sidebar panels */}
        <div className="space-y-4">
          <QuickActions
            onGenerate={() => generateSEO()}
            onSave={createProject}
            onCopyAll={handleCopyAll}
            isSaving={isSaving}
            hasResult={!!structuredResult}
          />
          <RecentProjects />
        </div>
      </div>
    </div>
  );
}
