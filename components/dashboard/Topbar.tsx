"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu, Sparkles } from "lucide-react";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "AI Generator", subtitle: "Create market-ready SEO content for your POD products" },
  "/dashboard/history": { title: "History", subtitle: "Browse your past generations" },
  "/dashboard/projects": { title: "Projects", subtitle: "Manage your saved POD projects" },
  "/dashboard/settings": { title: "Settings", subtitle: "Manage your account and preferences" },
  "/dashboard/images": { title: "AI Image Studio", subtitle: "Generate premium POD artwork with AI" },
  "/dashboard/trends": { title: "Trend Research", subtitle: "Discover viral niches and market opportunities" },
  "/dashboard/trademark": { title: "Trademark Checker", subtitle: "Protect your shop from IP violations and bans" },
  "/dashboard/optimizer": { title: "Listing Optimizer", subtitle: "Supercharge your titles, tags, and descriptions with AI" },
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: "Dashboard", subtitle: "" };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-black/70 border-b border-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors -ml-2"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-white leading-tight">{page.title}</h1>
          {page.subtitle && (
            <p className="text-xs text-zinc-500 hidden sm:block">{page.subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
          <Sparkles className="w-3 h-3" />
          Pro Plan
        </div>
        <UserButton />
      </div>
    </header>
  );
}
