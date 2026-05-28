"use client";

import { motion } from "framer-motion";
import { RefreshCw, Save, Download, Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  onGenerate: () => void;
  onSave: () => void;
  onCopyAll: () => void;
  isSaving: boolean;
  hasResult: boolean;
}

export function QuickActions({
  onGenerate,
  onSave,
  onCopyAll,
  isSaving,
  hasResult,
}: QuickActionsProps) {
  const actions = [
    {
      label: "Generate Again",
      icon: RefreshCw,
      onClick: onGenerate,
      disabled: false,
      variant: "ghost",
    },
    {
      label: isSaving ? "Saving…" : "Save Project",
      icon: isSaving ? Loader2 : Save,
      onClick: onSave,
      disabled: !hasResult || isSaving,
      variant: "primary",
      iconClass: isSaving ? "animate-spin" : "",
    },
    {
      label: "Copy All",
      icon: Copy,
      onClick: onCopyAll,
      disabled: !hasResult,
      variant: "ghost",
    },
    {
      label: "Export",
      icon: Download,
      onClick: () => {},
      disabled: !hasResult,
      variant: "ghost",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass border-slate-200 rounded-2xl p-5"
    >
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              action.variant === "primary"
                ? "bg-primary text-white hover:bg-primary-600 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            <action.icon className={cn("w-4 h-4 shrink-0", action.iconClass ?? "")} />
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
