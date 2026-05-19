"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Loader2, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  Copy,
  Save,
  ShieldAlert,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ScoreMeter } from "@/components/optimizer/ScoreMeter";
import type { ListingData, OptimizationResults } from "@/lib/optimizer/types";

const PLATFORMS = ["Etsy", "Amazon Merch", "Redbubble"];

export default function OptimizerPage() {
  const [listing, setListing] = useState<ListingData>({
    title: "",
    tags: [],
    description: "",
    platform: "Etsy"
  });
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResults | null>(null);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing.title.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/optimize-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (error) {
      console.error("Optimization failed:", error);
      toast.error("Failed to optimize listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !listing.tags.includes(tagInput.trim())) {
      setListing({ ...listing, tags: [...listing.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setListing({ ...listing, tags: listing.tags.filter(t => t !== tag) });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
          <Zap className="w-4 h-4" />
          AI Enhancement
        </div>
        <h1 className="text-3xl font-bold text-white">Listing Optimizer</h1>
        <p className="text-zinc-500 text-sm max-w-lg">
          Increase your conversion rate and search rankings with AI-driven POD listing optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Input Form */}
        <div className="space-y-6">
          <div className="glass border-white/10 rounded-3xl p-8 space-y-6">
            {/* Platform Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Platform</label>
              <div className="flex items-center gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setListing({ ...listing, platform: p })}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                      listing.platform === p
                        ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                        : "text-zinc-500 hover:text-zinc-300 border-white/5 bg-white/5"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Product Title</label>
                <span className={cn(
                  "text-[10px] font-medium",
                  listing.title.length > 140 ? "text-red-400" : "text-zinc-500"
                )}>
                  {listing.title.length}/140
                </span>
              </div>
              <input
                type="text"
                value={listing.title}
                onChange={(e) => setListing({ ...listing, title: e.target.value })}
                placeholder="Enter your current listing title..."
                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white placeholder-zinc-700 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Tags Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tags / Keywords</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {listing.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                      <RefreshCw className="w-3 h-3 rotate-45" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add keyword and press enter..."
                  className="flex-1 bg-black/20 border border-white/5 rounded-2xl p-4 text-white placeholder-zinc-700 focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <button 
                  onClick={(e) => { e.preventDefault(); addTag(); }}
                  className="px-6 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Listing Description</label>
              <textarea
                value={listing.description}
                onChange={(e) => setListing({ ...listing, description: e.target.value })}
                placeholder="Paste your listing description here..."
                rows={8}
                className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-white placeholder-zinc-700 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
              />
            </div>

            <button
              onClick={handleOptimize}
              disabled={isLoading || !listing.title.trim()}
              className={cn(
                "w-full flex items-center justify-center gap-3 py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all",
                "bg-primary text-white shadow-[0_20px_50px_rgba(var(--primary),0.2)]",
                "hover:bg-primary-600 hover:-translate-y-1 active:translate-y-0",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Optimizing Strategy...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Run AI Optimization
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results / Right Sidebar */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div>
                  <h3 className="text-white font-bold">Analyzing Competition</h3>
                  <p className="text-zinc-500 text-xs">Finding high-conversion keywords...</p>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Scores */}
                <div className="glass border-white/10 rounded-3xl p-8 grid grid-cols-2 gap-4">
                  <ScoreMeter score={result.seoScore} label="SEO Strength" size="md" />
                  <ScoreMeter score={result.readabilityScore} label="Readability" size="md" />
                </div>

                {/* Suggestions Card */}
                <div className="glass border-white/10 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-2">
                    <Lightbulb className="w-4 h-4" />
                    AI Suggestions
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Opportunity Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((kw) => (
                        <span key={kw} className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold">
                          +{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {result.trademarkWarnings.length > 0 && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center gap-2 text-red-400 font-bold text-[10px] uppercase mb-2">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Risk Alerts
                      </div>
                      <p className="text-[10px] text-red-300/80 leading-relaxed font-medium">
                        {result.trademarkWarnings[0]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 gap-2">
                  <button className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-bold group">
                    <span className="flex items-center gap-3">
                      <Copy className="w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
                      Apply Optimizations
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-white transition-all" />
                  </button>
                  <button className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-bold group">
                    <span className="flex items-center gap-3">
                      <Save className="w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
                      Save to Dashboard
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-white transition-all" />
                  </button>
                  <button className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-bold group">
                    <span className="flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
                      IP Safety Verification
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-white transition-all" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-5 border-dashed"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-zinc-700" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-white font-bold">Analysis Ready</h3>
                  <p className="text-zinc-500 text-xs">Fill in the listing details and run the optimizer to see SEO scores.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Comparison View (only after optimization) */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Original */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Current Listing</h3>
              <div className="glass border-white/5 rounded-3xl p-8 opacity-60 grayscale-[0.5]">
                <h4 className="text-lg font-bold text-white mb-4 line-through decoration-red-500/50">{listing.title}</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {listing.tags.map(t => <span key={t} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-zinc-500">{t}</span>)}
                </div>
                <p className="text-sm text-zinc-500 whitespace-pre-wrap">{listing.description}</p>
              </div>
            </div>

            {/* Optimized */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest ml-1 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                AI Optimized
              </h3>
              <div className="glass border-primary/20 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <button className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="text-lg font-bold text-white mb-4 pr-10">{result.improvedTitle}</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {result.improvedTags.map(t => <span key={t} className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] text-primary font-bold">{t}</span>)}
                </div>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{result.improvedDescription}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
