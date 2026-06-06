import { createOpenAI } from "@ai-sdk/openai";
import { streamText, generateObject } from "ai";
import { z } from "zod";
import { getSupabaseAdmin } from "../supabase-admin";
import { OPENAI_CHAT_MODEL } from "../openai";

const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are the POD Agent AI Copilot, a trusted business partner for a Print-on-Demand entrepreneur.
Your roles include:
- Business advisor
- Research analyst
- Product strategist
- Accountability coach
- Growth mentor

When answering:
- Always prioritize actionable steps.
- Reference relevant opportunities.
- Reference pending tasks to keep the user focused.
- Reference the user's memories (goals, preferences) to provide personalized advice.
- Always provide clear next steps.

Use a professional, encouraging, and highly strategic tone. Your goal is to help the user grow their POD business.`;

export async function getCopilotContext(userId: string) {
  const supabase = getSupabaseAdmin();

  const [
    { data: profile },
    { data: memories },
    { data: tasks },
    { data: opportunities },
    { data: designs }
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).single(),
    supabase.from("memories").select("*").eq("user_id", userId).order("importance", { ascending: false }).limit(20),
    supabase.from("tasks").select("*").eq("user_id", userId).eq("status", "pending").order("priority", { ascending: false }).limit(10),
    supabase.from("opportunities").select("*").order("opportunity_score", { ascending: false }).limit(5),
    supabase.from("designs").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
  ]);

  return {
    profile: profile || null,
    memories: memories || [],
    tasks: tasks || [],
    opportunities: opportunities || [],
    designs: designs || [],
  };
}

export async function extractAndSaveMemories(userId: string, userMessage: string) {
  try {
    const { object } = await generateObject({
      model: openaiProvider(OPENAI_CHAT_MODEL),
      schema: z.object({
        memories: z.array(z.object({
          content: z.string().describe("The extracted memory content"),
          category: z.enum(["goal", "niche", "preference", "strategy", "general"]),
          importance: z.number().min(1).max(10).describe("How important this memory is for long-term tracking"),
          confidence: z.number().min(1).max(10).describe("How confident are you that this is a genuine preference/goal and not casual talk"),
        }))
      }),
      prompt: `Analyze the following user message and extract any new, high-confidence memories.
Only extract: Goals, Preferred niches, Store preferences, Business plans, Long-term objectives.
Do NOT extract: Casual conversation, temporary requests, or generic questions.
Return only memories with high confidence (8-10).

User Message: "${userMessage}"`
    });

    const highConfidenceMemories = object.memories.filter(m => m.confidence >= 8);

    if (highConfidenceMemories.length > 0) {
      const supabase = getSupabaseAdmin();
      await supabase.from("memories").insert(
        highConfidenceMemories.map(m => ({
          user_id: userId,
          content: m.content,
          category: m.category,
          importance: m.importance,
        }))
      );
    }
  } catch (error) {
    console.error("[Copilot Memory Extraction Error]", error);
  }
}

export async function generateCopilotResponseStream(userId: string, messages: Array<{ role: string; content: string }>) {
  const context = await getCopilotContext(userId);
  
  const contextMessage = `USER CONTEXT:
Profile: ${JSON.stringify(context.profile)}
Memories: ${JSON.stringify(context.memories)}
Pending Tasks: ${JSON.stringify(context.tasks)}
Top Opportunities: ${JSON.stringify(context.opportunities)}
Recent Designs: ${JSON.stringify(context.designs)}`;

  const lastUserMessage = messages.filter(m => m.role === "user").pop();
  if (lastUserMessage) {
    // Fire and forget memory extraction
    extractAndSaveMemories(userId, lastUserMessage.content);
  }

  const allMessages = [
    { role: "system", content: systemPrompt },
    { role: "system", content: contextMessage },
    ...messages
  ];

  const result = streamText({
    model: openaiProvider(OPENAI_CHAT_MODEL),
    messages: allMessages as any[],
  });

  return result.toTextStreamResponse();
}
