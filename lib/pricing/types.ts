export const POD_MARKETPLACES = [
  "amazon_merch",
  "etsy",
  "printify",
  "printful",
  "teepublic",
  "redbubble",
  "shopify",
  "ebay",
  "spreadshirt",
  "spring",
  "zazzle",
  "society6",
  "fine_art_america",
  "gelato",
  "fourthwall",
] as const;

export type PodMarketplace = (typeof POD_MARKETPLACES)[number];

export type PricingObjective =
  | "maximum_profit"
  | "sales_velocity"
  | "conversion_rate"
  | "ranking_growth"
  | "balanced";

export type FulfillmentProvider =
  | "amazon_merch"
  | "printify"
  | "printful"
  | "gelato"
  | "spring"
  | "fourthwall"
  | "manual"
  | "other";

export interface CompetitorPricePoint {
  marketplace: PodMarketplace;
  sellerId?: string;
  title: string;
  price: number;
  shippingPrice: number;
  reviewCount: number;
  rating: number;
  bsr?: number;
  rankPercentile?: number;
  observedAt: string;
  isDirectSubstitute: boolean;
}

export interface HistoricalSalesPoint {
  date: string;
  price: number;
  units: number;
  revenue: number;
  sessions: number;
  conversionRate: number;
  marketplaceRank?: number;
}

export interface TrendSignal {
  source: "marketplace" | "google_trends" | "tiktok" | "pinterest" | "instagram" | "internal_search" | "ads";
  label: string;
  score: number;
  velocity: number;
  confidence: number;
  observedAt: string;
}

export interface PricingProductInput {
  productId?: string;
  marketplace: PodMarketplace;
  productType: string;
  niche: string;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
  currentPrice: number;
  productionCost: number;
  shippingCost: number;
  fulfillmentProvider: FulfillmentProvider;
  reviewCount: number;
  rating: number;
  bsr?: number;
  rankPercentile?: number;
  saturationScore: number;
  colorPopularityScore: number;
  stylePopularityScore: number;
  geographicDemandScore: number;
  seasonalityScore: number;
  urgencyScarcityScore: number;
  perceivedValueScore: number;
  conversionLikelihood: number;
  estimatedElasticity: number;
  demandSpikeScore: number;
  historicalSales: HistoricalSalesPoint[];
  competitorPrices: CompetitorPricePoint[];
  trendSignals: TrendSignal[];
  activeHolidayEvents: string[];
  objective: PricingObjective;
  minMarginPercent?: number;
  maxPrice?: number;
  minPrice?: number;
}

export interface PricingCandidate {
  price: number;
  expectedUnits: number;
  expectedRevenue: number;
  expectedProfit: number;
  expectedMarginPercent: number;
  conversionScore: number;
  rankingScore: number;
  velocityScore: number;
  objectiveScore: number;
}

export interface PricingAlert {
  type:
    | "competitor_undercut"
    | "race_to_bottom"
    | "premium_opportunity"
    | "margin_floor"
    | "demand_spike"
    | "anomaly";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  detail: string;
}

export interface PricingRecommendation {
  productId?: string;
  marketplace: PodMarketplace;
  recommendedPrice: number;
  currentPrice: number;
  priceDelta: number;
  confidenceScore: number;
  objective: PricingObjective;
  expectedProfit: number;
  expectedUnits: number;
  expectedMarginPercent: number;
  floorPrice: number;
  ceilingPrice: number;
  candidates: PricingCandidate[];
  alerts: PricingAlert[];
  featureScores: Record<string, number>;
  reasoning: string[];
  experiments: PricingExperimentPlan[];
  generatedAt: string;
}

export interface PricingExperimentPlan {
  name: string;
  hypothesis: string;
  controlPrice: number;
  variantPrice: number;
  allocationPercent: number;
  successMetric: "profit_per_session" | "conversion_rate" | "units_sold" | "rank_gain";
  minimumSampleSessions: number;
}

export interface QueueDefinition {
  name: string;
  purpose: string;
  concurrency: number;
  retryLimit: number;
  cadence: string;
}
