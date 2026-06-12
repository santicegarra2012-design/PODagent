import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("opportunity_score", { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Opportunities API Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
