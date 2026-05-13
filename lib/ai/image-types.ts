// ─── Image Generation Types ───────────────────────────────────────────────────
// These types are designed to be provider-agnostic.
// Swap the provider in `generate-image/route.ts` without touching the UI.

export type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

export type ImageStyle =
  | "none"
  | "vintage"
  | "retro"
  | "minimalist"
  | "cartoon"
  | "anime"
  | "grunge"
  | "cyberpunk"
  | "watercolor"
  | "cute"
  | "kawaii";

export type PodPlatform = "etsy" | "redbubble" | "merch" | "printful" | "society6";

export type GenerationStatus = "idle" | "pending" | "success" | "error";

// ─── Request shape sent to POST /api/generate-image ──────────────────────────
export interface GenerateImageRequest {
  prompt: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
  platform: PodPlatform;
  colorPalette?: string[];
}

// ─── A single generated image result ─────────────────────────────────────────
export interface GeneratedImage {
  id: string;
  url: string;               // public image URL (or placeholder)
  prompt: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
  platform: PodPlatform;
  createdAt: string;         // ISO timestamp
  isFavorite: boolean;
}

// ─── API response envelope ────────────────────────────────────────────────────
export interface GenerateImageResponse {
  success: boolean;
  images: GeneratedImage[];
  message?: string;
  provider?: string;         // e.g. "flux" | "openai" | "mock"
}

// ─── DB row shape (Supabase) — ready for real table ──────────────────────────
export interface ImageGenerationRecord {
  id: string;
  user_id: string;
  prompt: string;
  style: ImageStyle;
  aspect_ratio: AspectRatio;
  platform: PodPlatform;
  image_url: string;
  is_favorite: boolean;
  created_at: string;
}
