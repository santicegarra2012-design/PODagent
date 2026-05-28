"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/trademark/types";

interface RiskIndicatorProps {
  level: RiskLevel;
}

const config = {
  Safe: {
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    glow: "shadow-[0_0_15px_rgba(74,222,128,0.2)]",
    icon: ShieldCheck,
    label: "Safe to Use",
  },
  "Medium Risk": {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    glow: "shadow-[0_0_15px_rgba(251,191,36,0.2)]",
    icon: ShieldAlert,
    label: "Proceed with Caution",
  },
  "High Risk": {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    glow: "shadow-[0_0_15px_rgba(248,113,113,0.2)]",
    icon: ShieldX,
    label: "Avoid / Copyright Risk",
  },
};

export function RiskIndicator({ level }: RiskIndicatorProps) {
  const { color, bg, border, glow, icon: Icon, label } = config[level];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "flex flex-col items-center gap-4 p-8 rounded-3xl border transition-all duration-500",
        bg,
        border,
        glow
      )}
    >
      <div className={cn("p-4 rounded-2xl bg-white border border-slate-200", color)}>
        <Icon className="w-10 h-10" />
      </div>
      <div className="text-center">
        <p className={cn("text-xs font-bold uppercase tracking-[0.2em] mb-1 opacity-80", color)}>
          Risk Analysis
        </p>
        <h3 className={cn("text-2xl font-black", color)}>{level}</h3>
        <p className="text-slate-500 text-sm mt-1 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}
