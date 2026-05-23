import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: subscription, error: subError } = await getSupabaseAdmin()
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError) {
      console.error("[billing-portal] Failed to fetch subscription:", subError);
    }

    if (!subscription?.stripe_customer_id) {
      return new NextResponse("No active subscription found", { status: 400 });
    }

    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${appUrl}/dashboard/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("[billing-portal] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
