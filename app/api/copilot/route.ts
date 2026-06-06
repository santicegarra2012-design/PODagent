import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createTextChatCompletion } from "@/lib/openai";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type CopilotRequest = {
  message?: string;
};

type UserTableResult = {
  data: unknown[];
  error?: string;
};

const USER_ID_COLUMNS = ["user_id", "clerk_user_id", "clerk_id", "owner_id"] as const;

async function readUserTable(table: string, userId: string, limit: number): Promise<UserTableResult> {
  const supabase = getSupabaseAdmin();
  let lastError: string | undefined;

  for (const column of USER_ID_COLUMNS) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq(column, userId)
      .limit(limit);

    if (!error) {
      return { data: data ?? [] };
    }

    lastError = error.message;
  }

  return { data: [], error: lastError };
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let body: CopilotRequest = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const userMessage = body.message?.trim() || "Give me a personalized next-step plan for my POD business.";

    const [profiles, memories, tasks, opportunities] = await Promise.all([
      readUserTable("profiles", userId, 1),
      readUserTable("memories", userId, 20),
      readUserTable("tasks", userId, 20),
      readUserTable("opportunities", userId, 20),
    ]);

    const context = {
      profile: profiles.data[0] ?? null,
      memories: memories.data,
      tasks: tasks.data,
      opportunities: opportunities.data,
      readErrors: {
        profiles: profiles.error,
        memories: memories.error,
        tasks: tasks.error,
        opportunities: opportunities.error,
      },
    };

    const response = await createTextChatCompletion([
      {
        role: "system",
        content: `You are POD Agent Copilot, a concise business assistant for a print-on-demand seller.
Use the supplied profile, memories, tasks, and opportunities to answer personally.
Prioritize concrete next actions, mention uncertainty when context is missing, and avoid inventing data.`,
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            request: userMessage,
            context,
          },
          null,
          2
        ),
      },
    ]);

    return NextResponse.json({
      success: true,
      response,
      contextSummary: {
        profileFound: Boolean(context.profile),
        memoryCount: memories.data.length,
        taskCount: tasks.data.length,
        opportunityCount: opportunities.data.length,
      },
    });
  } catch (error) {
    console.error("[copilot] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
