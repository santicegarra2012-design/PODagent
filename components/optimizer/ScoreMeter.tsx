"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreMeterProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreMeter({ score, label, size = "md" }: ScoreMeterProps) {
  const radius = size === "lg" ? 45 : size === "md" ? 35 : 25;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorClass = score > 80 ? "text-green-400" : score > 60 ? "text-amber-400" : "text-red-400";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "relative flex items-center justify-center",
        size === "lg" ? "w-32 h-32" : size === "md" ? "w-24 h-24" : "w-16 h-16"
      )}>
        <svg className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="stroke-slate-200 fill-none"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            className={cn("fill-none transition-colors duration-500", colorClass.replace("text", "stroke"))}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn("font-black leading-none", size === "lg" ? "text-3xl" : "text-xl", colorClass)}
          >
            {score}
          </motion.span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Score</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}
