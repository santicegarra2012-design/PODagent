import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateGeminiImages } from "@/lib/ai/providers/gemini";
import { generateImages as generateMockImages } from "@/lib/ai/image-mock";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { GenerateImageRequest } from "@/lib/ai/image-types";

// ─── POST /api/generate-image ─────────────────────────────────────────────────
// This route now uses real Gemini (Imagen 3) generation and saves to Supabase.
// It maintains a fallback to mock generation if the API key is missing for local dev.

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

    console.log(`[generate-image] Request for user ${userId}:`, body.prompt);

    let images;
    const isGeminiConfigured = !!process.env.GEMINI_API_KEY;

    if (isGeminiConfigured) {
      try {
        images = await generateGeminiImages(body, 4);
      } catch (genErr) {
        console.error("[generate-image] Gemini generation failed:", genErr);
        return NextResponse.json(
          { success: false, message: "AI generation service is currently unavailable." },
          { status: 503 }
        );
      }
    } else {
      console.warn("[generate-image] GEMINI_API_KEY missing, falling back to mock");
      images = await generateMockImages(body, 4);
    }

    // ─── Save to Supabase ─────────────────────────────────────────────────────
    // Table: image_generations
    // Columns: user_id, prompt, image_url, style, aspect_ratio, created_at
    
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
      console.error("[generate-image] Database save failed:", dbError);
      // We don't fail the request if saving history fails, but we log it.
    }

    return NextResponse.json({
      success: true,
      images,
      provider: isGeminiConfigured ? "gemini" : "mock",
    });
  } catch (err) {
    console.error("[generate-image] Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: "An internal error occurred during image generation." },
      { status: 500 }
    );
  }
}
