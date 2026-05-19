import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = (await stripe.subscriptions.retrieve(
      session.subscription as string
    )) as Stripe.Subscription;

    const userId = session.client_reference_id || session.metadata?.userId;

    if (!userId) {
      return new NextResponse("User ID not found in session", { status: 400 });
    }

    const priceId = subscription.items.data[0].price.id;
    let plan = "pro";
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
      plan = "premium";
    }

    await getSupabaseAdmin().from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      status: subscription.status,
      plan: plan,
      // @ts-expect-error - current_period_end is a number in Stripe SDK but we need to convert it
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    });
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const priceId = subscription.items.data[0].price.id;
    
    let plan = "pro";
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
      plan = "premium";
    }

    await getSupabaseAdmin()
      .from("subscriptions")
      .update({
        status: subscription.status,
        stripe_price_id: priceId,
        plan: plan,
        // @ts-expect-error - current_period_end is a number in Stripe SDK but we need to convert it
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  return new NextResponse(null, { status: 200 });
}
