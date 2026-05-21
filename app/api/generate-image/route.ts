import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateFalImages } from "@/lib/ai/providers/fal";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { GenerateImageRequest } from "@/lib/ai/image-types";

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

    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "FAL_KEY is missing. Real image generation is not configured on this deployment.",
        },
        { status: 503 }
      );
    }

    console.log(`[generate-image] Fal AI Request for user ${userId}:`, body.prompt);

    let images;
    try {
      images = await generateFalImages(body, 4);
    } catch (genErr) {
      console.error("[generate-image] Fal AI generation failed:", genErr);
      return NextResponse.json(
        { success: false, message: "Image generation service is currently busy. Please try again." },
        { status: 503 }
      );
    }

    const records = images.map((img) => ({
      user_id: userId,
      prompt: img.prompt,
      image_url: img.url,
      style: img.style,
      aspect_ratio: img.aspectRatio,
      platform: img.platform,
      created_at: new Date().toISOString(),
    }));

    const { error: dbError } = await getSupabaseAdmin()
      .from("image_generations")
      .insert(records);

    if (dbError) {
      console.error("[generate-image] Supabase persistence failed:", dbError);
    }

    return NextResponse.json({
      success: true,
      images,
      provider: "fal-flux",
    });
  } catch (err) {
    console.error("[generate-image] Route Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
