"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Sparkles, 
  Search, 
  History,
  Zap,
  Globe,
  Star,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendsSearch } from "@/components/trends/TrendsSearch";
import { TrendCard } from "@/components/trends/TrendCard";
import type { TrendResult } from "@/lib/trends/types";

// ─── Mock initial trends ──────────────────────────────────────────────────────
const INITIAL_TRENDS: TrendResult[] = [
  {
    id: "t1",
    niche: "Retro Racing Aesthetics",
    score: "Very High",
    competition: "Medium",
    type: "Evergreen",
    platforms: ["Etsy", "Redbubble", "Pinterest"],
    productIdeas: ["Oversized Tees", "Enamel Pins", "Trucker Hats"],
    etsyKeywords: ["vintage racing shirt", "f1 aesthetic", "90s motorsport"],
    tiktokIdeas: ["Style with baggy jeans", "POV: you love 90s cars"],
    recommendedStyles: ["Distressed", "Primary Colors", "Checkered patterns"],
    reasoning: "Heavy nostalgia trend combined with the rise of motorsport popularity among Gen Z."
  },
  {
    id: "t2",
    niche: "Cottagecore Botanical",
    score: "High",
    competition: "High",
    type: "Seasonal",
    platforms: ["Etsy", "Amazon Merch", "Instagram"],
    productIdeas: ["Tote Bags", "Postcards", "Aprons"],
    etsyKeywords: ["botanical illustration", "vintage herb shirt", "cottagecore gift"],
    tiktokIdeas: ["Unboxing aesthetic tote", "Cozy morning vlog with art"],
    recommendedStyles: ["Line art", "Watercolor", "Neutral earth tones"],
    reasoning: "Seasonal evergreen trend that peaks in spring and summer seasons."
  },
  {
    id: "t3",
    niche: "Funny Dad Jokes (Tech Edition)",
    score: "High",
    competition: "Low",
    type: "Evergreen",
    platforms: ["Amazon Merch", "Redbubble"],
    productIdeas: ["Coffee Mugs", "Tech Stickers", "Polo Shirts"],
    etsyKeywords: ["coder dad gift", "funny programmer shirt", "it support joke"],
    tiktokIdeas: ["Dad jokes for software engineers", "Office humor skits"],
    recommendedStyles: ["Minimalist Sans Serif", "Monochrome"],
    reasoning: "Specific niche cross-over between fatherhood and tech professions has high conversion."
  }
];

const PLATFORMS = ["All", "Etsy", "Amazon Merch", "Redbubble", "Pinterest", "TikTok"];

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendResult[]>(INITIAL_TRENDS);
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const filteredTrends = trends.filter(t => 
    selectedPlatform === "All" || t.platforms.includes(selectedPlatform)
  );

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setIsSearching(true);
    try {
      const res = await fetch("/api/research-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.trends) {
        // Map types correctly for the new interface
        const mappedTrends = data.trends.map((t: any) => ({
          ...t,
          id: t.id || Math.random().toString(36).slice(2, 10),
          type: t.type || (Math.random() > 0.5 ? "Evergreen" : "Seasonal"),
          platforms: t.platforms || ["Etsy", "Redbubble"]
        }));
        setTrends(mappedTrends);
      }
    } catch (error) {
      console.error("Trend research failed:", error);
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
      throw error;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero / Search Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
              <Zap className="w-4 h-4" />
              Trend Intelligence
            </div>
            <h1 className="text-3xl font-bold text-white">Trend Research</h1>
            <p className="text-zinc-500 text-sm max-w-md">
              Discover viral POD niches and market opportunities powered by AI analysis.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <Globe className="w-3.5 h-3.5" />
            Live Market Sync
          </div>
        </div>

        <TrendsSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* Platform Filters */}
        <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
          {PLATFORMS.map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                selectedPlatform === platform
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-black" />
            ))}
          </div>
          <span className="text-xs text-zinc-500">
            <span className="text-white font-bold">{filteredTrends.length} trends</span> found for {selectedPlatform === "All" ? "your niche" : selectedPlatform}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
            <Star className="w-3.5 h-3.5" />
            Most Popular
          </button>
          <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
            <History className="w-3.5 h-3.5" />
            Recent
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTrends.map((trend) => (
            <TrendCard 
              key={trend.id} 
              trend={trend} 
              onSave={handleSave}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-primary animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">AI Analyst at work</p>
                <p className="text-sm text-zinc-500">Scanning Etsy, TikTok, and Google Trends…</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
