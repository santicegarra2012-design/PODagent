import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY missing" }, { status: 500 });
    }

    const body = await request.json();
    const { title, tags, description, platform } = body;

    // AI optimization logic
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        response_format: { type: "json_object" },
        messages: [
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
        ]
      }),
    });

    if (!response.ok) throw new Error("Groq API error");

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    return NextResponse.json(JSON.parse(content || "{}"));
  } catch (error) {
    console.error("[optimize-listing] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
