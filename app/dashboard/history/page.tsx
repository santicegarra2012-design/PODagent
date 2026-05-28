"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Loader2,
  AlertTriangle,
  BookOpen,
  Trash2,
  Copy,
  RefreshCw,
  SortAsc,
} from "lucide-react";
import Link from "next/link";

// ─── Types (unchanged) ────────────────────────────────────────────────────────
interface Project {
  id: string;
  niche: string;
  title: string | null;
  tags: string[] | null;
  description: string | null;
  created_at: string;
}

// ─── Copy button with success flash ──────────────────────────────────────────
function CopyBtn({ text, label }: { text: string | null; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) {
      toast.error(`No ${label} to copy.`);
      return;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={handleCopy}
      title={`Copy ${label}`}
      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
    >
      {copied ? (
        <span className="text-[10px] font-medium text-green-400 px-1">✓</span>
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const { user, isLoaded } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // ─── Fetch (unchanged logic) ───────────────────────────────────────────────
  useEffect(() => {
    async function fetchProjects() {
      if (!isLoaded || !user) return;

      try {
        const res = await fetch("/api/projects");
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to fetch projects");
        }

        setProjects(json.data || []);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [isLoaded, user]);

  // ─── Delete (unchanged logic) ──────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      toast.error("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // ─── Derived data ──────────────────────────────────────────────────────────
  const filteredProjects = projects
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      return p.niche?.toLowerCase().includes(q) || p.title?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });

  // ─── Loading / Skeleton ────────────────────────────────────────────────────
  if (!isLoaded || isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-slate-400 py-12 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading history…</span>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search niche or title…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <SortAsc className="w-3.5 h-3.5" />
            {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </button>
          <span className="text-xs text-slate-400 pl-2">
            {filteredProjects.length} of {projects.length}
          </span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="glass border-red-500/20 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">Error Loading History</h3>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm text-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )}

      {/* Empty — no projects */}
      {!error && projects.length === 0 && (
        <div className="glass border-slate-200 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No history yet</h3>
          <p className="text-slate-500 mb-6 text-sm">Generate SEO content to see your history here.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary/25"
          >
            Create New Generation
          </Link>
        </div>
      )}

      {/* Empty — search */}
      {!error && projects.length > 0 && filteredProjects.length === 0 && (
        <div className="glass border-slate-200 rounded-2xl p-12 text-center">
          <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">No results found</h3>
          <p className="text-sm text-slate-500 mb-4">Nothing matches &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-primary text-sm font-medium hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Projects grid */}
      {!error && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="glass border-slate-200 rounded-2xl p-5 flex flex-col group hover:border-slate-300 transition-all"
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium truncate max-w-[70%]">
                  {project.niche}
                </span>
                <button
                  onClick={() => handleDelete(project.id)}
                  title="Delete"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug">
                {project.title || "Untitled Project"}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
                {project.description || "No description available."}
              </p>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500 text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-400 text-[10px]"
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(project.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-1">
                  <CopyBtn text={project.title} label="Title" />
                  <CopyBtn text={project.tags ? project.tags.join(", ") : null} label="Tags" />
                  <CopyBtn text={project.description} label="Description" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
