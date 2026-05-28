"use client";

import { motion } from "framer-motion";
import { FolderOpen, ImageIcon, SearchCheck, ShieldCheck } from "lucide-react";
import type { DashboardSummary } from "@/lib/dashboard/types";

type StatsCardsProps = {
  summary: DashboardSummary;
};

export function StatsCards({ summary }: StatsCardsProps) {
  const stats = [
    {
      label: "Projects Saved",
      value: summary.counts.projects,
      icon: FolderOpen,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
      helper: "Saved SEO outputs",
    },
    {
      label: "Trend Saves",
      value: summary.counts.trendSaves,
      icon: SearchCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      helper: "Research entries stored",
    },
    {
      label: "Images Generated",
      value: summary.counts.imageGenerations,
      icon: ImageIcon,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20",
      helper: "Real generated assets",
    },
    {
      label: "Trademark Checks",
      value: summary.counts.trademarkChecks,
      icon: ShieldCheck,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
      helper: "Saved compliance scans",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className={`glass rounded-2xl p-5 border ${stat.border} flex flex-col gap-3 group hover:border-slate-300 transition-colors`}
        >
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stat.value.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
          <p className="text-xs text-slate-400">{stat.helper}</p>
        </motion.div>
      ))}
    </div>
  );
}
