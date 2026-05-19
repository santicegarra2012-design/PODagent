import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: subscription } = await getSupabaseAdmin()
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    return NextResponse.json(subscription || { plan: "free", status: "inactive" });
  } catch (error) {
    console.error("[user-subscription] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
