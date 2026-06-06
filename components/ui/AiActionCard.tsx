import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface AiActionCardProps {
  title: string;
  description: string;
  actionText: string;
  onAction?: () => void;
  type?: "recommendation" | "opportunity" | "research" | "alert";
}

export function AiActionCard({
  title,
  description,
  actionText,
  onAction,
  type = "recommendation"
}: AiActionCardProps) {
  const getGradient = () => {
    switch (type) {
      case "opportunity":
        return "from-green-500/20 to-emerald-500/5";
      case "research":
        return "from-blue-500/20 to-cyan-500/5";
      case "alert":
        return "from-amber-500/20 to-orange-500/5";
      default:
        return "from-indigo-500/20 to-purple-500/5";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "opportunity":
        return "text-green-400";
      case "research":
        return "text-blue-400";
      case "alert":
        return "text-amber-400";
      default:
        return "text-indigo-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-slate-900 p-6`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-50 pointer-events-none`} />
      
      <div className="relative z-10 flex items-start gap-4">
        <div className={`mt-1 p-2 rounded-lg bg-slate-800 ${getIconColor()}`}>
          <Sparkles className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            {description}
          </p>
          
          <button
            onClick={onAction}
            className={`flex items-center gap-2 text-sm font-medium ${getIconColor()} hover:text-white transition-colors`}
          >
            {actionText} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
