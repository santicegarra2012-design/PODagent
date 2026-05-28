"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { AuthDashboardPreview } from "./AuthDashboardPreview";

const features = [
  "AI-powered listing optimization",
  "Real-time niche trend intelligence",
  "Automated SEO tag generation",
  "Trademark risk scanning",
];

type AuthMarketingPanelProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthMarketingPanel({ mode }: AuthMarketingPanelProps) {
  const isSignIn = mode === "sign-in";

  return (
    <div className="relative hidden lg:flex lg:w-[52%] flex-col justify-between p-12 xl:p-16">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30 transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">POD Agent</span>
        </Link>
      </motion.div>

      <div className="relative z-10 max-w-xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI-Powered POD Platform
          </p>
          <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight text-white">
            {isSignIn ? (
              <>
                Welcome back to your{" "}
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  growth engine
                </span>
              </>
            ) : (
              <>
                Launch smarter merch with{" "}
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  AI precision
                </span>
              </>
            )}
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-md">
            {isSignIn
              ? "Pick up where you left off. Your trends, listings, and insights are ready."
              : "Join creators using AI to find winning niches, optimize listings, and scale faster."}
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3"
        >
          {features.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3 text-slate-700"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400" />
              <span className="text-[15px]">{feature}</span>
            </motion.li>
          ))}
        </motion.ul>

        <AuthDashboardPreview />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-slate-400"
      >
        Trusted by print-on-demand sellers worldwide
      </motion.p>
    </div>
  );
}
