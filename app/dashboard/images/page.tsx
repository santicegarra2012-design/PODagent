"use client";

import { useState } from "react";
import type {
  GeneratedImage,
  ImageStyle,
  AspectRatio,
  PodPlatform,
} from "@/lib/ai/image-types";
import { PromptPanel } from "@/components/images/PromptPanel";
import { ImageGrid } from "@/components/images/ImageGrid";
import { GenerationHistory } from "@/components/images/GenerationHistory";

export default function ImagesPage() {
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
        alert("❌ " + (data.message || "Image generation failed"));
        return;
      }

      const newImages: GeneratedImage[] = data.images;
      setImages(newImages);
      // Keep first image from each batch in history
      setSessionImages((prev) => [newImages[0], ...prev].slice(0, 20));
    } catch (err) {
      console.error(err);
      alert("❌ An unexpected error occurred.");
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

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto h-full">
      {/*
        Layout:
        ┌─────────────────┬──────────────────────────────┬──────────────────┐
        │  Prompt Panel   │       Image Grid              │  History Panel   │
        │  (left, fixed)  │       (center, grows)         │  (right, fixed)  │
        └─────────────────┴──────────────────────────────┴──────────────────┘
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-5 min-h-[calc(100vh-8rem)]">
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
