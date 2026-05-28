"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  LineChart,
  Loader2,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingProductInput, PricingRecommendation } from "@/lib/pricing/types";

const samplePricingInput: PricingProductInput = {
  productId: "demo-retro-dad-shirt",
  marketplace: "etsy",
  productType: "Comfort Colors T-Shirt",
  niche: "retro fishing dad humor",
  currency: "USD",
  currentPrice: 24.99,
  productionCost: 9.2,
  shippingCost: 4.35,
  fulfillmentProvider: "printify",
  reviewCount: 184,
  rating: 4.8,
  bsr: 18342,
  rankPercentile: 0.18,
  saturationScore: 0.58,
  colorPopularityScore: 0.74,
  stylePopularityScore: 0.81,
  geographicDemandScore: 0.67,
  seasonalityScore: 0.76,
  urgencyScarcityScore: 0.42,
  perceivedValueScore: 0.78,
  conversionLikelihood: 0.043,
  estimatedElasticity: -1.18,
  demandSpikeScore: 0.69,
  historicalSales: Array.from({ length: 42 }, (_, index) => {
    const units = 3 + Math.round(Math.sin(index / 4) * 2 + index / 16);
    return {
      date: new Date(Date.now() - (42 - index) * 86400000).toISOString().slice(0, 10),
      price: index > 24 ? 24.99 : 22.99,
      units,
      revenue: units * 24.99,
      sessions: 82 + index * 3,
      conversionRate: 0.032 + index / 4000,
      marketplaceRank: 28000 - index * 220,
    };
  }),
  competitorPrices: [
    { marketplace: "etsy", title: "Vintage Fishing Dad Shirt", price: 21.99, shippingPrice: 4.99, reviewCount: 92, rating: 4.6, rankPercentile: 0.28, observedAt: new Date().toISOString(), isDirectSubstitute: true },
    { marketplace: "etsy", title: "Funny Bass Fishing Tee", price: 24.5, shippingPrice: 0, reviewCount: 344, rating: 4.9, rankPercentile: 0.12, observedAt: new Date().toISOString(), isDirectSubstitute: true },
    { marketplace: "etsy", title: "Retro Outdoors Shirt", price: 27.99, shippingPrice: 3.99, reviewCount: 58, rating: 4.7, rankPercentile: 0.33, observedAt: new Date().toISOString(), isDirectSubstitute: true },
    { marketplace: "etsy", title: "Fishing Grandpa Gift", price: 19.99, shippingPrice: 5.49, reviewCount: 21, rating: 4.4, rankPercentile: 0.52, observedAt: new Date().toISOString(), isDirectSubstitute: false },
    { marketplace: "etsy", title: "Premium Comfort Fishing Shirt", price: 29.99, shippingPrice: 0, reviewCount: 211, rating: 4.9, rankPercentile: 0.16, observedAt: new Date().toISOString(), isDirectSubstitute: true },
  ],
  trendSignals: [
    { source: "tiktok", label: "dad fishing gifts", score: 0.78, velocity: 0.74, confidence: 0.7, observedAt: new Date().toISOString() },
    { source: "pinterest", label: "father's day fishing shirt", score: 0.82, velocity: 0.68, confidence: 0.76, observedAt: new Date().toISOString() },
    { source: "internal_search", label: "retro outdoors", score: 0.66, velocity: 0.53, confidence: 0.84, observedAt: new Date().toISOString() },
  ],
  activeHolidayEvents: ["Father's Day", "Summer camping season"],
  objective: "balanced",
  minMarginPercent: 32,
};

const heatmapCells = [
  ["Etsy", 0.82],
  ["Amazon", 0.64],
  ["Shopify", 0.71],
  ["Redbubble", 0.48],
  ["TeePublic", 0.44],
  ["eBay", 0.57],
  ["Zazzle", 0.62],
  ["Fourthwall", 0.69],
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function MetricCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Target; tone: string }) {
  return (
    <div className="glass border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
        <Icon className={cn("w-4 h-4", tone)} />
      </div>
      <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

export default function PricingIntelligencePage() {
  const [recommendation, setRecommendation] = useState<PricingRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const competitorMedian = useMemo(() => {
    const prices = samplePricingInput.competitorPrices.map((item) => item.price + item.shippingPrice).sort((a, b) => a - b);
    return prices[Math.floor(prices.length / 2)];
  }, []);

  const runSimulation = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/pricing/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samplePricingInput),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pricing simulation failed");
      setRecommendation(data);
    } catch (pricingError) {
      setError(pricingError instanceof Error ? pricingError.message : "Pricing simulation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <BrainCircuit className="h-4 w-4" />
            Pricing Intelligence
          </div>
          <h1 className="text-3xl font-black text-slate-950">Dynamic POD Pricing Terminal</h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Simulate profit, velocity, conversion, and ranking outcomes across marketplace pressure, trend momentum, costs, reviews, and demand signals.
          </p>
        </div>
        <button
          onClick={runSimulation}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-600 disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Run Pricing Engine
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Current price" value={formatCurrency(samplePricingInput.currentPrice)} icon={Target} tone="text-slate-500" />
        <MetricCard label="Competitor median" value={formatCurrency(competitorMedian)} icon={Radar} tone="text-amber-500" />
        <MetricCard label="Recommended" value={recommendation ? formatCurrency(recommendation.recommendedPrice) : "Pending"} icon={Zap} tone="text-primary" />
        <MetricCard label="Confidence" value={recommendation ? `${Math.round(recommendation.confidenceScore * 100)}%` : "Pending"} icon={ShieldCheck} tone="text-emerald-500" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass rounded-2xl border-slate-200 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Price Frontier</p>
              <h2 className="text-lg font-black text-slate-950">Simulation candidates</h2>
            </div>
            <LineChart className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-3">
            {(recommendation?.candidates ?? []).map((candidate) => (
              <div key={candidate.price} className="grid grid-cols-[72px_1fr_84px] items-center gap-3 text-sm">
                <span className="font-bold text-slate-700">{formatCurrency(candidate.price)}</span>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(candidate.objectiveScore * 100, 8)}%` }} />
                </div>
                <span className="text-right font-bold text-slate-500">{Math.round(candidate.objectiveScore * 100)} score</span>
              </div>
            ))}
            {!recommendation && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
                Run the engine to generate a ranked frontier of price candidates.
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl border-slate-200 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Niche Profitability</p>
              <h2 className="text-lg font-black text-slate-950">Marketplace heatmap</h2>
            </div>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {heatmapCells.map(([label, score]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{label}</span>
                  <span className="text-xs font-black text-slate-950">{Math.round(Number(score) * 100)}</span>
                </div>
                <div className="h-16 rounded-xl" style={{ backgroundColor: `rgba(59, 130, 246, ${0.16 + Number(score) * 0.55})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl border-slate-200 p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-black text-slate-950">AI reasoning</h2>
          </div>
          <div className="space-y-3">
            {(recommendation?.reasoning ?? ["Run a simulation to generate model reasoning and risk-aware pricing explanations."]).map((item) => (
              <p key={item} className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl border-slate-200 p-6">
          <div className="mb-5 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="text-lg font-black text-slate-950">Live alerts</h2>
          </div>
          <div className="space-y-3">
            {(recommendation?.alerts ?? []).map((alert) => (
              <div key={`${alert.type}-${alert.title}`} className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-black text-amber-900">{alert.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-700">{alert.detail}</p>
              </div>
            ))}
            {recommendation && recommendation.alerts.length === 0 && (
              <p className="rounded-2xl bg-white p-4 text-sm text-slate-500">No critical pricing alerts for this simulation.</p>
            )}
            {!recommendation && <p className="rounded-2xl bg-white p-4 text-sm text-slate-500">Alerts appear after competitor and margin checks run.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
