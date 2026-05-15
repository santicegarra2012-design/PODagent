import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiVersion: "2026-04-22.dahlia" as any,
      appInfo: {
        name: "POD Agent",
        version: "0.1.0",
      },
    });
  }
  return stripeInstance;
};

export const getStripeSession = async (priceId: string, userId: string, userEmail: string) => {
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
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      userId,
    },
  });

  return session;
};
