"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FolderOpen, Clock } from "lucide-react";
import Link from "next/link";
import type { DashboardSummary } from "@/lib/dashboard/types";

type RecentProjectsProps = {
  projects: DashboardSummary["recentProjects"];
};

function formatRelativeTime(date: string) {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const [query, setQuery] = useState("");

  const filtered = projects.filter(
    (project) =>
      project.niche.toLowerCase().includes(query.toLowerCase()) ||
      project.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25 }}
      className="glass border-slate-200 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Recent Projects
        </h3>
        <Link
          href="/dashboard/projects"
          className="text-xs text-primary hover:text-primary-400 font-medium transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FolderOpen className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-400">
              {projects.length === 0 ? "No projects saved yet" : "No projects found"}
            </p>
          </div>
        ) : (
          filtered.map((project) => (
            <div
              key={project.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <FolderOpen className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-900 truncate group-hover:text-primary transition-colors">
                  {project.title}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{project.niche}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400">
                    {project.tags.length} tags
                  </span>
                  <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-2.5 h-2.5" />
                    {formatRelativeTime(project.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
