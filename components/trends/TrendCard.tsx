"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Target, 
  ShoppingBag, 
  Hash, 
  Video, 
  Palette, 
  Bookmark,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { TrendResult, TrendScore, CompetitionLevel } from "@/lib/trends/types";

interface TrendCardProps {
  trend: TrendResult;
  onSave?: (trend: TrendResult) => Promise<void>;
}

const scoreColors: Record<TrendScore, string> = {
  "Very High": "text-green-400 bg-green-400/10 border-green-400/20",
  "High": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Medium": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Low": "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
};

const competitionColors: Record<CompetitionLevel, string> = {
  "Low": "text-green-400",
  "Medium": "text-amber-400",
  "High": "text-orange-400",
  "Crowded": "text-red-400",
};

export function TrendCard({ trend, onSave }: TrendCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (onSave && !saved) {
      setIsSaving(true);
      try {
        await onSave(trend);
        setSaved(true);
      } catch (error) {
        console.error("Failed to save trend:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={handleSave}
            disabled={isSaving || saved}
            className={cn(
              "p-2 rounded-xl transition-all",
              saved 
                ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10"
            )}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            scoreColors[trend.score]
          )}>
            {trend.score} Trend
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {trend.niche}
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
          {trend.reasoning}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 border-b border-white/10">
        <div className="p-4 border-r border-white/10">
          <p className="text-[10px] text-zinc-500 uppercase font-semibold mb-1">Competition</p>
          <div className="flex items-center gap-1.5">
            <BarChart3 className={cn("w-3.5 h-3.5", competitionColors[trend.competition])} />
            <span className={cn("text-xs font-bold", competitionColors[trend.competition])}>
              {trend.competition}
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] text-zinc-500 uppercase font-semibold mb-1">Profit Potential</p>
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-white">High</span>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-6 space-y-5">
        {/* Product Ideas */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Product Ideas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trend.productIdeas.map((idea, i) => (
              <span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
                {idea}
              </span>
            ))}
          </div>
        </div>

        {/* Etsy Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <Hash className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Etsy Keywords</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trend.etsyKeywords.map((kw, i) => (
              <span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-orange-400/5 border border-orange-400/20 text-orange-300/80">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* TikTok/Marketing */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-2 text-zinc-400">
              <Video className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Content</span>
            </div>
            <ul className="space-y-1">
              {trend.tiktokIdeas.slice(0, 2).map((idea, i) => (
                <li key={i} className="text-[10px] text-zinc-500 flex items-start gap-1">
                  <span className="text-primary mt-0.5">•</span>
                  {idea}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 text-zinc-400">
              <Palette className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Styles</span>
            </div>
            <ul className="space-y-1">
              {trend.recommendedStyles.slice(0, 2).map((style, i) => (
                <li key={i} className="text-[10px] text-zinc-500 flex items-start gap-1">
                  <span className="text-primary mt-0.5">•</span>
                  {style}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
