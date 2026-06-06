import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[get-projects] Supabase error:", error);
      return NextResponse.json({ success: false, message: "Failed to fetch projects" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("[get-projects] Server error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
    }

    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Project ID is required" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Make sure the project belongs to the user before deleting
    const { data: projectData, error: fetchError } = await supabaseAdmin
      .from("projects")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !projectData) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (projectData.user_id !== userId) {
      return NextResponse.json({ success: false, message: "Forbidden: Cannot delete this project" }, { status: 403 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[delete-project] Supabase error:", deleteError);
      return NextResponse.json({ success: false, message: "Failed to delete project" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("[delete-project] Server error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
