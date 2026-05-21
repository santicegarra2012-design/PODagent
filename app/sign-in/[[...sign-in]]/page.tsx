import { AuthClerkForm } from "@/components/auth/AuthClerkForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout mode="sign-in">
      <AuthClerkForm mode="sign-in" />
    </AuthLayout>
  );
}
