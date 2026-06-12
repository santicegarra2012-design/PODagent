import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    
    // In Next.js 15 app router, params must be awaited
    const { id } = await params;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("memories")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Memories DELETE API Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { importance } = body;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("memories")
      .update({ importance })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Memories PATCH API Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
