"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu, Sparkles } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Your POD business command center" },
  "/dashboard/copilot": { title: "AI Copilot", subtitle: "Your personal POD business advisor" },
  "/dashboard/research": { title: "Research Center", subtitle: "Discover profitable niches and market opportunities" },
  "/dashboard/opportunities": { title: "Opportunities", subtitle: "Top market opportunities ranked by AI" },
  "/dashboard/tasks": { title: "Tasks", subtitle: "Track your POD business tasks and progress" },
  "/dashboard/memories": { title: "Memory Management", subtitle: "Manage what the Copilot remembers about you" },
  "/dashboard/history": { title: "History", subtitle: "Browse your past generations" },
  "/dashboard/projects": { title: "Projects", subtitle: "Manage your saved POD projects" },
  "/dashboard/settings": { title: "Settings", subtitle: "Manage your account and preferences" },
  "/dashboard/images": { title: "Designs", subtitle: "Generate premium POD artwork with AI" },
  "/dashboard/trends": { title: "Trend Research", subtitle: "Discover viral niches and market opportunities" },
  "/dashboard/trademark": { title: "Trademark Checker", subtitle: "Protect your shop from IP violations" },
  "/dashboard/optimizer": { title: "Listing Optimizer", subtitle: "Supercharge your listings with AI" },
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: "Dashboard", subtitle: "" };
  const { subscription, isPro, isLoading } = useSubscription();

  const planLabel = subscription?.plan === "premium" ? "Premium Plan" : isPro ? "Pro Plan" : "Free Plan";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 border-b border-slate-200 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors -ml-2"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-slate-900 leading-tight">{page.title}</h1>
          {page.subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block">{page.subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
          isPro
            ? "bg-primary/10 border-primary/20 text-primary"
            : "bg-slate-100 border-slate-200 text-slate-500"
        }`}>
          <Sparkles className="w-3 h-3" />
          {isLoading ? "Loading Plan..." : planLabel}
        </div>
        <UserButton />
      </div>
    </header>
  );
}
