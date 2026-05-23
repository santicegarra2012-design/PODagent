"use client";

import { useState, useEffect, useCallback } from "react";

export function useSubscription() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/subscription", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      setSubscription(data);
      return data;
    } catch (error) {
      console.error("[use-subscription] Fetch error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isPro = subscription?.status === "active" || subscription?.status === "trialing";

  return { subscription, isPro, isLoading, refresh };
}
