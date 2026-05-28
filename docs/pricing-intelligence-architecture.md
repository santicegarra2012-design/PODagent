# AI Dynamic Pricing Intelligence Architecture

## Objective

Build a pricing system that behaves like a market-making desk for POD products: it continuously observes demand, competition, marketplace mechanics, cost changes, and seller goals, then recommends or executes the price that maximizes the selected objective.

The engine should not optimize for competitor averages. It should optimize expected contribution profit, conversion probability, sales velocity, and long-term rank while respecting margin floors and marketplace-specific behavior.

## Core Architecture

| Layer | Responsibility | Recommended Tech |
| --- | --- | --- |
| Product graph | Products, variants, niches, fulfillment provider, cost basis, connected marketplace listings | Supabase Postgres |
| Market data ingestion | Competitor prices, shipping, reviews, ratings, BSR/rank, stock/urgency signals, style/color frequency | Playwright workers, marketplace APIs, R2 raw snapshots |
| Event queue | Snapshot jobs, trend refreshes, normalization, repricing, alerts, experiment attribution | Redis + BullMQ |
| Feature store | Rolling windows for demand, velocity, price elasticity, rank movement, conversion, saturation | Postgres materialized views first; Timescale/ClickHouse later |
| Pricing engine | Candidate generation, margin guardrails, elasticity simulation, rank/conversion/profit scoring | TypeScript service now; Python ML service later |
| AI explanation layer | Natural-language reasoning, anomaly summaries, experiment recommendations | OpenAI/Gemini APIs with strict JSON outputs |
| Search/indexing | Fast competitor lookup, niche similarity, duplicate detection, seller/product fingerprints | Typesense or Meilisearch |
| Analytics UI | Pricing terminal, heatmaps, competitor tables, alerts, experiments, historical graphs | Next.js dashboard |
| Observability | Queue lag, scraper health, pricing drift, model residuals, alert volume | OpenTelemetry, Sentry, Supabase logs |

## Data Flow

1. A user connects or creates a product with marketplace, product type, niche, fulfillment provider, cost basis, and pricing objective.
2. `marketplace-snapshot` jobs collect competitor listings, BSR/ranking, rating quality, review count, shipping costs, visible promos, and price movements.
3. Raw HTML/API payloads are stored in Cloudflare R2; normalized facts are stored in Postgres.
4. `competitor-normalization` fingerprints direct substitutes by title embeddings, marketplace taxonomy, image hash, product type, niche, and seller behavior.
5. `trend-signal-ingestion` joins social trend velocity, marketplace search behavior, saved products, holiday/event calendars, color/style popularity, and geographic demand.
6. Feature builders compute rolling windows: price dispersion, undercut velocity, conversion trend, rank slope, demand acceleration, saturation, seasonality, and margin risk.
7. `pricing-recommendation` generates candidate prices, applies margin floors and marketplace fee models, simulates demand response, scores each candidate, and writes a recommendation.
8. The dashboard shows price frontier, AI reasoning, alerts, competitor comparison, experiments, and confidence score.
9. If autopilot is enabled, repricing waits for policy checks: max daily change, margin floor, active experiment constraints, marketplace rate limits, and user approval rules.
10. Outcome attribution learns from sessions, orders, profit, and rank changes after each price exposure window.

## Database Model

Use `supabase_pricing_intelligence_schema.sql` for the MVP schema.

Important tables:

| Table | Purpose |
| --- | --- |
| `pricing_products` | User-owned pricing assets and cost basis |
| `pricing_market_snapshots` | Immutable raw/normalized marketplace observations |
| `pricing_competitors` | Time-series competitor price and quality facts |
| `pricing_sales_history` | Price exposure, units, revenue, sessions, conversion, rank |
| `pricing_trend_signals` | Social, search, marketplace, and internal demand signals |
| `pricing_recommendations` | Generated recommendations with candidate frontier and reasoning |
| `pricing_experiments` | A/B price tests and attribution windows |
| `pricing_events` | Alerts, anomalies, repricing actions, model feedback events |

Enterprise upgrade path:

| Need | Upgrade |
| --- | --- |
| High-cardinality time series | TimescaleDB or ClickHouse |
| Long-term raw snapshots | Cloudflare R2 partitioned by marketplace/date/product |
| Embedding similarity | `pgvector` first, dedicated vector DB later |
| Feature reuse | Feast or custom feature registry |
| Event streaming | Kafka/Redpanda when BullMQ is no longer enough |

## Pricing Algorithm

The first production version should be a hybrid engine:

1. Deterministic guardrails: marketplace fee model, production cost, shipping cost, minimum margin, maximum price, daily change limits.
2. Candidate generator: create psychological price points across floor-to-ceiling range.
3. Feature scoring: demand, defensibility, trend momentum, saturation, review moat, rank quality, elasticity risk, competitor percentile.
4. Simulation: estimate units, revenue, profit, conversion, rank velocity, and long-term ranking potential for each candidate.
5. Objective scorer: re-weight candidates for maximum profit, sales velocity, conversion rate, ranking growth, or balanced mode.
6. Risk engine: detect undercuts, race-to-bottom pressure, premium opportunities, demand spikes, anomalies, and margin floor conflicts.
7. AI explanation: turn feature deltas into an audit-friendly recommendation.

The current TypeScript implementation lives in `lib/pricing/engine.ts` and is intentionally deterministic so it can be tested, audited, and used before the ML stack matures.

## ML Roadmap

| Stage | Model | What It Learns |
| --- | --- | --- |
| MVP | Heuristic + regression | Price-to-unit response, conversion sensitivity, basic elasticity |
| Stage 2 | Gradient boosted regression | Expected profit, units, conversion, rank movement per candidate price |
| Stage 3 | Time-series forecasting | Demand by niche, holiday ramp curves, event decay, trend exhaustion |
| Stage 4 | Anomaly detection | Scraper errors, bot-like competitor movement, sudden rank shocks, demand spikes |
| Stage 5 | Contextual bandits | Safe price exploration by marketplace, niche, product type, and seller risk tolerance |
| Stage 6 | Reinforcement learning | Long-horizon policy that optimizes profit plus ranking value under marketplace constraints |
| Stage 7 | Recommendation system | Similar-product transfer learning for cold-start pricing and niche expansion |

Do not start with full reinforcement learning. Start with logged experiments and counterfactual estimates so the system has trustworthy reward data.

## Queue Design

The queue definitions are codified in `lib/pricing/queue-design.ts`.

| Queue | Trigger |
| --- | --- |
| `marketplace-snapshot` | Cron, user adds product, competitor movement, high-volatility tier |
| `competitor-normalization` | After snapshot ingestion |
| `trend-signal-ingestion` | Hourly/daily trend refresh |
| `pricing-recommendation` | Snapshot change, trend spike, cost change, scheduled repricing |
| `experiment-attribution` | Nightly and after experiment windows close |
| `alert-dispatch` | Event-driven |

MVP BullMQ deployment:

```ts
new Worker("pricing-recommendation", async (job) => {
  const input = await loadPricingInput(job.data.productId);
  const recommendation = generatePricingRecommendation(input);
  await persistRecommendation(job.data.userId, recommendation);
});
```

## API Surface

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/pricing/recommendation` | POST | Generate a candidate frontier and recommendation |
| `/api/pricing/products` | GET/POST | List or create monitored products |
| `/api/pricing/products/[id]/snapshots` | GET | Historical snapshots |
| `/api/pricing/products/[id]/competitors` | GET | Competitor table and movement |
| `/api/pricing/products/[id]/experiments` | GET/POST | Price A/B tests |
| `/api/pricing/products/[id]/autopilot` | PATCH | Enable, pause, or constrain repricing |
| `/api/pricing/alerts` | GET | Live alert feed |

## Dashboard

The first dashboard route is `/dashboard/pricing-intelligence`.

Required panels:

| Panel | Purpose |
| --- | --- |
| Price frontier | Candidate prices ranked by objective score |
| Pricing heatmap | Marketplace/niche profitability map |
| Competitor table | Landed price, review moat, rating, BSR, substitute score, price movement |
| Trend chart | Velocity, acceleration, seasonality, holiday/event proximity |
| Profit simulator | Units, revenue, fees, margin, expected profit |
| Live alerts | Undercuts, race-to-bottom, premium opportunity, demand spike, anomalies |
| Experiment center | Control/variant prices, sample size, success metric, attribution |
| AI reasoning | Clear explanation of why a price should move |

## Marketplace Strategy

Normalize all marketplaces into a common `landed price` and `market quality` model, but keep marketplace profiles separate.

Examples:

| Marketplace | Pricing Sensitivity |
| --- | --- |
| Etsy | Reviews, shipping, personalization, discount anchoring, seasonal gifts |
| Amazon Merch | BSR/rank velocity, conversion, niche saturation, Prime-style expectations |
| Redbubble/TeePublic | Promo cycles and race-to-bottom risk |
| Shopify/Fourthwall | Brand value, paid traffic economics, owned audience conversion |
| eBay | Landed price and seller trust |
| Fine Art America/Society6 | Premium perception and style-specific willingness to pay |

## Proprietary Data Moats

1. Price exposure graph: every price shown, when it changed, and what happened after.
2. Competitor movement ledger: seller-level pricing behavior and undercut signatures over time.
3. Niche elasticity map: product type, niche, marketplace, season, and geography response curves.
4. Rank-response dataset: how price changes affect marketplace rank after lag windows.
5. Creative-price interaction data: design style, color, review moat, perceived value, and price tolerance.
6. Holiday ramp library: event-specific demand curves and decay patterns.
7. Cross-market arbitrage map: products underpriced on one marketplace but premium-priced elsewhere.
8. Marketplace policy memory: rate limits, listing constraints, promo mechanics, and repricing risk.

## MVP Path

Cheapest useful MVP:

1. Ship manual product input plus `/api/pricing/recommendation`.
2. Store products, competitors, sales history, trend signals, and recommendations in Supabase.
3. Use Playwright only for user-selected products and top 20 competitors per niche.
4. Store raw snapshots in R2 for replay and model training.
5. Use deterministic pricing first; add Gemini/OpenAI only for explanations and competitor classification.
6. Build dashboard panels for price frontier, alerts, competitor table, and historical price graph.
7. Add price experiments before autopilot repricing.

## Enterprise Path

Enterprise architecture:

1. Multi-region scraping workers with proxy pools and marketplace-specific throttles.
2. Kafka/Redpanda event stream for snapshots, recommendations, experiments, and alerts.
3. ClickHouse for high-volume time-series analytics.
4. Feature store with daily and intraday rolling features.
5. Model registry with champion/challenger pricing models.
6. Policy engine for compliance, margin floors, marketplace rules, and user risk tolerance.
7. Human approval queues for high-impact repricing.
8. Full audit log for every price decision and AI explanation.
