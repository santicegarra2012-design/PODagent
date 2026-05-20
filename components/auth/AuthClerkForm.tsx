"use client";

import { SignIn, SignUp, useAuth } from "@clerk/nextjs";
import { AlertCircle, Loader2 } from "lucide-react";
import { authClerkAppearance } from "./clerkAppearance";

type AuthClerkFormProps = {
  mode: "sign-in" | "sign-up";
};

function isClerkConfigured() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  if (!key) return false;
  // Reject known placeholder keys from templates
  if (key.includes("your-app") || key.includes("Y2xlcmsueW91ci1hcHA")) return false;
  return key.startsWith("pk_test_") || key.startsWith("pk_live_");
}

export function AuthClerkForm({ mode }: AuthClerkFormProps) {
  const { isLoaded } = useAuth();
  const configured = isClerkConfigured();

  if (!configured) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-center"
      >
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-amber-400" />
        <p className="text-sm font-semibold text-white">Authentication not configured</p>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Add your Clerk API keys to <code className="text-cyan-400">.env.local</code> (local) or
          Vercel Environment Variables (production), then redeploy.
        </p>
      </div>
    );
  }

  const sharedProps = {
    appearance: authClerkAppearance,
    routing: "path" as const,
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" aria-hidden />
        <p className="text-sm">Loading sign {mode === "sign-in" ? "in" : "up"}…</p>
      </div>
    );
  }

  return (
    <div className="auth-clerk-root w-full">
      {mode === "sign-in" ? (
        <SignIn
          {...sharedProps}
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      ) : (
        <SignUp
          {...sharedProps}
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
        />
      )}
    </div>
  );
}
