"use client";

import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { authClerkAppearance } from "@/components/auth/clerkAppearance";

export default function SignInPage() {
  return (
    <AuthLayout mode="sign-in">
      <SignIn appearance={authClerkAppearance} />
    </AuthLayout>
  );
}
