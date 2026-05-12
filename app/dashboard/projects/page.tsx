"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  FolderOpen,
  LayoutGrid,
  LayoutList,
  Plus,
  Loader2,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Type (unchanged) ─────────────────────────────────────────────────────────
type Project = {
  id: string;
  niche: string;
  created_at: string;
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { user, isLoaded } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  // ─── Fetch (unchanged logic) ───────────────────────────────────────────────
  useEffect(() => {
    async function loadProjects() {
      if (!user) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoadingProjects(false);
    }

    loadProjects();
  }, [user]);

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (!isLoaded || loadingProjects) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading projects…</span>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              view === "grid" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              view === "list" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="glass border-white/10 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-zinc-500 mb-6 text-sm">Create your first project to get started.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary/25"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </Link>
        </div>
      )}

      {/* Grid view */}
      {projects.length > 0 && view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="glass border-white/10 rounded-2xl p-5 flex flex-col gap-4 group hover:border-white/20 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-1">{project.niche}</h3>
                <div className="flex items-center gap-1.5 text-zinc-600 text-[11px]">
                  <Calendar className="w-3 h-3" />
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <span className="text-[10px] px-2 py-0.5 rounded bg-green-400/10 border border-green-400/20 text-green-400 font-medium">
                  Active
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List view */}
      {projects.length > 0 && view === "list" && (
        <div className="glass border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 border-b border-white/10 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            <span className="col-span-6">Project</span>
            <span className="col-span-3">Created</span>
            <span className="col-span-3">Status</span>
          </div>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-12 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors items-center"
            >
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FolderOpen className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-white font-medium truncate">{project.niche}</span>
              </div>
              <span className="col-span-3 text-xs text-zinc-500">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
              <div className="col-span-3">
                <span className="text-[10px] px-2 py-0.5 rounded bg-green-400/10 border border-green-400/20 text-green-400 font-medium">
                  Active
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
