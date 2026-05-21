"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { authClerkAppearance } from "./clerkAppearance";

type AuthClerkFormProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthClerkForm({ mode }: AuthClerkFormProps) {
  const sharedProps = {
    appearance: authClerkAppearance,
    routing: "path" as const,
    forceRedirectUrl: "/dashboard",
  };

  return (
    <div className="auth-clerk-root w-full min-h-[380px]">
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
