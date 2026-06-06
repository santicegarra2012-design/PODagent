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

  // Usage check for Free users
  if (!proUser) {
    const { count } = await getSupabaseAdmin()
      .from("trend_saves")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if ((count || 0) >= 3) {
      return NextResponse.json(
        { error: "Limit reached", message: "Free plan is limited to 3 trend research queries. Upgrade to Pro for unlimited market intelligence." },
        { status: 403 }
      );
    }
  }

  let body: { query?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body", message: "Body must be valid JSON." },
      { status: 400 }
    );
  }

  const query = body?.query?.trim() || "Suggest 5 trending POD niches for current season";

  try {
    const content = await createJsonChatCompletion([
      {
        role: "system",
        content: `You are a high-level POD market researcher. 
        Analyze market trends, social media viral aesthetics, and seasonal demands.
        Always return a JSON object with a "trends" key containing an array of 5 trends.
        Each trend must follow this structure:
        {
          "niche": "string",
          "score": "Very High" | "High" | "Medium" | "Low",
          "competition": "Low" | "Medium" | "High" | "Crowded",
          "productIdeas": ["string"],
          "etsyKeywords": ["string"],
          "tiktokIdeas": ["string"],
          "recommendedStyles": ["string"],
          "reasoning": "string"
        }`
      },
      {
        role: "user",
        content: `Perform deep POD trend research for: ${query}`
      }
    ]);

    return NextResponse.json(JSON.parse(content), { status: 200 });

  } catch (error) {
    console.error("[research-trends] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
