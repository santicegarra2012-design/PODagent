import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateImages } from "@/lib/ai/image-mock";
import type { GenerateImageRequest } from "@/lib/ai/image-types";

// ─── POST /api/generate-image ─────────────────────────────────────────────────
// Currently uses the mock provider. To switch to a real model:
//   1. Replace `generateImages` import with a real provider (e.g. lib/ai/flux.ts)
//   2. Keep the request/response shape — the frontend stays identical.

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

    const images = await generateImages(body, 4);

    return NextResponse.json({
      success: true,
      images,
      provider: "mock", // change to "flux" | "openai" etc. when real
    });
  } catch (err) {
    console.error("[generate-image]", err);
    return NextResponse.json(
      { success: false, message: "Image generation failed" },
      { status: 500 }
    );
  }
}
