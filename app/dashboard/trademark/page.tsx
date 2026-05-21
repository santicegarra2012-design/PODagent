"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Search, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  Info,
} from "lucide-react";
import { RiskIndicator } from "@/components/trademark/RiskIndicator";
import type { TrademarkCheckResult } from "@/lib/trademark/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useSubscription } from "@/hooks/use-subscription";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { Lock } from "lucide-react";

export default function TrademarkPage() {
  const { isPro, isLoading: subLoading } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrademarkCheckResult | null>(null);

  const handleCheck = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isPro) {
      setShowUpgrade(true);
      return;
    }
    if (!keyword.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/trademark-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (error) {
      console.error("Check failed:", error);
      toast.error("Failed to analyze trademark. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (subLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative">
      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        title="Pro Feature: Trademark Shield"
        description="Our AI trademark risk pre-screen is exclusive to Pro members. Use it to catch obvious issues before doing a final manual or legal review."
      />

      {!isPro && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-3xl pointer-events-none">
          <div className="p-8 glass border-primary/20 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm pointer-events-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Unlock Safety Shield</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Trademark risk analysis is a Pro feature. Upgrade to verify your listings and avoid potential bans.
              </p>
            </div>
            <button 
              onClick={() => setShowUpgrade(true)}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-600 transition-all"
            >
              Unlock Now
            </button>
          </div>
        </div>
      )}

      <div className={cn("space-y-8", !isPro && "opacity-50 pointer-events-none blur-[1px]")}>
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4" />
            Safety First
          </div>
          <h1 className="text-3xl font-bold text-white">Trademark Checker</h1>
          <p className="text-zinc-500 text-sm max-w-lg">
            Use AI to pre-screen listing titles, keywords, and phrases for possible IP risk before you publish.
          </p>
        </div>

        {/* Input Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          
          <form 
            onSubmit={handleCheck}
            className="relative glass border-white/10 rounded-2xl p-2 flex items-center gap-2"
          >
            <div className="pl-4">
              <Search className="w-5 h-5 text-zinc-500" />
            </div>
            
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter phrase (e.g., 'Retro Nike Style' or 'Disney Dad')…"
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 text-base py-4"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !keyword.trim()}
              className={cn(
                "flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all",
                "bg-primary text-white shadow-lg shadow-primary/25",
                "hover:bg-primary-600 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning…
                </>
              ) : (
                "Check Trademark"
              )}
            </button>
          </form>
        </div>

        {/* Quick Suggestions */}
        {!result && !isLoading && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Try Examples:</span>
            {["Disney Dad", "Retro Nike parody", "Funny Cat Shirt"].map((s) => (
              <button
                key={s}
                onClick={() => { setKeyword(s); setTimeout(() => handleCheck(), 10); }}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Results Panel */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6"
            >
              {/* Left: Risk Indicator */}
              <RiskIndicator level={result.riskLevel} />

              {/* Right: Detailed Analysis */}
              <div className="space-y-6">
                {/* Explanation */}
                <div className="glass border-white/10 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-4 text-zinc-400">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Analysis Detail</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    {result.explanation}
                  </p>

                  {result.flaggedTerms.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[11px] font-bold text-zinc-500 uppercase mb-2">Flagged Terms</p>
                      <div className="flex flex-wrap gap-2">
                        {result.flaggedTerms.map((term) => (
                          <span key={term} className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Alternatives */}
                  <div className="glass border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-4 text-emerald-400">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Safer Alternatives</span>
                    </div>
                    <ul className="space-y-3">
                      {result.safeAlternatives.map((alt, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-zinc-400 group cursor-pointer hover:text-white transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {alt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compliance Tips */}
                  <div className="glass border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Compliance Tips</span>
                    </div>
                    <ul className="space-y-3">
                      {result.complianceTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-500 leading-relaxed">
                          <span className="text-primary mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Card */}
        {!result && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-6"
          >
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-1 text-lg">Why use Trademark Checker?</h4>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
                Platforms like Etsy and Amazon can flag trademarked names like &quot;Nike&quot;, &quot;Marvel&quot;, or &quot;Swiftie&quot;. This tool gives you an AI pre-screen and safer wording ideas, but it is not a substitute for an official USPTO or legal review.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
