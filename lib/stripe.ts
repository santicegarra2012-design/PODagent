import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
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
