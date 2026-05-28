"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

// Inner component that uses useSearchParams - must be wrapped in Suspense
function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [planName, setPlanName] = useState<string>("");
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let cancelled = false;

    async function verifyPayment() {
      try {
        console.log("[payment-success] Verifying session:", sessionId);

        const res = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok || !data.verified) {
          console.error("[payment-success] Verification failed:", data);
          setStatus("error");
          return;
        }

        console.log("[payment-success] Payment verified:", data);

        const subRes = await fetch("/api/user/subscription", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        const subData = await subRes.json();

        if (cancelled) return;

        if (subData?.plan) {
          setPlanName(subData.plan === "premium" ? "Premium" : "Pro");
        } else {
          setPlanName("Pro");
        }

        setStatus("success");

        // Auto-redirect to dashboard after 3 seconds
        redirectTimerRef.current = setTimeout(() => {
          if (!cancelled) {
            router.push("/dashboard");
          }
        }, 3000);
      } catch (error) {
        if (!cancelled) {
          console.error("[payment-success] Error verifying payment:", error);
          setStatus("error");
        }
      }
    }

    verifyPayment();

    return () => {
      cancelled = true;
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Verifying State */}
        {status === "verifying" && (
          <div className="glass border-slate-200 rounded-3xl p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Verifying your payment...</h2>
              <p className="text-sm text-slate-500 mt-2">
                Please wait while we confirm your subscription.
              </p>
            </div>
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border-green-500/20 rounded-3xl p-8 text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="mx-auto w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-green-400" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Payment Successful! 🎉</h2>
              <p className="text-slate-500">
                Welcome to{" "}
                <span className="text-primary font-semibold">
                  {planName || "Pro"}
                </span>
                ! Your subscription is now active.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-left">
              {[
                "Unlimited AI SEO Generations",
                "Full Trend Research Suite",
                "AI Image Studio Access",
                "Bulk Listing Optimizer",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <p className="text-xs text-slate-400">
              Redirecting to dashboard in a few seconds...
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="glass border-red-500/20 rounded-3xl p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Verification Needed</h2>
              <p className="text-sm text-slate-500 mt-2">
                We couldn&apos;t verify your payment automatically. Your subscription may still be processing.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (sessionId) {
                    window.location.reload();
                  } else {
                    router.push("/dashboard");
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary-600 transition-all"
              >
                Try Again
              </button>
              <Link
                href="/dashboard"
                className="block w-full py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
            {sessionId && (
              <p className="text-[10px] text-slate-400 font-mono">
                Session: {sessionId.slice(0, 16)}...
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Wrap in Suspense as required by Next.js 15+ for useSearchParams
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
