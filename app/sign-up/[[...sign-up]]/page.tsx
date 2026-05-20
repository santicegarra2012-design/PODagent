"use client";

import { AuthClerkForm } from "@/components/auth/AuthClerkForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout mode="sign-up">
      <AuthClerkForm mode="sign-up" />
    </AuthLayout>
  );
}
