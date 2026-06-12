"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  DollarSign,
  ListTodo,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react";
import { AiActionCard } from "@/components/ui/AiActionCard";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

interface BriefingData {
  topOpportunity: string;
  pendingTasksCount: number;
  recommendedAction: string;
  businessSummary: string;
}

export function DailyBriefing() {
  const [data, setData] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchBriefing() {
      try {
        const res = await fetch("/api/dashboard/briefing");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch briefing:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchBriefing();
  }, []);

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full rounded-2xl border border-white/10 bg-slate-900 p-8 text-center">
        <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">Could not load your daily briefing. Try refreshing.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 shadow-2xl shadow-indigo-500/5"
    >
      {/* Decorative gradient orbs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Daily Briefing</h2>
              <p className="text-xs text-slate-500">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/copilot"
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Open Copilot <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Business Summary */}
        <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-white/5">
          <p className="text-slate-200 leading-relaxed font-medium">
            {data.businessSummary}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            iconBg="bg-emerald-500/20"
            iconColor="text-emerald-400"
            label="Est. Monthly Revenue"
            value="$0.00"
          />
          <StatCard
            icon={<ListTodo className="w-5 h-5" />}
            iconBg="bg-blue-500/20"
            iconColor="text-blue-400"
            label="Pending Tasks"
            value={String(data.pendingTasksCount)}
          />
          <AiActionCard
            title="Top Opportunity"
            description={data.topOpportunity}
            actionText="Research"
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

function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
      <div className={`p-3 ${iconBg} ${iconColor} rounded-lg shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
