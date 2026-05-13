import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateFalImages } from "@/lib/ai/providers/fal";
import { generateImages as generateMockImages } from "@/lib/ai/image-mock";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { GenerateImageRequest } from "@/lib/ai/image-types";

// ─── POST /api/generate-image ─────────────────────────────────────────────────
// This route now uses Fal AI (Flux Schnell) for high-speed, high-quality generation.
// It persists history to Supabase and falls back to mock for local dev if keys are missing.

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as GenerateImageRequest;

    if (!body.prompt?.trim()) {
      return NextResponse.json(
        { success: false, message: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log(`[generate-image] Fal AI Request for user ${userId}:`, body.prompt);

    let images;
    const isFalConfigured = !!process.env.FAL_KEY;

    if (isFalConfigured) {
      try {
        // Generate a batch of 4 images using Flux Schnell
        images = await generateFalImages(body, 4);
      } catch (genErr) {
        console.error("[generate-image] Fal AI generation failed:", genErr);
        return NextResponse.json(
          { success: false, message: "Image generation service is currently busy. Please try again." },
          { status: 503 }
        );
      }
    } else {
      console.warn("[generate-image] FAL_KEY missing, falling back to mock");
      images = await generateMockImages(body, 4);
    }

    // ─── Save to Supabase ─────────────────────────────────────────────────────
    const records = images.map(img => ({
      user_id: userId,
      prompt: img.prompt,
      image_url: img.url,
      style: img.style,
      aspect_ratio: img.aspectRatio,
      platform: img.platform,
      created_at: new Date().toISOString()
    }));

    const { error: dbError } = await supabaseAdmin
      .from("image_generations")
      .insert(records);

    if (dbError) {
      console.error("[generate-image] Supabase persistence failed:", dbError);
    }

    return NextResponse.json({
      success: true,
      images,
      provider: isFalConfigured ? "fal-flux" : "mock",
    });
  } catch (err) {
    console.error("[generate-image] Route Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
