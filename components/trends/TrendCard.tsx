"use client";

import { motion } from "framer-motion";
import { 
  Bookmark,
  CheckCircle2,
  Loader2,
  Calendar,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { TrendResult, TrendScore, CompetitionLevel, TrendType } from "@/lib/trends/types";
import Link from "next/link";

interface TrendCardProps {
  trend: TrendResult;
  onSave?: (trend: TrendResult) => Promise<void>;
}

const scoreColors: Record<TrendScore, string> = {
  "Very High": "text-green-400 bg-green-400/10 border-green-400/20",
  "High": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Medium": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Low": "text-slate-400 bg-slate-400/10 border-slate-400/20",
};

const competitionColors: Record<CompetitionLevel, string> = {
  "Low": "text-green-400",
  "Medium": "text-amber-400",
  "High": "text-orange-400",
  "Crowded": "text-red-400",
};

const typeColors: Record<TrendType, string> = {
  "Evergreen": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Seasonal": "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export function TrendCard({ trend, onSave }: TrendCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSave && !saved) {
      setIsSaving(true);
      onSave(trend).then(() => setSaved(true)).finally(() => setIsSaving(false));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border-slate-200 rounded-2xl overflow-hidden group hover:border-slate-300 transition-all duration-300 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200 relative overflow-hidden flex-1">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={handleSave}
            disabled={isSaving || saved}
            className={cn(
              "p-2 rounded-xl transition-all",
              saved 
                ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                : "bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            )}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
            scoreColors[trend.score]
          )}>
            {trend.score} Score
          </span>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1",
            typeColors[trend.type]
          )}>
            {trend.type === "Evergreen" ? <Layers className="w-2.5 h-2.5" /> : <Calendar className="w-2.5 h-2.5" />}
            {trend.type}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors pr-8">
          {trend.niche}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
          {trend.reasoning}
        </p>

        {/* Platforms */}
        <div className="flex items-center gap-3">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Targets</p>
          <div className="flex items-center gap-1.5">
            {trend.platforms.map((p) => (
              <span key={p} className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200">
        <div className="p-4 border-r border-slate-200">
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Competition</p>
          <div className="flex items-center gap-1.5">
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-1000",
                  trend.competition === "Low" ? "w-1/4 bg-green-400" :
                  trend.competition === "Medium" ? "w-1/2 bg-amber-400" :
                  trend.competition === "High" ? "w-3/4 bg-orange-400" : "w-full bg-red-400"
                )}
              />
            </div>
            <span className={cn("text-[10px] font-bold whitespace-nowrap", competitionColors[trend.competition])}>
              {trend.competition}
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Product Ideas</p>
          <p className="text-[10px] text-slate-600 font-medium truncate">
            {trend.productIdeas.join(", ")}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 grid grid-cols-2 gap-2 bg-slate-100/50">
        <Link 
          href={`/dashboard?niche=${encodeURIComponent(trend.niche)}`}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary hover:bg-primary/20 transition-all group/btn"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Analyze SEO
          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
        </Link>
        <Link 
          href={`/dashboard/trademark?keyword=${encodeURIComponent(trend.niche)}`}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all group/btn"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          IP Check
          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
        </Link>
      </div>
    </motion.div>
  );
}
