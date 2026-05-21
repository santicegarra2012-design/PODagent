import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "./supabase-admin";
import { getStripe } from "./stripe";

type SubscriptionRecord = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string;
  stripe_price_id: string | null;
  status: string | null;
  plan: string | null;
  current_period_end: string | null;
};

function isPaidStatus(status: string | null | undefined) {
  return status === "active" || status === "trialing";
}

function getPlanFromPriceId(priceId: string | null | undefined) {
  if (!priceId) {
    return "pro";
  }

  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
    return "premium";
  }

  return "pro";
}

async function getStoredSubscription(userId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle<SubscriptionRecord>();

  if (error) {
    console.error("[subscription] Failed to read stored subscription:", error);
    return null;
  }

  return data;
}

function selectBestStripeSubscription(subscriptions: Stripe.Subscription[]) {
  const rankedStatuses = ["active", "trialing", "past_due", "unpaid", "canceled", "incomplete", "incomplete_expired", "paused"];

  return [...subscriptions].sort((a, b) => {
    const statusDiff = rankedStatuses.indexOf(a.status) - rankedStatuses.indexOf(b.status);
    if (statusDiff !== 0) {
      return statusDiff;
    }

    return b.created - a.created;
  })[0] ?? null;
}

async function findStripeSubscriptionByEmail(email: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  try {
    const stripe = getStripe();
    const customers = await stripe.customers.list({
      email,
      limit: 10,
    });

    if (!customers.data.length) {
      return null;
    }

    let bestMatch: { customerId: string; subscription: Stripe.Subscription } | null = null;

    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "all",
        limit: 10,
      });

      const candidate = selectBestStripeSubscription(subscriptions.data);
      if (!candidate) {
        continue;
      }

      if (!bestMatch) {
        bestMatch = { customerId: customer.id, subscription: candidate };
        continue;
      }

      const currentBestPaid = isPaidStatus(bestMatch.subscription.status);
      const nextPaid = isPaidStatus(candidate.status);

      if (nextPaid && !currentBestPaid) {
        bestMatch = { customerId: customer.id, subscription: candidate };
        continue;
      }

      if (nextPaid === currentBestPaid && candidate.created > bestMatch.subscription.created) {
        bestMatch = { customerId: customer.id, subscription: candidate };
      }
    }

    return bestMatch;
  } catch (error) {
    console.error("[subscription] Stripe reconciliation failed:", error);
    return null;
  }
}

async function syncSubscriptionFromStripe(userId: string, email: string) {
  const stripeMatch = await findStripeSubscriptionByEmail(email);

  if (!stripeMatch) {
    return null;
  }

  const priceId = stripeMatch.subscription.items.data[0]?.price?.id ?? null;
  const record: SubscriptionRecord = {
    user_id: userId,
    stripe_customer_id: stripeMatch.customerId,
    stripe_subscription_id: stripeMatch.subscription.id,
    stripe_price_id: priceId,
    status: stripeMatch.subscription.status,
    plan: getPlanFromPriceId(priceId),
    // @ts-expect-error Stripe current_period_end is unix seconds in runtime object
    current_period_end: new Date(stripeMatch.subscription.current_period_end * 1000).toISOString(),
  };

  const { error } = await getSupabaseAdmin().from("subscriptions").upsert(record, {
    onConflict: "user_id",
  });

  if (error) {
    console.error("[subscription] Failed to upsert Stripe subscription:", error);
    return null;
  }

  return record;
}

export async function getSubscription() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const storedSubscription = await getStoredSubscription(userId);
  if (storedSubscription) {
    return storedSubscription;
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return null;
  }

  return syncSubscriptionFromStripe(userId, email);
}

export async function isProUser() {
  const subscription = await getSubscription();
  return isPaidStatus(subscription?.status);
}
