"use client";

import { motion } from "framer-motion";
import { FolderOpen, Zap, TrendingUp, Sparkles } from "lucide-react";

const stats = [
  {
    label: "Projects Saved",
    value: "12",
    icon: FolderOpen,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    change: "+3 this week",
  },
  {
    label: "SEO Generations",
    value: "48",
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    change: "+12 today",
  },
  {
    label: "Trending Niches",
    value: "7",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    change: "Updated daily",
  },
  {
    label: "AI Credits Left",
    value: "142",
    icon: Sparkles,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    change: "Resets monthly",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className={`glass rounded-2xl p-5 border ${stat.border} flex flex-col gap-3 group hover:border-white/20 transition-colors`}
        >
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{stat.label}</p>
          </div>
          <p className="text-xs text-zinc-600">{stat.change}</p>
        </motion.div>
      ))}
    </div>
  );
}
