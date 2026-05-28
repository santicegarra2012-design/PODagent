"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="md:ml-60 flex flex-col min-h-screen">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 md:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
