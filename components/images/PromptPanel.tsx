"use client";

import { cn } from "@/lib/utils";
import {
  STYLE_LABELS,
  ASPECT_RATIO_LABELS,
  PLATFORM_LABELS,
  PROMPT_CHIPS,
} from "@/lib/ai/image-mock";
import type {
  ImageStyle,
  AspectRatio,
  PodPlatform,
} from "@/lib/ai/image-types";
import { Sparkles, Loader2, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PromptPanelProps {
  prompt: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
  platform: PodPlatform;
  loading: boolean;
  onPromptChange: (v: string) => void;
  onStyleChange: (v: ImageStyle) => void;
  onAspectRatioChange: (v: AspectRatio) => void;
  onPlatformChange: (v: PodPlatform) => void;
  onGenerate: () => void;
}

// ─── Reusable select ──────────────────────────────────────────────────────────
function PremiumSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all pr-8 cursor-pointer"
        >
          {(Object.keys(options) as T[]).map((key) => (
            <option key={key} value={key} className="bg-zinc-900 text-white">
              {options[key]}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export function PromptPanel({
  prompt,
  style,
  aspectRatio,
  platform,
  loading,
  onPromptChange,
  onStyleChange,
  onAspectRatioChange,
  onPlatformChange,
  onGenerate,
}: PromptPanelProps) {
  const appendChip = (chip: string) => {
    const trimmed = prompt.trim();
    onPromptChange(trimmed ? `${trimmed}, ${chip.toLowerCase()}` : chip.toLowerCase());
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col gap-5 h-full"
    >
      {/* Prompt textarea */}
      <div className="glass border-white/10 rounded-2xl p-4 flex flex-col gap-3">
        <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe your design… e.g. 'vintage cat astronaut on the moon, minimalist'"
          rows={5}
          disabled={loading}
          className="w-full bg-transparent text-sm text-white placeholder-zinc-700 focus:outline-none resize-none leading-relaxed disabled:opacity-50"
        />

        {/* Chip strip */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
          {PROMPT_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => appendChip(chip)}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-400 text-[11px] font-medium hover:bg-white/10 hover:text-white hover:border-white/20 transition-all disabled:opacity-40"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="glass border-white/10 rounded-2xl p-4 space-y-4">
        <PremiumSelect
          label="Art Style"
          value={style}
          options={STYLE_LABELS}
          onChange={onStyleChange}
        />
        <PremiumSelect
          label="Aspect Ratio"
          value={aspectRatio}
          options={ASPECT_RATIO_LABELS}
          onChange={onAspectRatioChange}
        />
        <PremiumSelect
          label="POD Platform"
          value={platform}
          options={PLATFORM_LABELS}
          onChange={onPlatformChange}
        />

        {/* Color Palette Selector */}
        <div className="space-y-1.5 pt-2">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Color Palette
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[
              { name: "Vibrant", colors: ["bg-red-500", "bg-yellow-400", "bg-blue-500"] },
              { name: "Pastel", colors: ["bg-pink-200", "bg-blue-200", "bg-purple-200"] },
              { name: "Earth", colors: ["bg-amber-800", "bg-emerald-900", "bg-stone-500"] },
              { name: "Neon", colors: ["bg-fuchsia-500", "bg-cyan-400", "bg-lime-400"] },
              { name: "Mono", colors: ["bg-black", "bg-zinc-500", "bg-white"] },
            ].map((palette) => (
              <button
                key={palette.name}
                title={palette.name}
                className="group relative flex flex-col items-center gap-1 focus:outline-none"
              >
                <div className="flex h-6 w-full overflow-hidden rounded-md border border-white/10 group-hover:border-primary/50 transition-colors">
                  {palette.colors.map((c, idx) => (
                    <div key={idx} className={cn("flex-1", c)} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={loading || !prompt.trim()}
        className={cn(
          "w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
          "bg-primary text-white shadow-lg shadow-primary/25",
          "hover:bg-primary-600 active:scale-[0.98]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Images
          </>
        )}
      </button>
    </motion.aside>
  );
}
