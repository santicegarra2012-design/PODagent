import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { DashboardSummary } from "@/lib/dashboard/types";

type QueryResult<T> = { data: T; count: number };

async function countRows(table: string, userId: string): Promise<QueryResult<null>> {
  const { count, error } = await getSupabaseAdmin()
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.warn(`[dashboard-summary] count failed for ${table}:`, error.message);
    return { data: null, count: 0 };
  }

  return { data: null, count: count || 0 };
}

async function selectRows<T>(table: string, columns: string, userId: string): Promise<QueryResult<T[]>> {
  const { data, error } = await getSupabaseAdmin()
    .from(table)
    .select(columns)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.warn(`[dashboard-summary] select failed for ${table}:`, error.message);
    return { data: [], count: 0 };
  }

  return { data: (data as T[]) || [], count: 0 };
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [
      projectsCount,
      trendSavesCount,
      imageGenerationsCount,
      trademarkChecksCount,
      recentProjects,
      recentTrendSaves,
      recentTrademarkChecks,
      recentImageGenerations,
    ] = await Promise.all([
      countRows("projects", userId),
      countRows("trend_saves", userId),
      countRows("image_generations", userId),
      countRows("trademark_checks", userId),
      selectRows<DashboardSummary["recentProjects"][number]>(
        "projects",
        "id, niche, title, tags, created_at",
        userId
      ),
      selectRows<DashboardSummary["recentTrendSaves"][number]>(
        "trend_saves",
        "id, niche, keywords, created_at",
        userId
      ),
      selectRows<DashboardSummary["recentTrademarkChecks"][number]>(
        "trademark_checks",
        "id, keyword, risk_level, created_at",
        userId
      ),
      selectRows<DashboardSummary["recentImageGenerations"][number]>(
        "image_generations",
        "id, prompt, image_url, style, platform, created_at",
        userId
      ),
    ]);

    const summary: DashboardSummary = {
      counts: {
        projects: projectsCount.count,
        trendSaves: trendSavesCount.count,
        imageGenerations: imageGenerationsCount.count,
        trademarkChecks: trademarkChecksCount.count,
      },
      recentProjects: recentProjects.data,
      recentTrendSaves: recentTrendSaves.data,
      recentTrademarkChecks: recentTrademarkChecks.data,
      recentImageGenerations: recentImageGenerations.data,
    };

    return NextResponse.json({ success: true, data: summary }, { status: 200 });
  } catch (error) {
    console.error("[dashboard-summary] Server error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
