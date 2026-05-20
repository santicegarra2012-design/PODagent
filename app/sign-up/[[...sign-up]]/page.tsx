"use client";

import { SignUp } from "@clerk/nextjs";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { authClerkAppearance } from "@/components/auth/clerkAppearance";

export default function SignUpPage() {
  return (
    <AuthLayout mode="sign-up">
      <SignUp appearance={authClerkAppearance} />
    </AuthLayout>
  );
}
