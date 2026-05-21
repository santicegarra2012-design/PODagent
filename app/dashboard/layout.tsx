import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

// This layout wraps every route under /dashboard/** automatically.
// Any new page you add at /dashboard/anything will inherit the
// sidebar, topbar, dark theme, and responsive layout with zero extra code.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
