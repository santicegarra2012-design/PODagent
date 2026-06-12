"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LineChart,
  Target,
  Palette,
  TrendingUp,
  ArrowRight,
  Loader2,
  SearchX,
} from "lucide-react";
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

export default function ResearchCenterPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const res = await fetch("/api/opportunities");
        if (res.ok) {
          const data = await res.json();
          setOpportunities(data.slice(0, 3)); // show top 3
        }
      } catch (err) {
        console.error("Failed to fetch opportunities for Research Center:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunities();
  }, []);

  const researchTools = [
    {
      title: "Trend Research",
      description: "Analyze viral search terms, Google Trends data, and emerging market demands.",
      icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
      href: "/dashboard/trends",
    },
    {
      title: "Opportunities",
      description: "View top-ranked product niches scored by AI for opportunity vs competition.",
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      href: "/dashboard/opportunities",
    },
    {
      title: "Design Studio",
      description: "Explore generated artwork prompts and create premium POD designs using AI.",
      icon: <Palette className="w-6 h-6 text-purple-400" />,
      href: "/dashboard/images",
    },
    {
      title: "Market Analysis",
      description: "Deep dive into product metrics, keywords, listing structures, and optimization.",
      icon: <LineChart className="w-6 h-6 text-amber-400" />,
      href: "/dashboard/trends",
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Research Center</h1>
        <p className="text-slate-400 mt-2">
          Discover profitable niches, analyze trends, and find winning designs.
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {researchTools.map((tool, idx) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className="group relative overflow-hidden bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-slate-850 transition-colors">
                {tool.icon}
              </div>
              <Link
                href={tool.href}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Explore <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                {tool.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom section: Top Opportunities Preview */}
      <div className="border-t border-white/10 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Top Opportunities</h2>
            <p className="text-xs text-slate-500 mt-1">High-potential print-on-demand niches ranked by AI</p>
          </div>
          <Link
            href="/dashboard/opportunities"
            className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : opportunities.length === 0 ? (
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <SearchX className="w-8 h-8 text-slate-500 mb-3" />
            <p className="text-slate-400 text-sm">No opportunites found. Ask Copilot to analyze some niches.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp, idx) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900 border border-white/10 rounded-2xl p-6"
              >
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Niche
                </span>
                <h3 className="text-lg font-bold text-white mt-3 capitalize">{opp.niche}</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Opportunity Score</span>
                    <span className="text-emerald-400 font-semibold">{opp.opportunity_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${opp.opportunity_score}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
