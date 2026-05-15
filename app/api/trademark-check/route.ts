import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isProUser } from "@/lib/subscription";

export const runtime = "nodejs";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proUser = await isProUser();

    // Usage check for Free users
    if (!proUser) {
      const { count } = await supabaseAdmin
        .from("trademark_checks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if ((count || 0) >= 3) {
        return NextResponse.json(
          { error: "Limit reached", message: "Free plan is limited to 3 trademark checks. Upgrade to Pro for unlimited safety scans." },
          { status: 403 }
        );
      }
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY missing" }, { status: 500 });
    }

    const body = await request.json();
    const { keyword } = body;

    if (!keyword?.trim()) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    // 1. Ask AI to analyze risk
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
            content: `You are an expert POD (Print-on-Demand) Trademark and IP compliance specialist.
            Your job is to analyze keywords or titles for trademark risks on platforms like Etsy, Amazon, and Redbubble.
            Always return a JSON object with this structure:
            {
              "riskLevel": "Safe" | "Medium Risk" | "High Risk",
              "explanation": "string",
              "flaggedTerms": ["string"],
              "safeAlternatives": ["string"],
              "complianceTips": ["string"]
            }`
          },
          {
            role: "user",
            content: `Analyze this POD listing title/keyword for trademark risk: "${keyword}"`
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error("Groq API error");
    }

    const data = await response.json();
    const result = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    // 2. Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from("trademark_checks")
      .insert([
        {
          user_id: userId,
          keyword,
          risk_level: result.riskLevel,
          response: result,
        },
      ]);

    if (dbError) console.error("[trademark-check] DB Error:", dbError);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[trademark-check] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
