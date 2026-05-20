"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="group relative w-full max-w-[440px]"
    >
      {/* Animated gradient border */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500/50 via-violet-500/50 to-cyan-500/50 opacity-60 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 auth-gradient-border"
        aria-hidden
      />

      {/* Glow behind card */}
      <div className="absolute -inset-8 rounded-3xl bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-violet-500/15" />

      <div className="relative overflow-visible rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-0.5 sm:p-10">
        {/* Inner shine */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />

        <div className="relative">{children}</div>

        <div className="relative mt-8 flex items-center justify-center gap-2 border-t border-white/5 pt-6">
          <Shield className="h-3.5 w-3.5 text-slate-500" aria-hidden />
          <span className="text-xs font-medium text-slate-500 tracking-wide">
            Secured by Clerk
          </span>
        </div>
      </div>
    </motion.div>
  );
}
