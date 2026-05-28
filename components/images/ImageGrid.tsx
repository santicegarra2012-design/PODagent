"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Heart, RefreshCw, ImageIcon, Sparkles, FileText, Check } from "lucide-react";
import type { GeneratedImage } from "@/lib/ai/image-types";
import { cn } from "@/lib/utils";
import Image from "next/image";

// ─── Loading skeleton grid ─────────────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
          className="aspect-square rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex flex-col items-center justify-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary/50" />
          </div>
          <div className="space-y-1.5 w-20">
            <div className="h-1.5 rounded bg-slate-200" />
            <div className="h-1.5 rounded bg-slate-100 w-3/4" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center h-full min-h-[360px] text-center px-8"
    >
      <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
        <ImageIcon className="w-9 h-9 text-primary/60" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Your canvas awaits</h3>
      <p className="text-sm text-slate-500 max-w-xs">
        Describe a design, choose your style, and hit Generate to create stunning POD artwork.
      </p>
    </motion.div>
  );
}

// ─── Single image card ─────────────────────────────────────────────────────────
function ImageCard({
  image,
  onFavorite,
}: {
  image: GeneratedImage;
  onFavorite: (id: string) => void;
}) {
  const [favorited, setFavorited] = useState(image.isFavorite);

  const handleFavorite = () => {
    setFavorited((v) => !v);
    onFavorite(image.id);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = image.url;
    a.download = `pod-agent-${image.id}.jpg`;
    a.target = "_blank";
    a.click();
  };

  const [copied, setCopied] = useState(false);
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white"
    >
      <Image
        src={image.url}
        alt={image.prompt}
        fill
        unoptimized
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <p className="text-[10px] text-slate-200 truncate max-w-[60%]">{image.style}</p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFavorite}
            className={cn(
              "p-1.5 rounded-lg backdrop-blur-sm transition-colors",
              favorited
                ? "bg-red-500/80 text-white"
                : "bg-black/60 text-zinc-300 hover:text-red-400"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", favorited && "fill-current")} />
          </button>
          <button
            onClick={handleCopyPrompt}
            className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-zinc-300 hover:text-white transition-colors"
            title="Copy Prompt"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <FileText className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-zinc-300 hover:text-white transition-colors"
            title="Download Image"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
interface ImageGridProps {
  images: GeneratedImage[];
  loading: boolean;
  onFavorite: (id: string) => void;
  onRegenerate: () => void;
}

export function ImageGrid({ images, loading, onFavorite, onRegenerate }: ImageGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass border-slate-200 rounded-2xl p-5 flex flex-col gap-4 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Generated Images</h2>
          {images.length > 0 && (
            <p className="text-xs text-slate-500">{images.length} images created</p>
          )}
        </div>
        {images.length > 0 && !loading && (
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Regenerate
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SkeletonGrid />
            </motion.div>
          ) : images.length > 0 ? (
            <motion.div
              key="images"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-3"
            >
              {images.map((img) => (
                <ImageCard key={img.id} image={img} onFavorite={onFavorite} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
