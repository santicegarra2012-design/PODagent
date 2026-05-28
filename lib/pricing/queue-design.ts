import type { QueueDefinition } from "@/lib/pricing/types";

export const PRICING_QUEUE_DEFINITIONS: QueueDefinition[] = [
  {
    name: "marketplace-snapshot",
    purpose: "Scrape or ingest marketplace search pages, product pages, rank positions, reviews, shipping promises, and price changes.",
    concurrency: 12,
    retryLimit: 4,
    cadence: "Every 30-180 minutes based on product volatility tier.",
  },
  {
    name: "competitor-normalization",
    purpose: "Deduplicate listings, classify direct substitutes, normalize landed price, and enrich seller/product fingerprints.",
    concurrency: 8,
    retryLimit: 3,
    cadence: "Triggered after every snapshot batch.",
  },
  {
    name: "trend-signal-ingestion",
    purpose: "Pull Google/TikTok/Pinterest/internal search signals and compute trend velocity, acceleration, and anomaly z-scores.",
    concurrency: 6,
    retryLimit: 3,
    cadence: "Hourly for watched niches; daily for cold niches.",
  },
  {
    name: "pricing-recommendation",
    purpose: "Generate price candidates, simulate expected outcomes, create AI explanations, and emit repricing decisions.",
    concurrency: 10,
    retryLimit: 2,
    cadence: "Triggered by product event, competitor movement, demand spike, or scheduled repricing window.",
  },
  {
    name: "experiment-attribution",
    purpose: "Join price exposure windows to sessions, orders, rank movement, and profit so models learn from outcomes.",
    concurrency: 4,
    retryLimit: 5,
    cadence: "Nightly plus streaming updates for high-volume shops.",
  },
  {
    name: "alert-dispatch",
    purpose: "Send race-to-bottom, undercut, premium opportunity, anomaly, and margin safety notifications.",
    concurrency: 5,
    retryLimit: 3,
    cadence: "Event-driven with per-user throttling.",
  },
];

export const PRICING_CRON_SCHEDULES = [
  {
    name: "hot-product-monitor",
    expression: "*/30 * * * *",
    targetQueue: "marketplace-snapshot",
    description: "Refresh high-revenue products and fast-moving niches every 30 minutes.",
  },
  {
    name: "daily-market-baseline",
    expression: "15 3 * * *",
    targetQueue: "marketplace-snapshot",
    description: "Capture broad niche baselines while marketplace pages are less volatile.",
  },
  {
    name: "holiday-demand-refresh",
    expression: "0 */3 * * *",
    targetQueue: "trend-signal-ingestion",
    description: "Recompute seasonal windows and holiday demand curves during event ramps.",
  },
  {
    name: "nightly-model-feedback",
    expression: "45 4 * * *",
    targetQueue: "experiment-attribution",
    description: "Backfill experiment outcomes, elasticity estimates, and forecast residuals.",
  },
];
