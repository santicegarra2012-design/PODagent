import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-04-10" as any }) : null;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { priceId } = await req.json();
    if (!priceId) {
      return new NextResponse("Price ID is required", { status: 400 });
    }

    // Determine plan type from the Price ID or name
    const plan = priceId.includes("premium") ? "premium" : "pro";

    if (stripe) {
      // Standard Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${appUrl}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/#pricing?canceled=true`,
        metadata: {
          userId,
          plan,
        },
      });

      return NextResponse.json({ url: session.url });
    } else {
      // Mock Stripe Checkout for Beta
      console.log(`[Stripe Checkout] Running in FREE BETA mode for user ${userId}. Generating mock session.`);
      const mockSessionId = `mock_session_${plan}_${userId}_${Date.now()}`;
      const mockSuccessUrl = `${appUrl}/dashboard/payment-success?session_id=${mockSessionId}`;

      return NextResponse.json({ url: mockSuccessUrl });
    }
  } catch (error) {
    console.error("[Stripe Checkout Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
