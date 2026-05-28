"use client";

import { motion } from "framer-motion";
import { Database, ImageIcon, SearchCheck, ShieldCheck } from "lucide-react";
import type { DashboardSummary } from "@/lib/dashboard/types";

type DataLibraryProps = {
  summary: DashboardSummary;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function DataLibrary({ summary }: DataLibraryProps) {
  const hasAnyData =
    summary.recentTrendSaves.length > 0 ||
    summary.recentTrademarkChecks.length > 0 ||
    summary.recentImageGenerations.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.18 }}
      className="glass border-slate-200 rounded-2xl p-5 space-y-5"
    >
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-primary" />
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Real Data Library</h3>
          <p className="text-xs text-slate-500">
            Stored user data and AI outputs from this account.
          </p>
        </div>
      </div>

      {!hasAnyData ? (          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-400">
          No stored research data yet. Save a project, save a trend, run a trademark check, or generate images to build your library.
        </div>
      ) : (
        <div className="space-y-4">
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <SearchCheck className="w-3.5 h-3.5 text-emerald-400" />
              Saved Trend Keywords
            </div>
            {summary.recentTrendSaves.length === 0 ? (
              <p className="text-xs text-slate-400">No saved trend entries yet.</p>
            ) : (
              summary.recentTrendSaves.slice(0, 4).map((trend) => (                  <div key={trend.id} className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-900">{trend.niche}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {trend.keywords.length > 0 ? trend.keywords.join(", ") : "No keywords saved"}
                  </p>
                  <p className="mt-2 text-[10px] text-slate-400">{formatDate(trend.created_at)}</p>
                </div>
              ))
            )}
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Recent Trademark Checks
            </div>
            {summary.recentTrademarkChecks.length === 0 ? (
              <p className="text-xs text-slate-400">No saved trademark checks yet.</p>
            ) : (
              summary.recentTrademarkChecks.slice(0, 4).map((check) => (                  <div key={check.id} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{check.keyword}</p>
                    <p className="text-[10px] text-slate-400">{formatDate(check.created_at)}</p>
                  </div>
                  <span className="text-xs text-slate-600">{check.risk_level}</span>
                </div>
              ))
            )}
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              Recent Image Prompts
            </div>
            {summary.recentImageGenerations.length === 0 ? (
              <p className="text-xs text-slate-400">No saved image generations yet.</p>
            ) : (
              summary.recentImageGenerations.slice(0, 4).map((image) => (                  <div key={image.id} className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-900 line-clamp-2">{image.prompt}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {[image.platform, image.style].filter(Boolean).join(" • ") || "Generated image"}
                  </p>
                  <p className="mt-2 text-[10px] text-slate-400">{formatDate(image.created_at)}</p>
                </div>
              ))
            )}
          </section>
        </div>
      )}
    </motion.div>
  );
}
