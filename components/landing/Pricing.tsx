"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Crown, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with POD.",
    features: [
      "5 AI SEO Generations/month",
      "Basic Trend Research",
      "Save up to 10 Projects",
      "Trademark Checker (Limited)",
    ],
    buttonText: "Get Started",
    popular: false,
    priceId: null,
    icon: Sparkles,
    gradient: "from-zinc-500/20 to-zinc-600/20",
    borderHover: "hover:border-zinc-500/30",
  },
  {
    name: "Pro",
    price: "$5.99",
    period: "/mo",
    description: "Everything you need to dominate the market.",
    features: [
      "Unlimited AI SEO Generations",
      "Advanced Trend Research",
      "AI Image Studio Access",
      "Bulk Listing Optimizer",
      "Priority AI Queue",
    ],
    buttonText: "Contact Sales",
    popular: true,
    priceId: null,
    icon: Sparkles,
    gradient: "from-primary/20 to-blue-600/20",
    borderHover: "hover:border-primary/50",
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/mo",
    description: "For teams and established POD brands.",
    features: [
      "Everything in Pro",
      "Multi-user Support",
      "Custom AI Fine-tuning",
      "API Access for Bulk Ops",
      "Dedicated Account Manager",
    ],
    buttonText: "Contact Sales",
    popular: false,
    priceId: null,
    icon: Crown,
    gradient: "from-purple-500/20 to-pink-500/20",
    borderHover: "hover:border-purple-500/30",
  }
];

export function Pricing() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);

  // Show a message if user was redirected from canceled checkout
  useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      toast.info("Checkout canceled. No charges were made. Upgrade anytime you're ready.", {
        duration: 5000,
      });
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("canceled");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  const handleAction = async (plan: typeof plans[0]) => {
    if (plan.name === "Free") {
      router.push(isSignedIn ? "/dashboard" : "/sign-up");
      return;
    }

    if (!plan.priceId) {
      toast.info("Billing is being reconfigured. Please contact support for upgrades.");
      return;
    }

    if (!isSignedIn) {
      toast("Please sign in first to upgrade.", {
        action: {
          label: "Sign Up",
          onClick: () => router.push("/sign-up"),
        },
      });
      return;
    }

    try {
      setLoading(plan.name);
      toast.loading("Preparing your checkout...", { id: "checkout" });
      
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      });
      const data = await res.json();
      
      if (data.url) {
        toast.success("Redirecting to secure checkout...", { id: "checkout" });
        setTimeout(() => window.location.assign(data.url), 500);
      } else {
        toast.error("Failed to generate checkout link.", { id: "checkout" });
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Failed to start checkout. Please try again.", { id: "checkout" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/15 rounded-full blur-[150px] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Simple pricing, no surprises
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Choose your <span className="text-gradient-primary">growth plan</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Start free, upgrade when you&apos;re ready. Cancel anytime.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-3xl border transition-all duration-300",
                plan.popular 
                  ? "border-primary/40 bg-gradient-to-b from-primary/[0.08] to-transparent shadow-2xl shadow-primary/10 scale-[1.02] md:-my-2"
                  : "border-slate-200 bg-white hover:bg-slate-50",
                plan.borderHover
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-5 py-1.5 bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg shadow-primary/30 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                {/* Plan header */}
                <div className="mb-6">
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                    plan.gradient
                  )}>
                    <plan.icon className={cn(
                      "w-5 h-5",
                      plan.popular ? "text-primary" : plan.name === "Premium" ? "text-purple-400" : "text-slate-400"
                    )} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-slate-500 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-slate-500 font-medium text-sm">{plan.period}</span>}
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3.5 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        plan.popular ? "bg-primary/20" : "bg-slate-100"
                      )}>
                        <Check className={cn(
                          "w-3 h-3",
                          plan.popular ? "text-primary" : "text-slate-400"
                        )} />
                      </div>
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => handleAction(plan)}
                  disabled={!!loading}
                  className={cn(
                    "w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-center transition-all flex items-center justify-center gap-2 group",
                    plan.popular 
                      ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40" 
                      : plan.name === "Premium"
                        ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-700 hover:from-purple-500/20 hover:to-pink-500/20"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
                    loading === plan.name && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {loading === plan.name ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.buttonText}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-400 text-sm mt-10"
        >
          Billing is being reconfigured for the new project.
        </motion.p>
      </div>
    </section>
  );
}
