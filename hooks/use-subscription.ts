"use client";

import { useState, useEffect } from "react";

export function useSubscription() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/subscription")
      .then((res) => res.json())
      .then((data) => {
        setSubscription(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const isPro = subscription?.status === "active" || subscription?.status === "trialing";

  return { subscription, isPro, isLoading };
}
