import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not configured");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

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
    console.error("[stripe-webhook] Signature verification failed:", message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  console.log(`[stripe-webhook] Received event: ${event.type} (id: ${event.id})`);

  try {
    // ─── Handle checkout.session.completed ──────────────────────────────────
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id || session.metadata?.userId;
      const customerEmail = session.customer_details?.email || session.customer_email;

      console.log(`[stripe-webhook] Checkout completed for user: ${userId}, email: ${customerEmail}`);

      if (!userId) {
        console.error("[stripe-webhook] No userId in session metadata or client_reference_id");
        console.error("[stripe-webhook] Session metadata:", JSON.stringify(session.metadata));
        console.error("[stripe-webhook] Session id:", session.id);
        return new NextResponse("User ID not found in session", { status: 400 });
      }

      // Get the subscription ID from the session
      const subscriptionId = session.subscription;

      if (!subscriptionId) {
        console.error("[stripe-webhook] No subscription ID in completed checkout session");
        // The session might not have a subscription (e.g., it was a one-time payment)
        // For subscription mode, this should not happen, but handle gracefully
        return new NextResponse("No subscription in session", { status: 400 });
      }

      // Retrieve the subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(
        subscriptionId as string
      );

      const priceId = subscription.items.data[0]?.price?.id || null;
      let plan = "pro";
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
        plan = "premium";
      }

      // Retrieve customer to ensure we have the stripe_customer_id
      const customerId = session.customer as string;

      console.log(`[stripe-webhook] Activating subscription for user ${userId}:`, {
        subscriptionId: subscription.id,
        plan,
        status: subscription.status,
        customerId,
        priceId,
      });

      // Ensure we have the customer mapped in Stripe as well
      // (attach the user ID as metadata to the Stripe customer)
      try {
        await stripe.customers.update(customerId, {
          metadata: { userId },
        });
      } catch (err) {
        // Non-critical: customer metadata update failing shouldn't block activation
        console.warn("[stripe-webhook] Failed to update customer metadata:", err);
      }

      // Upsert the subscription record into Supabase
      const { error: upsertError } = await getSupabaseAdmin()
        .from("subscriptions")
        .upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            status: subscription.status,
            plan: plan,
            current_period_end: new Date(
              (subscription.current_period_end as number) * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (upsertError) {
        console.error("[stripe-webhook] Failed to upsert subscription in Supabase:", upsertError);
        return new NextResponse("Database error", { status: 500 });
      }

      console.log(`[stripe-webhook] Successfully activated ${plan} subscription for user ${userId}`);
    }

    // ─── Handle customer.subscription.updated ───────────────────────────────
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;

      console.log(`[stripe-webhook] Subscription updated: ${subscription.id}, status: ${subscription.status}`);

      // Find the customer to get the userId from metadata
      let userId: string | null = null;

      try {
        // First try to get from customer metadata
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );
        if (!customer.deleted) {
          userId = customer.metadata?.userId || null;
        }
      } catch (err) {
        console.warn("[stripe-webhook] Could not retrieve customer for subscription update:", err);
      }

      const priceId = subscription.items.data[0]?.price?.id || null;
      let plan = "pro";
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
        plan = "premium";
      }

      // Build the update object
      const updateData: Record<string, unknown> = {
        status: subscription.status,
        stripe_price_id: priceId,
        plan: plan,
        current_period_end: new Date(
          (subscription.current_period_end as number) * 1000
        ).toISOString(),
        updated_at: new Date().toISOString(),
      };

      // If we know the userId, update by user_id (handles re-subscribes)
      if (userId) {
        const { error } = await getSupabaseAdmin()
          .from("subscriptions")
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: subscription.customer as string,
              stripe_subscription_id: subscription.id,
              ...updateData,
            },
            { onConflict: "user_id" }
          );

        if (error) {
          console.error("[stripe-webhook] Failed to upsert subscription by user_id:", error);
        } else {
          console.log(`[stripe-webhook] Updated subscription for user ${userId}, status: ${subscription.status}`);
        }
      } else {
        // Fallback: update by stripe_subscription_id
        const { error } = await getSupabaseAdmin()
          .from("subscriptions")
          .update(updateData)
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("[stripe-webhook] Failed to update subscription by id:", error);
        } else {
          console.log(`[stripe-webhook] Updated subscription ${subscription.id}, status: ${subscription.status}`);
        }
      }
    }

    // ─── Handle customer.subscription.deleted ───────────────────────────────
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      console.log(`[stripe-webhook] Subscription deleted: ${subscription.id}`);

      // Set status to canceled and plan to free
      const { error } = await getSupabaseAdmin()
        .from("subscriptions")
        .update({
          status: "canceled",
          plan: "free",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

      if (error) {
        console.error("[stripe-webhook] Failed to set subscription as canceled:", error);
      } else {
        console.log(`[stripe-webhook] Subscription ${subscription.id} marked as canceled`);
      }
    }

    // ─── Handle customer.subscription.trialing (not created by default) ──────
    // This event is already covered by customer.subscription.updated
    // which fires when a trial starts, but we also handle
    // checkout.session.completed above for the initial creation.

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[stripe-webhook] Unhandled error processing event:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
