import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { niche, keywords } = body;

    if (!niche) {
      return NextResponse.json({ error: "Missing niche" }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("trend_saves")
      .insert([
        {
          user_id: userId,
          niche,
          keywords: keywords || [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("[save-trend] DB error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[save-trend] Unexpected error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
