import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "./supabase-admin";

type SubscriptionRecord = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: string | null;
  plan: string | null;
  current_period_end: string | null;
};

function isPaidStatus(status: string | null | undefined) {
  return status === "active" || status === "trialing";
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

export async function getSubscription() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  return getStoredSubscription(userId);
}

export async function isProUser() {
  const subscription = await getSubscription();
  return isPaidStatus(subscription?.status);
}
