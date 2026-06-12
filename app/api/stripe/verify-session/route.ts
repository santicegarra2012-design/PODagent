import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-04-10" as any }) : null;

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ verified: false, error: "Missing session_id" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Mock verification for Beta/Free Mode sessions
    if (sessionId.startsWith("mock_session_")) {
      const parts = sessionId.split("_");
      const plan = parts[2] || "pro";
      const targetUserId = parts[3] || userId;

      const currentPeriodEnd = new Date();
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1); // 1 month free trial period

      const { error } = await supabase.from("subscriptions").upsert({
        user_id: targetUserId,
        stripe_customer_id: "cus_mock_beta",
        stripe_subscription_id: sessionId,
        stripe_price_id: `price_mock_${plan}`,
        status: "active",
        plan: plan,
        current_period_end: currentPeriodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id"
      });

      if (error) {
        console.error("[Verify Session Error] Supabase upsert error:", error);
        return NextResponse.json({ verified: false, error: error.message }, { status: 500 });
      }

      console.log(`[Verify Session] Mock subscription registered successfully for ${targetUserId} as ${plan}`);
      return NextResponse.json({ verified: true });
    }

    // Real Stripe verification
    if (!stripe) {
      return NextResponse.json({ verified: false, error: "Billing is not configured" }, { status: 503 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status === "unpaid") {
      return NextResponse.json({ verified: false, error: "Payment verification failed" }, { status: 400 });
    }

    const sessionUserId = session.metadata?.userId;
    const plan = session.metadata?.plan || "pro";

    if (!sessionUserId) {
      return NextResponse.json({ verified: false, error: "No user metadata associated with session" }, { status: 400 });
    }

    const stripeSubscriptionId = session.subscription as string;
    const stripeCustomerId = session.customer as string;

    const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId) as any;
    const currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);

    const { error } = await supabase.from("subscriptions").upsert({
      user_id: sessionUserId,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_price_id: stripeSubscription.items?.data[0]?.price?.id || null,
      status: stripeSubscription.status,
      plan: plan,
      current_period_end: currentPeriodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id"
    });

    if (error) {
      console.error("[Verify Session Error] Supabase upsert error:", error);
      return NextResponse.json({ verified: false, error: error.message }, { status: 500 });
    }

    console.log(`[Verify Session] Real payment verified for user ${sessionUserId}, plan: ${plan}`);
    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("[Verify Session API Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
