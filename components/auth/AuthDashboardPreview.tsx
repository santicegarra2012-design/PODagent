"use client";

import { motion } from "framer-motion";
import { BarChart3, Sparkles, TrendingUp, Zap } from "lucide-react";

const stats = [
  { label: "Listings optimized", value: "2.4k", icon: Zap, accent: "text-cyan-400" },
  { label: "Trend score", value: "94%", icon: TrendingUp, accent: "text-violet-400" },
  { label: "SEO tags generated", value: "18k", icon: BarChart3, accent: "text-blue-400" },
];

export function AuthDashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25 }}
      className="relative w-full max-w-lg"
    >
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 via-violet-500/10 to-cyan-500/20 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Merch Agent</p>
              <p className="text-xs text-slate-500">AI Command Center</p>
            </div>
            <div className="ml-auto flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </div>
            </div>
        </div>

        <div className="relative space-y-4 p-5">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <stat.icon className={`mb-2 h-4 w-4 ${stat.accent}`} />
                <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                <p className="text-[10px] leading-tight text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Niche performance</span>
              <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                Live
              </span>
            </div>
            <div className="flex h-24 items-end gap-2">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600/80 to-cyan-400/60"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <p className="text-xs text-slate-600">
              <span className="font-medium text-slate-900">AI insight:</span> Retro gaming niche trending +34% this week
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
