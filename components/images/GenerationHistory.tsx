"use client";

import { motion } from "framer-motion";
import { Clock, ImageIcon, Heart } from "lucide-react";
import type { GeneratedImage } from "@/lib/ai/image-types";
import { STYLE_LABELS } from "@/lib/ai/image-mock";
import Image from "next/image";
import Link from "next/link";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface GenerationHistoryProps {
  recentImages?: GeneratedImage[];
}

export function GenerationHistory({ recentImages = [] }: GenerationHistoryProps) {
  const allHistory = recentImages.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass border-white/10 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Recent Generations
          </h3>
        </div>
        <Link
          href="/dashboard/history"
          className="text-xs text-primary hover:text-primary-400 font-medium transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-2">
        {allHistory.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <ImageIcon className="w-7 h-7 text-zinc-700" />
            <p className="text-xs text-zinc-600">No real image generations yet</p>
          </div>
        ) : (
          allHistory.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-white/10">
                <Image
                  src={img.url}
                  alt={img.prompt}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-300 truncate font-medium">{img.prompt}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-zinc-600 capitalize">
                    {STYLE_LABELS[img.style]}
                  </span>
                  <span className="text-zinc-800">·</span>
                  <span className="text-[10px] text-zinc-600">{timeAgo(img.createdAt)}</span>
                </div>
              </div>

              {"isFavorite" in img && img.isFavorite && (
                <Heart className="w-3 h-3 text-red-400 fill-current shrink-0" />
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
