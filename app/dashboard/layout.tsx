import { DashboardShell } from "@/components/dashboard/DashboardShell";

// This layout wraps every route under /dashboard/** automatically.
// Any new page you add at /dashboard/anything will inherit the
// sidebar, topbar, dark theme, and responsive layout with zero extra code.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
