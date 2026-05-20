"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { AuthCard } from "./AuthCard";
import { AuthMarketingPanel } from "./AuthMarketingPanel";

type AuthLayoutProps = {
  mode: "sign-in" | "sign-up";
  children: React.ReactNode;
};

export function AuthLayout({ mode, children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-slate-200">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 auth-grid-bg" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA0Ii8+PC9zdmc+')] opacity-40"
        aria-hidden
      />

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <AuthMarketingPanel mode={mode} />

        {/* Auth panel */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8 lg:px-12 xl:px-16">
          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col items-center lg:hidden"
          >
            <Link href="/" className="flex flex-col items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Merch Agent</span>
            </Link>
          </motion.div>

          <AuthCard>{children}</AuthCard>
        </div>
      </div>
    </div>
  );
}
