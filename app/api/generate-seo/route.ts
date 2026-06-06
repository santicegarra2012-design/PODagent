import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isProUser } from "@/lib/subscription";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createJsonChatCompletion } from "@/lib/openai";

export const runtime = "nodejs";

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

  if (!niche) {
    console.error("[generate-seo] Error: 'niche' is missing in request body.");
    return NextResponse.json(
      { error: "Invalid request", message: "niche is required." },
      { status: 400 }
    );
  }

  try {
    const content = await createJsonChatCompletion([
      {
        role: "system",
        content: "You generate concise, high-converting POD SEO metadata. Always return valid JSON in this exact structure: { \"title\": \"string\", \"tags\": [\"string\"], \"description\": \"string\" }."
      },
      {
        role: "user",
        content: `Generate SEO metadata for a print-on-demand product niche.\n\nNiche: ${niche}\n\nRequirements:\n- title: 90 to 140 characters, optimized for Etsy-style search intent\n- tags: 10 to 13 short keyword tags\n- description: 2 to 3 persuasive sentences with natural keywords\n- Output strictly as JSON with no markdown formatting.`
      }
    ]);

    let seoPayload;
    try {
      seoPayload = JSON.parse(content);
    } catch (parseError) {
      console.error("[generate-seo] Error parsing provider JSON response:", parseError, content);
      return NextResponse.json(
        { error: "Provider error", message: "Failed to parse OpenAI JSON." },
        { status: 502 }
      );
    }

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
