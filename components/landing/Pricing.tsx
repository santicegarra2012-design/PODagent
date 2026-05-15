"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    buttonText: "Upgrade to Pro",
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/mo",
    description: "For teams and established POD brands.",
    features: [
      "Multi-user Support",
      "Custom AI Fine-tuning",
      "API Access for Bulk Ops",
      "Dedicated Account Manager",
    ],
    buttonText: "Upgrade to Premium",
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
  }
];

export function Pricing() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (plan: typeof plans[0]) => {
    if (plan.name === "Free") {
      router.push(isSignedIn ? "/dashboard" : "/sign-up");
      return;
    }

    if (!plan.priceId) {
      alert("Please contact our sales team for this plan.");
      return;
    }

    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    try {
      setLoading(plan.name);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent <span className="text-gradient-primary">pricing</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Choose the perfect plan for your Print-on-Demand business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "glass p-8 rounded-3xl relative flex flex-col",
                plan.popular ? "border-primary/50 shadow-2xl shadow-primary/20" : "border-white/10"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-zinc-400 text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-zinc-400 font-medium">{plan.period}</span>}
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleAction(plan)}
                disabled={!!loading}
                className={cn(
                  "w-full py-4 px-6 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2",
                  plan.popular 
                    ? "bg-primary text-white hover:bg-primary-600 shadow-lg shadow-primary/20" 
                    : "bg-white/10 text-white hover:bg-white/20",
                  loading === plan.name && "opacity-50 cursor-not-allowed"
                )}
              >
                {loading === plan.name ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
