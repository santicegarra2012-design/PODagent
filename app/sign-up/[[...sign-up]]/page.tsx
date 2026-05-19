"use client";

import { SignUp } from "@clerk/nextjs";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { authClerkAppearance } from "@/components/auth/clerkAppearance";

export default function SignUpPage() {
  return (
    <AuthPageShell>
      <AuthCard>
        <SignUp appearance={authClerkAppearance} />
      </AuthCard>
    </AuthPageShell>
  );
}
