"use client";

import { SignIn } from "@clerk/nextjs";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { authClerkAppearance } from "@/components/auth/clerkAppearance";

export default function SignInPage() {
  return (
    <AuthPageShell>
      <AuthCard>
        <SignIn appearance={authClerkAppearance} />
      </AuthCard>
    </AuthPageShell>
  );
}
