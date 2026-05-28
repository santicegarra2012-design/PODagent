"use client";

import { useState } from "react";
import { toast } from "sonner";
import type {
  GeneratedImage,
  ImageStyle,
  AspectRatio,
  PodPlatform,
} from "@/lib/ai/image-types";
import { PromptPanel } from "@/components/images/PromptPanel";
import { ImageGrid } from "@/components/images/ImageGrid";
import { GenerationHistory } from "@/components/images/GenerationHistory";

import { useSubscription } from "@/hooks/use-subscription";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImagesPage() {
  const { isPro, isLoading } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  // ─── Generation state ──────────────────────────────────────────────────────
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ImageStyle>("none");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [platform, setPlatform] = useState<PodPlatform>("etsy");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [sessionImages, setSessionImages] = useState<GeneratedImage[]>([]);

  // ─── Generate ──────────────────────────────────────────────────────────────
  async function handleGenerate() {
    if (!isPro) {
      setShowUpgrade(true);
      return;
    }
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setImages([]);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, aspectRatio, platform }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Image generation failed");
        return;
      }

      const newImages: GeneratedImage[] = data.images;
      setImages(newImages);
      // Keep first image from each batch in history
      setSessionImages((prev) => [newImages[0], ...prev].slice(0, 20));
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Favorite toggle ───────────────────────────────────────────────────────
  function handleFavorite(id: string) {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
      )
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto h-full relative">
      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        title="Pro Feature: Image Studio"
        description="High-quality AI image generation is exclusive to Pro members. Upgrade now to start creating professional POD artwork."
      />

      {!isPro && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-3xl pointer-events-none">
          <div className="p-8 glass border-primary/20 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm pointer-events-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Pro Feature</h3>
              <p className="text-sm text-slate-500 mt-1">
                The AI Image Studio is part of our Pro plan. Upgrade to unlock unlimited high-res image generation.
              </p>
            </div>
            <button 
              onClick={() => setShowUpgrade(true)}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-600 transition-all"
            >
              Unlock Now
            </button>
          </div>
        </div>
      )}

      <div className={cn(
        "grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-5 min-h-[calc(100vh-8rem)]",
        !isPro && "opacity-50 pointer-events-none blur-[1px]"
      )}>
        {/* Left: Prompt & Controls */}
        <PromptPanel
          prompt={prompt}
          style={style}
          aspectRatio={aspectRatio}
          platform={platform}
          loading={loading}
          onPromptChange={setPrompt}
          onStyleChange={setStyle}
          onAspectRatioChange={setAspectRatio}
          onPlatformChange={setPlatform}
          onGenerate={handleGenerate}
        />

        {/* Center: Image Grid */}
        <ImageGrid
          images={images}
          loading={loading}
          onFavorite={handleFavorite}
          onRegenerate={handleGenerate}
        />

        {/* Right: History */}
        <GenerationHistory recentImages={sessionImages} />
      </div>
    </div>
  );
}

