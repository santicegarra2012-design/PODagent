import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createJsonChatCompletion } from "@/lib/openai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, tags, description, platform } = body;

    const content = await createJsonChatCompletion([
      {
        role: "system",
        content: `You are a world-class POD SEO and conversion optimizer for Etsy, Amazon Merch, and Redbubble.
        Your task is to analyze a product listing and provide a high-conversion, SEO-optimized version.
        Always return a JSON object in this exact structure:
        {
          "seoScore": number (0-100),
          "readabilityScore": number (0-100),
          "keywordDensity": { "word": count },
          "missingKeywords": ["string"],
          "conversionTips": ["string"],
          "trademarkWarnings": ["string"],
          "improvedTitle": "string",
          "improvedTags": ["string"],
          "improvedDescription": "string"
        }`
      },
      {
        role: "user",
        content: `Optimize this ${platform} listing:
        Title: ${title}
        Tags: ${Array.isArray(tags) ? tags.join(", ") : tags}
        Description: ${description}`
      }
    ]);

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error("[optimize-listing] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
