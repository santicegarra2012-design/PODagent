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

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const [
      { data: tasks },
      { data: opportunities }
    ] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", userId).eq("status", "pending").order("priority", { ascending: false }).limit(5),
      supabase.from("opportunities").select("*").order("opportunity_score", { ascending: false }).limit(1)
    ]);

    const contextStr = `Tasks: ${JSON.stringify(tasks)}. Opportunities: ${JSON.stringify(opportunities)}`;

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

    return NextResponse.json(object);
  } catch (error) {
    console.error("[Daily Briefing Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
