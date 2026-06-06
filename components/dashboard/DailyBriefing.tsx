"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, DollarSign, ListTodo, Loader2 } from "lucide-react";
import { AiActionCard } from "@/components/ui/AiActionCard";

interface BriefingData {
  topOpportunity: string;
  pendingTasksCount: number;
  recommendedAction: string;
  businessSummary: string;
}

export function DailyBriefing() {
  const [data, setData] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBriefing() {
      try {
        const res = await fetch("/api/dashboard/briefing");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch briefing:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBriefing();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-slate-900 border border-white/10 rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating your daily business briefing...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 w-full relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Sparkles className="w-64 h-64" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Daily Briefing</h2>
          </div>
          
          <p className="text-lg text-slate-300 leading-relaxed mb-6 font-medium">
            {data.businessSummary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Est. Monthly Revenue</p>
                <p className="text-xl font-bold text-white">$0.00</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                <ListTodo className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Pending Tasks</p>
                <p className="text-xl font-bold text-white">{data.pendingTasksCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <AiActionCard
            title="Top Opportunity"
            description={data.topOpportunity}
            actionText="Research Niche"
            type="opportunity"
          />
          <AiActionCard
            title="Recommended Action"
            description={data.recommendedAction}
            actionText="Take Action"
            type="recommendation"
          />
        </div>
      </div>
    </motion.div>
  );
}
