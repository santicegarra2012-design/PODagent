import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "./supabase-admin";

export async function getSubscription() {
  const { userId } = await auth();
  if (!userId) return null;

  const { data: subscription } = await getSupabaseAdmin()
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  return subscription;
}

export async function isProUser() {
  const subscription = await getSubscription();
  return subscription?.status === "active" || subscription?.status === "trialing";
}
