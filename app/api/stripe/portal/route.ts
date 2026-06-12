import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSubscription } from "@/lib/subscription";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-04-10" as any }) : null;

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = await getSubscription();
    if (!subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    // Redirect to real Stripe Customer Portal if configured
    if (stripe && subscription.stripe_customer_id && !subscription.stripe_customer_id.startsWith("cus_mock_")) {
      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripe_customer_id,
        return_url: `${appUrl}/dashboard/settings`,
      });

      return NextResponse.json({ url: session.url });
    } else {
      // Mock portal response for beta
      console.log(`[Stripe Portal] Mock portal active. Redirecting to settings page.`);
      return NextResponse.json({ url: `${appUrl}/dashboard/settings?mock_portal=true` });
    }
  } catch (error) {
    console.error("[Stripe Portal Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
