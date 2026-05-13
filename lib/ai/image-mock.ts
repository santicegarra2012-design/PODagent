// ─── Mock Image Provider ──────────────────────────────────────────────────────
// This file simulates AI image generation.
// To switch to a real provider (FLUX, OpenAI, etc.), replace the body of
// `generateImages()` — the types and API route stay identical.

import type {
  GenerateImageRequest,
  GeneratedImage,
  ImageStyle,
  AspectRatio,
  PodPlatform,
} from "./image-types";

// Curated placeholder images keyed by style for visual variety
const PLACEHOLDER_POOL: Record<string, string[]> = {
  default: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&h=512&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&h=512&fit=crop",
    "https://images.unsplash.com/photo-1574169208507-84376144848b?w=512&h=512&fit=crop",
    "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=512&h=512&fit=crop",
  ],
};

function pickPlaceholder(style: ImageStyle, index: number): string {
  const pool = PLACEHOLDER_POOL[style] ?? PLACEHOLDER_POOL.default;
  return pool[index % pool.length];
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Simulated network delay (ms) — makes the UX feel real
const MOCK_DELAY_MS = 2800;

export async function generateImages(
  req: GenerateImageRequest,
  count = 4
): Promise<GeneratedImage[]> {
  // Simulate API latency
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    url: pickPlaceholder(req.style, i),
    prompt: req.prompt,
    style: req.style,
    aspectRatio: req.aspectRatio,
    platform: req.platform,
    createdAt: new Date().toISOString(),
    isFavorite: false,
  }));
}

// ─── Style label helpers ──────────────────────────────────────────────────────
export const STYLE_LABELS: Record<ImageStyle, string> = {
  none: "No Style",
  vintage: "Vintage",
  retro: "Retro",
  minimalist: "Minimalist",
  cartoon: "Cartoon",
  anime: "Anime",
  grunge: "Grunge",
  cyberpunk: "Cyberpunk",
  watercolor: "Watercolor",
  cute: "Cute",
  kawaii: "Kawaii",
};

export const ASPECT_RATIO_LABELS: Record<AspectRatio, string> = {
  "1:1": "Square (1:1)",
  "4:3": "Landscape (4:3)",
  "3:4": "Portrait (3:4)",
  "16:9": "Wide (16:9)",
  "9:16": "Story (9:16)",
};

export const PLATFORM_LABELS: Record<PodPlatform, string> = {
  etsy: "Etsy",
  redbubble: "Redbubble",
  merch: "Merch by Amazon",
  printful: "Printful",
  society6: "Society6",
};

export const PROMPT_CHIPS = [
  "Vintage",
  "Retro",
  "Minimalist",
  "Cartoon",
  "Anime",
  "Grunge",
  "Cyberpunk",
  "Watercolor",
  "Cute",
  "Kawaii",
  "Bold",
  "Neon",
] as const;
