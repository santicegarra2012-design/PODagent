"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  History,
  Zap,
  BrainCircuit,
  Star,
  Loader2,
  SearchX,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendsSearch } from "@/components/trends/TrendsSearch";
import { TrendCard } from "@/components/trends/TrendCard";
import type { TrendResult, TrendType } from "@/lib/trends/types";
import { useSubscription } from "@/hooks/use-subscription";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";

const PLATFORMS = ["All", "Etsy", "Amazon Merch", "Redbubble", "Pinterest", "TikTok"];

function normalizeTrend(trend: Partial<TrendResult>, index: number): TrendResult {
  const normalizedType: TrendType = trend.type === "Seasonal" ? "Seasonal" : "Evergreen";

  return {
    id: trend.id || `trend-${index}-${Date.now()}`,
    niche: trend.niche || "Untitled niche",
    score: trend.score || "Medium",
    competition: trend.competition || "Medium",
    type: normalizedType,
    platforms: trend.platforms?.length ? trend.platforms : ["Etsy", "Redbubble"],
    productIdeas: trend.productIdeas || [],
    etsyKeywords: trend.etsyKeywords || [],
    tiktokIdeas: trend.tiktokIdeas || [],
    recommendedStyles: trend.recommendedStyles || [],
    reasoning: trend.reasoning || "AI analysis returned limited detail for this result.",
  };
}

export default function TrendsPage() {
  const { isPro, isLoading: subLoading } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [trends, setTrends] = useState<TrendResult[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const filteredTrends = trends.filter(
    (trend) => selectedPlatform === "All" || trend.platforms.includes(selectedPlatform)
  );

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch("/api/research-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Trend research failed");
      }

      if (Array.isArray(data.trends)) {
        setTrends(data.trends.map((trend: Partial<TrendResult>, index: number) => normalizeTrend(trend, index)));
      } else {
        setTrends([]);
      }
    } catch (error) {
      console.error("Trend research failed:", error);
      setTrends([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (trend: TrendResult) => {
    try {
      const res = await fetch("/api/save-trend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: trend.niche,
          keywords: trend.etsyKeywords,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (subLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        title="Pro Feature: Trend Intelligence"
        description="Deep market analysis and niche discovery tools are exclusive to Pro members. Upgrade to get ahead of the competition."
      />

      {!isPro && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-3xl pointer-events-none">
          <div className="p-8 glass border-primary/20 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm pointer-events-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Pro Access Required</h3>
              <p className="text-sm text-slate-500 mt-1">
                Trend Research is a Pro feature. Upgrade to unlock AI niche discovery and saved research.
              </p>
            </div>
            <button
              onClick={() => setShowUpgrade(true)}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-600 transition-all"
            >
              Unlock Trends
            </button>
          </div>
        </div>
      )}

      <div className={cn("space-y-8", !isPro && "opacity-50 pointer-events-none blur-[1px]")}>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
                <Zap className="w-4 h-4" />
                Trend Intelligence
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Trend Research</h1>
              <p className="text-slate-500 text-sm max-w-md">
                Generate AI research briefs for POD niches. Results are model-generated summaries unless backed by external market APIs.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
              <BrainCircuit className="w-3.5 h-3.5" />
              AI Research Summary
            </div>
          </div>

          <TrendsSearch onSearch={handleSearch} isLoading={isLoading} />

          <div className="flex items-center gap-2 p-1 bg-slate-100 border border-slate-200 rounded-2xl w-fit">
            {PLATFORMS.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  selectedPlatform === platform
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
              ))}
            </div>
            <span className="text-xs text-slate-500">
              <span className="text-slate-900 font-bold">{filteredTrends.length} trends</span> shown for{" "}
              {selectedPlatform === "All" ? "all platforms" : selectedPlatform}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors">
              <Star className="w-3.5 h-3.5" />
              Opportunity
            </button>
            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors">
              <History className="w-3.5 h-3.5" />
              Recent
            </button>
          </div>
        </div>

        {!isLoading && filteredTrends.length === 0 && (
          <div className="glass border-slate-200 rounded-3xl p-12 text-center">
            <SearchX className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">
              {hasSearched ? "No trend results returned" : "Run a trend research prompt"}
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              {hasSearched
                ? "Try a more specific niche, season, or audience to get more focused AI research results."
                : "Search for a niche like 'retro fishing dads', 'back to school teacher humor', or 'minimalist gym motivation'."}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTrends.map((trend) => (
              <TrendCard key={trend.id} trend={trend} onSave={handleSave} />
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-xl">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900">AI Analyst at work</p>
                  <p className="text-sm text-slate-500">Generating a niche research brief from your prompt...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
