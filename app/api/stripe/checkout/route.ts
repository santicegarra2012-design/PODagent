import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return new NextResponse("Price ID is required", { status: 400 });
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
      customer_email: user.emailAddresses[0].emailAddress,
      client_reference_id: userId,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe-checkout] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
