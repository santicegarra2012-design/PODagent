"use client";

import { motion } from "framer-motion";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratorPanelProps {
  niche: string;
  loading: boolean;
  seoRetryCountdown: number | null;
  onNicheChange: (value: string) => void;
  onGenerate: () => void;
}

export function GeneratorPanel({
  niche,
  loading,
  seoRetryCountdown,
  onNicheChange,
  onGenerate,
}: GeneratorPanelProps) {
  const isRetrying = seoRetryCountdown !== null;
  const isBusy = loading || isRetrying;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className="glass rounded-2xl border-white/10 overflow-hidden"
    >
      {/* Panel header */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">AI SEO Generator</h2>
          <p className="text-xs text-zinc-500">Enter a niche to generate titles, tags &amp; descriptions</p>
        </div>
      </div>

      {/* Input area */}
      <div className="px-6 py-6">
        <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
          Niche / Theme
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={niche}
              onChange={(e) => onNicheChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isBusy && onGenerate()}
              placeholder="e.g., Retro 80s Cyberpunk Cats"
              disabled={isBusy}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-50"
            />
          </div>
          <button
            onClick={onGenerate}
            disabled={isBusy}
            className={cn(
              "relative px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shrink-0 transition-all overflow-hidden",
              "bg-primary text-white hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed",
              "shadow-lg shadow-primary/25"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : isRetrying ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Retrying in {seoRetryCountdown}s
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate SEO
              </>
            )}
          </button>
        </div>

        {/* Loading state */}
        {isBusy && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            {isRetrying ? (
              <div className="rounded-xl p-4 bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-orange-400 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    AI servers busy — auto-retrying…
                  </span>
                  <span className="text-xs font-bold text-orange-400">{seoRetryCountdown}s</span>
                </div>
                <div className="w-full h-1.5 bg-orange-900/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((seoRetryCountdown ?? 0) / 60) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-4 bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    Analyzing niche trends…
                  </span>
                  <span className="text-xs font-bold text-primary">Processing</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: "40%" }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
