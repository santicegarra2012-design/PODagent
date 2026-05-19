import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isProUser } from "@/lib/subscription";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const proUser = await isProUser();

  // 0. Usage check for Free users
  if (!proUser) {
    const { count } = await getSupabaseAdmin()
      .from("projects") // Reuse projects table to count generations for simplicity in this demo
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if ((count || 0) >= 5) {
      return NextResponse.json(
        { error: "Usage limit reached", message: "Free tier is limited to 5 generations. Upgrade to Pro for unlimited access." },
        { status: 403 }
      );
    }
  }

  const apiKey = process.env.GROQ_API_KEY;

  // 1. Log apiKey presence safely
  console.log("[generate-seo] request received", {
    hasGroqApiKey: Boolean(apiKey),
    keyPreview: apiKey ? `${apiKey.slice(0, 8)}...` : "missing",
    model: GROQ_MODEL,
  });

  // 2. Validate API key
  if (!apiKey) {
    console.error("[generate-seo] Error: GROQ_API_KEY is missing in environment variables.");
    return NextResponse.json(
      { error: "Server configuration error", message: "GROQ_API_KEY is missing." },
      { status: 500 }
    );
  }

  // 3. Parse JSON body
  let body: { niche?: string };
  try {
    body = await request.json();
  } catch (error) {
    console.error("[generate-seo] Error parsing request JSON:", error);
    return NextResponse.json(
      { error: "Invalid request body", message: "Body must be valid JSON." },
      { status: 400 }
    );
  }

  const niche = body?.niche?.trim();

  // 4. Validate niche
  if (!niche) {
    console.error("[generate-seo] Error: 'niche' is missing in request body.");
    return NextResponse.json(
      { error: "Invalid request", message: "niche is required." },
      { status: 400 }
    );
  }

  // 5. Groq fetch
  try {
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
            content: "You generate concise, high-converting POD SEO metadata. Always return valid JSON in this exact structure: { \"title\": \"string\", \"tags\": [\"string\"], \"description\": \"string\" }."
          },
          {
            role: "user",
            content: `Generate SEO metadata for a print-on-demand product niche.\n\nNiche: ${niche}\n\nRequirements:\n- title: 90 to 140 characters, optimized for Etsy-style search intent\n- tags: 10 to 13 short keyword tags\n- description: 2 to 3 persuasive sentences with natural keywords\n- Output strictly as JSON with no markdown formatting.`
          }
        ]
      }),
    });

    console.log(`[generate-seo] Groq response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[generate-seo] Provider error:", response.status, errorText);
      return NextResponse.json(
        { error: "Provider error", message: "Groq returned an error status.", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[generate-seo] Groq returned empty content");
      return NextResponse.json(
        { error: "Provider error", message: "Groq returned empty content." },
        { status: 502 }
      );
    }

    // 6. Parse JSON from model
    let seoPayload;
    try {
      seoPayload = JSON.parse(content);
    } catch (parseError) {
      console.error("[generate-seo] Error parsing provider JSON response:", parseError, content);
      return NextResponse.json(
        { error: "Provider error", message: "Failed to parse Groq JSON." },
        { status: 502 }
      );
    }

    // 7. Success
    console.log("[generate-seo] Successfully generated SEO.");
    return NextResponse.json(seoPayload, { status: 200 });

  } catch (error) {
    console.error("[generate-seo] Unexpected server error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
