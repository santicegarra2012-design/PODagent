import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// Map price IDs to plan names for metadata
function getPlanName(priceId: string): string {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
    return "premium";
  }
  return "pro";
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { priceId } = body;

    if (!priceId) {
      return new NextResponse(
        JSON.stringify({ error: "Price ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return new NextResponse(
        JSON.stringify({ error: "User email not found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    const plan = getPlanName(priceId);

    console.log(`[stripe-checkout] Creating checkout for user ${userId}, plan: ${plan}, price: ${priceId}`);

    // Validate required env vars
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("[stripe-checkout] STRIPE_SECRET_KEY is not configured");
      return new NextResponse(
        JSON.stringify({ error: "Stripe is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: userEmail,
      client_reference_id: userId,
      success_url: `${appUrl}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      metadata: {
        userId,
        plan,
      },
      subscription_data: {
        metadata: {
          userId,
          plan,
        },
      },
    });

    console.log(`[stripe-checkout] Session created: ${session.id}, url: ${session.url}`);

    // Create a pending subscription record so the user sees "processing" immediately
    try {
      await getSupabaseAdmin().from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: null,
          stripe_subscription_id: null,
          stripe_price_id: priceId,
          status: "pending",
          plan: plan,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    } catch (dbErr) {
      // Non-critical: pre-creating the record is just for UX
      console.warn("[stripe-checkout] Failed to create pending subscription record:", dbErr);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe-checkout] Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create checkout session" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
