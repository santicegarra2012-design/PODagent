"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Tag, FileText, Type, Lightbulb } from "lucide-react";

interface SeoResult {
  title: string;
  tags: string[];
  description: string;
}

interface ResultsPanelProps {
  result: SeoResult;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-zinc-400 hover:text-white"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Copy
        </>
      )}
    </button>
  );
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
        Generated Results
      </h3>

      {/* Title Card */}
      <motion.div
        variants={cardVariants}
        className="glass border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-400/10">
              <Type className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-white">Suggested Title</span>
          </div>
          <CopyButton text={result.title} />
        </div>
        <p className="text-zinc-200 text-sm leading-relaxed bg-white/5 rounded-xl px-4 py-3 border border-white/10">
          {result.title}
        </p>
      </motion.div>

      {/* Tags Card */}
      <motion.div
        variants={cardVariants}
        className="glass border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-400/10">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-sm font-semibold text-white">SEO Tags</span>
            <span className="text-xs text-zinc-600 font-medium">({result.tags.length})</span>
          </div>
          <CopyButton text={result.tags.join(", ")} />
        </div>
        <div className="flex flex-wrap gap-2">
          {result.tags.length > 0 ? (
            result.tags.map((tag, i) => (
              <button
                key={i}
                onClick={() => navigator.clipboard.writeText(tag)}
                className="px-3 py-1.5 bg-purple-400/10 text-purple-300 border border-purple-400/20 rounded-full text-xs font-medium hover:bg-purple-400/20 transition-colors"
              >
                {tag}
              </button>
            ))
          ) : (
            <span className="text-zinc-600 text-sm">No tags generated</span>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-400/5 border border-blue-400/10">
          <Lightbulb className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <p className="text-xs text-zinc-500">Optimized for Etsy &amp; Redbubble algorithms</p>
        </div>
      </motion.div>

      {/* Description Card */}
      <motion.div
        variants={cardVariants}
        className="glass border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-green-400/10">
              <FileText className="w-3.5 h-3.5 text-green-400" />
            </div>
            <span className="text-sm font-semibold text-white">Description</span>
          </div>
          <CopyButton text={result.description} />
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed">
          {result.description}
        </p>
      </motion.div>
    </motion.div>
  );
}
