import { auth } from "@clerk/nextjs/server";
import { isProUser } from "@/lib/subscription";
import { generateCopilotResponseStream } from "@/lib/ai/copilot";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isPro = await isProUser();
    if (!isPro) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    // Save the latest user message
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === "user") {
      await getSupabaseAdmin().from("conversations").insert({
        user_id: userId,
        role: "user",
        message: lastUserMessage.content,
      });
    }

    // Process and return the stream
    return await generateCopilotResponseStream(userId, messages);

  } catch (error) {
    console.error("[Copilot API Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
