import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // 1. Authenticate the user with Clerk
    const { userId } = await auth();

    if (!userId) {
      console.warn("[save-project] Unauthorized attempt to save project");
      return NextResponse.json(
        { success: false, message: "Unauthorized: You must be logged in to save a project." },
        { status: 401 }
      );
    }

    // 2. Parse and validate the request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("[save-project] Invalid JSON payload:", parseError);
      return NextResponse.json(
        { success: false, message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { niche, title, tags, description } = body;

    // Validate required fields
    if (!niche || typeof niche !== 'string' || niche.trim() === '') {
      return NextResponse.json(
        { success: false, message: "Missing or invalid field: niche" },
        { status: 400 }
      );
    }
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { success: false, message: "Missing or invalid field: title" },
        { status: 400 }
      );
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid field: tags (must be a non-empty array)" },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json(
        { success: false, message: "Missing or invalid field: description" },
        { status: 400 }
      );
    }

    // 3. Initialize Supabase Admin Client using Service Role Key to bypass RLS securely
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[save-project] Missing Supabase environment variables");
      return NextResponse.json(
        { success: false, message: "Server misconfiguration: Supabase not setup." },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 4. Insert the project into Supabase
    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        user_id: userId,
        niche: niche.trim(),
        title: title.trim(),
        tags: tags,
        description: description.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("[save-project] Error inserting project into Supabase:", error);
      return NextResponse.json(
        { success: false, message: "Failed to save project to database.", error: error.message },
        { status: 500 }
      );
    }

    // 5. Return success
    console.log(`[save-project] Successfully saved project for user ${userId}`);
    return NextResponse.json(
      { success: true, message: "Project saved successfully.", data },
      { status: 200 }
    );

  } catch (error) {
    console.error("[save-project] Unexpected server error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
