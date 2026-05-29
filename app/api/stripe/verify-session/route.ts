import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

interface StripeSubscriptionWithPeriod {
  status: string;
  current_period_end?: number;
  items: {
    data: Array<{
      price?: {
        id?: string;
      };
    }>;
  };
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { verified: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { verified: false, error: "session_id is required" },
        { status: 400 }
      );
    }

    console.log(`[verify-session] Verifying session ${sessionId} for user ${userId}`);

    // Retrieve the session from Stripe
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { verified: false, error: "Session not found" },
        { status: 404 }
      );
    }

    // Verify the session belongs to this user
    const sessionUserId = session.client_reference_id || session.metadata?.userId;
    if (sessionUserId !== userId) {
      console.error(`[verify-session] User mismatch: session belongs to ${sessionUserId}, user is ${userId}`);
      return NextResponse.json(
        { verified: false, error: "Session does not belong to this user" },
        { status: 403 }
      );
    }

    // Check the payment status
    if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
      return NextResponse.json(
        {
          verified: false,
          error: "Payment not completed",
          payment_status: session.payment_status,
        },
        { status: 400 }
      );
    }

    // Get the subscription from Stripe to determine plan info
    const subscriptionId = session.subscription;
    let plan = "pro";
    let status = "active";
    let currentPeriodEnd: string | null = null;
    let priceId: string | null = null;

    if (subscriptionId) {
      try {
        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId as string
        )) as unknown as StripeSubscriptionWithPeriod;

        status = subscription.status;
        if (subscription.current_period_end) {
          currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
        }

        priceId = subscription.items.data[0]?.price?.id || null;
        if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
          plan = "premium";
        }
      } catch (subErr) {
        console.warn("[verify-session] Could not retrieve subscription:", subErr);
      }
    }

    // Ensure the subscription record exists in Supabase with the correct price_id
    const { error: upsertError } = await getSupabaseAdmin()
      .from("subscriptions")
      .upsert(
        {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: (subscriptionId as string) || null,
          stripe_price_id: priceId,
          status: status,
          plan: plan,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      console.error("[verify-session] Failed to upsert subscription:", upsertError);
    }

    console.log(`[verify-session] Session ${sessionId} verified successfully for user ${userId}, plan: ${plan}`);

    return NextResponse.json({
      verified: true,
      plan,
      status,
      payment_status: session.payment_status,
      subscription_id: subscriptionId,
      customer_email: session.customer_details?.email,
    });
  } catch (error) {
    console.error("[verify-session] Error:", error);
    return NextResponse.json(
      { verified: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
