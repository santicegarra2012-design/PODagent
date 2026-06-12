"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, SearchX, AlertCircle } from "lucide-react";
import { CardSkeleton } from "@/components/ui/Skeleton";

interface Opportunity {
  id: string;
  niche: string;
  trend_score: number;
  competition_score: number;
  opportunity_score: number;
  source: string;
  created_at: string;
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const res = await fetch("/api/opportunities");
        if (res.ok) {
          const data = await res.json();
          setOpportunities(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch opportunities:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunities();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-emerald-500 text-emerald-400";
    if (score >= 50) return "bg-amber-500 text-amber-400";
    return "bg-rose-500 text-rose-400";
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Opportunities</h1>
        <p className="text-slate-400 mt-2">
          Top market opportunities ranked by AI analysis based on trend strength and competition metrics.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : error ? (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <AlertCircle className="w-8 h-8 text-rose-500 mb-3" />
          <p className="text-slate-400 text-sm">Failed to load opportunities. Please try again later.</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <SearchX className="w-8 h-8 text-slate-500 mb-3" />
          <p className="text-slate-400 text-sm">No opportunities discovered yet. Ask Copilot to analyze trending print-on-demand niches to populate this dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp, idx) => {
            const oppColorClass = getScoreColor(opp.opportunity_score).split(" ")[1];
            const oppBgBarClass = getScoreColor(opp.opportunity_score).split(" ")[0];

            return (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/5 uppercase tracking-wider">
                      {opp.source || "AI"}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{new Date(opp.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mt-4 capitalize tracking-tight">
                    {opp.niche}
                  </h3>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Opportunity Score */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Opportunity Score</span>
                      <span className={`${oppColorClass} font-bold`}>{opp.opportunity_score}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${oppBgBarClass} h-full rounded-full transition-all`}
                        style={{ width: `${opp.opportunity_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Trend vs Competition Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Trend Strength</p>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">{opp.trend_score}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Competition</p>
                      <p className="text-sm font-bold text-slate-250 mt-0.5">{opp.competition_score}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
