import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { OPENAI_CHAT_MODEL } from "@/lib/openai";

const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory cache for briefing (per-user, 1 hour TTL)
const briefingCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check cache first
    const cached = briefingCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log(`[Daily Briefing] Serving cached briefing for user ${userId}`);
      return NextResponse.json(cached.data);
    }

    const supabase = getSupabaseAdmin();
    const [
      { data: tasks },
      { data: opportunities },
      { data: memories }
    ] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", userId).eq("status", "pending").order("priority", { ascending: false }).limit(5),
      supabase.from("opportunities").select("*").order("opportunity_score", { ascending: false }).limit(3),
      supabase.from("memories").select("*").eq("user_id", userId).order("importance", { ascending: false }).limit(5),
    ]);

    const contextStr = `Tasks: ${JSON.stringify(tasks || [])}. Opportunities: ${JSON.stringify(opportunities || [])}. User Memories: ${JSON.stringify(memories || [])}`;

    const { object } = await generateObject({
      model: openaiProvider(OPENAI_CHAT_MODEL),
      schema: z.object({
        topOpportunity: z.string().describe("The best opportunity available right now in 1 short sentence"),
        pendingTasksCount: z.number().describe("Number of pending tasks"),
        recommendedAction: z.string().describe("The #1 actionable thing the user should do today"),
        businessSummary: z.string().describe("A motivational 2-sentence summary of their business state and potential"),
      }),
      prompt: `Generate a daily briefing for a POD entrepreneur based on this context: ${contextStr}.
If there are no tasks or opportunities, provide encouraging advice to start researching niches or setting up their store.`
    });

    // Cache the result
    briefingCache.set(userId, { data: object, timestamp: Date.now() });
    console.log(`[Daily Briefing] Generated and cached new briefing for user ${userId}`);

    return NextResponse.json(object);
  } catch (error) {
    console.error("[Daily Briefing Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
