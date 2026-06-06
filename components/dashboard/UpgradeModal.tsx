"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Check, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function UpgradeModal({ isOpen, onClose, title, description }: UpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass border-primary/20 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-4">
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">{title || "Upgrade to Pro"}</h3>
              <p className="text-slate-500 text-sm">
                {description || "Unlock the full power of POD Agent with a Pro subscription."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 text-left max-w-xs mx-auto py-4">
              {[
                "Unlimited AI Generations",
                "Full Trend Research Suite",
                "Bulk Listing Optimizer",
                "Priority Support"
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-primary" />
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={() => { router.push("/#pricing"); onClose(); }}
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade Now
            </button>
            
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Billing is being reconfigured
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
