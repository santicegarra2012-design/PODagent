import { getMarketplaceProfile } from "@/lib/pricing/marketplaces";
import type {
  CompetitorPricePoint,
  PricingAlert,
  PricingCandidate,
  PricingProductInput,
  PricingRecommendation,
} from "@/lib/pricing/types";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const percentile = (values: number[], target: number) => {
  if (values.length === 0) return 0.5;
  const lower = values.filter((value) => value <= target).length;
  return lower / values.length;
};

const average = (values: number[]) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const standardDeviation = (values: number[]) => {
  if (values.length < 2) return 0;
  const mean = average(values);
  return Math.sqrt(average(values.map((value) => (value - mean) ** 2)));
};

function psychologicalPrice(rawPrice: number, ending: number) {
  if (ending === 0) return Math.round(rawPrice);
  const whole = Math.floor(rawPrice);
  const candidate = whole + ending;
  return roundCurrency(candidate > rawPrice + 0.35 ? candidate - 1 : candidate);
}

function netProfit(price: number, input: PricingProductInput) {
  const marketplace = getMarketplaceProfile(input.marketplace);
  const variableFees = price * (marketplace.commissionRate + marketplace.paymentFeeRate);
  return price - input.productionCost - input.shippingCost - variableFees - marketplace.paymentFixedFee;
}

function estimateBaselineUnits(input: PricingProductInput) {
  const recent = input.historicalSales.slice(-30);
  const historicalUnits = average(recent.map((point) => point.units));
  const sessions = average(recent.map((point) => point.sessions));
  const conversionUnits = sessions * input.conversionLikelihood;
  const trendLift = 1 + input.demandSpikeScore * 0.7 + average(input.trendSignals.map((signal) => signal.velocity)) * 0.2;
  return Math.max(1, (historicalUnits || conversionUnits || 4) * trendLift);
}

function featureScores(input: PricingProductInput) {
  const competitorPrices = input.competitorPrices.map((item) => item.price + item.shippingPrice);
  const currentLandedPrice = input.currentPrice + input.shippingCost;
  const premiumPercentile = percentile(competitorPrices, currentLandedPrice);
  const trendMomentum = clamp(average(input.trendSignals.map((signal) => signal.score * signal.velocity)), 0, 1);
  const reviewMoat = clamp(Math.log10(input.reviewCount + 1) / 4 + (input.rating - 3.5) / 3, 0, 1);
  const rankQuality = input.rankPercentile ? 1 - input.rankPercentile : input.bsr ? clamp(1 - Math.log10(input.bsr) / 7, 0, 1) : 0.5;
  const demand = clamp(
    input.seasonalityScore * 0.18 +
      input.geographicDemandScore * 0.16 +
      input.demandSpikeScore * 0.2 +
      trendMomentum * 0.2 +
      input.colorPopularityScore * 0.08 +
      input.stylePopularityScore * 0.08 +
      input.urgencyScarcityScore * 0.1,
    0,
    1,
  );
  const defensibility = clamp(
    reviewMoat * 0.26 +
      rankQuality * 0.22 +
      input.perceivedValueScore * 0.24 +
      (1 - input.saturationScore) * 0.16 +
      input.conversionLikelihood * 0.12,
    0,
    1,
  );

  return {
    demand,
    defensibility,
    reviewMoat,
    rankQuality,
    trendMomentum,
    saturation: input.saturationScore,
    competitorPremiumPercentile: premiumPercentile,
    elasticityRisk: clamp(Math.abs(input.estimatedElasticity) / 3, 0, 1),
    perceivedValue: input.perceivedValueScore,
  };
}

function scoreCandidate(candidatePrice: number, input: PricingProductInput, scores: Record<string, number>): PricingCandidate {
  const marketplace = getMarketplaceProfile(input.marketplace);
  const baselineUnits = estimateBaselineUnits(input);
  const priceChange = (candidatePrice - input.currentPrice) / Math.max(input.currentPrice, 1);
  const elasticity = input.estimatedElasticity || -1.2;
  const demandMultiplier = clamp(1 + scores.demand * 0.7 + scores.defensibility * 0.35 - input.saturationScore * 0.35, 0.2, 2.6);
  const elasticityMultiplier = clamp(1 + elasticity * priceChange, 0.18, 2.8);
  const competitorMedian = average(input.competitorPrices.map((item) => item.price + item.shippingPrice)) || input.currentPrice;
  const competitorPenalty = candidatePrice > competitorMedian ? clamp((candidatePrice - competitorMedian) / competitorMedian, 0, 0.35) : 0;
  const expectedUnits = baselineUnits * demandMultiplier * elasticityMultiplier * (1 - competitorPenalty * marketplace.rankingSensitivity);
  const profit = netProfit(candidatePrice, input);
  const expectedProfit = expectedUnits * profit;
  const expectedRevenue = expectedUnits * candidatePrice;
  const expectedMarginPercent = candidatePrice > 0 ? (profit / candidatePrice) * 100 : 0;
  const conversionScore = clamp(input.conversionLikelihood + scores.demand * 0.25 - Math.max(priceChange, 0) * 0.8, 0, 1);
  const velocityScore = clamp(expectedUnits / Math.max(baselineUnits * 2, 1), 0, 1);
  const rankingScore = clamp(velocityScore * 0.42 + conversionScore * 0.28 + scores.rankQuality * 0.2 + scores.reviewMoat * 0.1, 0, 1);
  const profitScore = clamp(expectedProfit / Math.max(baselineUnits * Math.max(netProfit(input.currentPrice, input), 1), 1), 0, 2) / 2;

  const objectiveWeights = {
    maximum_profit: [0.62, 0.12, 0.1, 0.16],
    sales_velocity: [0.18, 0.5, 0.18, 0.14],
    conversion_rate: [0.15, 0.16, 0.55, 0.14],
    ranking_growth: [0.18, 0.25, 0.17, 0.4],
    balanced: [0.34, 0.24, 0.2, 0.22],
  }[input.objective];

  const objectiveScore =
    profitScore * objectiveWeights[0] +
    velocityScore * objectiveWeights[1] +
    conversionScore * objectiveWeights[2] +
    rankingScore * objectiveWeights[3];

  return {
    price: roundCurrency(candidatePrice),
    expectedUnits: roundCurrency(expectedUnits),
    expectedRevenue: roundCurrency(expectedRevenue),
    expectedProfit: roundCurrency(expectedProfit),
    expectedMarginPercent: roundCurrency(expectedMarginPercent),
    conversionScore: roundCurrency(conversionScore),
    rankingScore: roundCurrency(rankingScore),
    velocityScore: roundCurrency(velocityScore),
    objectiveScore: roundCurrency(objectiveScore),
  };
}

function buildAlerts(input: PricingProductInput, selected: PricingCandidate, directCompetitors: CompetitorPricePoint[]) {
  const alerts: PricingAlert[] = [];
  const directPrices = directCompetitors.map((item) => item.price + item.shippingPrice);
  const cheapestDirect = Math.min(...directPrices);
  const medianDirect = average(directPrices);
  const dispersion = standardDeviation(directPrices) / Math.max(medianDirect, 1);

  if (Number.isFinite(cheapestDirect) && cheapestDirect < input.currentPrice * 0.92) {
    alerts.push({
      type: "competitor_undercut",
      severity: cheapestDirect < input.currentPrice * 0.8 ? "high" : "medium",
      title: "Competitor undercut detected",
      detail: `A close substitute is priced at ${roundCurrency(cheapestDirect)}, materially below your current landed price.`,
    });
  }

  if (dispersion < 0.08 && directPrices.length >= 5 && input.saturationScore > 0.68) {
    alerts.push({
      type: "race_to_bottom",
      severity: "high",
      title: "Race-to-bottom pressure",
      detail: "Direct competitors are tightly clustered with high saturation, so avoid matching every downward move.",
    });
  }

  if (input.perceivedValueScore > 0.72 && input.rating >= 4.6 && input.reviewCount > 50 && selected.price > medianDirect) {
    alerts.push({
      type: "premium_opportunity",
      severity: "medium",
      title: "Premium pricing opportunity",
      detail: "Review quality, perceived value, and demand signals support a price above the competitor median.",
    });
  }

  if (selected.expectedMarginPercent < (input.minMarginPercent ?? getMarketplaceProfile(input.marketplace).defaultMinMarginPercent)) {
    alerts.push({
      type: "margin_floor",
      severity: "critical",
      title: "Margin safety floor active",
      detail: "The optimizer rejected lower prices because they would compromise contribution margin.",
    });
  }

  if (input.demandSpikeScore > 0.75 || input.trendSignals.some((signal) => signal.velocity > 0.8)) {
    alerts.push({
      type: "demand_spike",
      severity: "medium",
      title: "Demand spike window",
      detail: "Trend velocity indicates a short repricing window where premium capture may outperform unit volume.",
    });
  }

  return alerts;
}

function buildReasoning(input: PricingProductInput, selected: PricingCandidate, scores: Record<string, number>) {
  const marketplace = getMarketplaceProfile(input.marketplace);
  const direction = selected.price > input.currentPrice ? "increase" : selected.price < input.currentPrice ? "decrease" : "hold";

  return [
    `Recommendation is to ${direction} price for ${marketplace.displayName} using a ${input.objective.replaceAll("_", " ")} objective.`,
    `Demand score ${roundCurrency(scores.demand)} blends seasonality, trend velocity, geographic demand, scarcity, style/color popularity, and current spike signals.`,
    `Defensibility score ${roundCurrency(scores.defensibility)} reflects review moat, rating quality, rank strength, perceived value, conversion likelihood, and saturation risk.`,
    `Expected margin is ${selected.expectedMarginPercent}% after production, shipping, marketplace commission, and payment fees.`,
    `Candidate prices below the margin floor or above conversion-safe ceilings are excluded before objective scoring.`,
  ];
}

export function generatePricingRecommendation(input: PricingProductInput): PricingRecommendation {
  const marketplace = getMarketplaceProfile(input.marketplace);
  const scores = featureScores(input);
  const minMarginPercent = input.minMarginPercent ?? marketplace.defaultMinMarginPercent;
  const directCompetitors = input.competitorPrices.filter((item) => item.isDirectSubstitute);
  const directPrices = directCompetitors.map((item) => item.price + item.shippingPrice);
  const competitorMedian = average(directPrices) || input.currentPrice;
  const competitorSpread = standardDeviation(directPrices) || input.currentPrice * 0.12;
  const costBase = input.productionCost + input.shippingCost + marketplace.paymentFixedFee;
  const feeRate = marketplace.commissionRate + marketplace.paymentFeeRate;
  const floorPrice = roundCurrency((costBase / Math.max(1 - feeRate - minMarginPercent / 100, 0.05)) * 1.01);
  const strategicPremium = 1 + scores.demand * 0.18 + scores.defensibility * 0.14 + input.urgencyScarcityScore * 0.08;
  const defaultCeiling = Math.max(input.currentPrice * 1.45, competitorMedian + competitorSpread * (1.4 + scores.defensibility));
  const ceilingPrice = roundCurrency(input.maxPrice ?? defaultCeiling * strategicPremium);
  const lowerBound = Math.max(input.minPrice ?? 0, floorPrice);
  const upperBound = Math.max(lowerBound + 1, ceilingPrice);
  const stepCount = 18;

  const candidates = Array.from({ length: stepCount + 1 }, (_, index) => {
    const raw = lowerBound + ((upperBound - lowerBound) / stepCount) * index;
    return scoreCandidate(psychologicalPrice(raw, marketplace.priceEnding), input, scores);
  })
    .filter((candidate, index, all) => all.findIndex((item) => item.price === candidate.price) === index)
    .sort((left, right) => right.objectiveScore - left.objectiveScore);

  const selected = candidates[0] ?? scoreCandidate(psychologicalPrice(input.currentPrice, marketplace.priceEnding), input, scores);
  const confidenceScore = clamp(
    0.22 +
      Math.min(input.historicalSales.length / 90, 1) * 0.24 +
      Math.min(input.competitorPrices.length / 20, 1) * 0.18 +
      average(input.trendSignals.map((signal) => signal.confidence)) * 0.16 +
      (1 - scores.elasticityRisk * 0.25) * 0.2,
    0,
    0.98,
  );

  return {
    productId: input.productId,
    marketplace: input.marketplace,
    recommendedPrice: selected.price,
    currentPrice: input.currentPrice,
    priceDelta: roundCurrency(selected.price - input.currentPrice),
    confidenceScore: roundCurrency(confidenceScore),
    objective: input.objective,
    expectedProfit: selected.expectedProfit,
    expectedUnits: selected.expectedUnits,
    expectedMarginPercent: selected.expectedMarginPercent,
    floorPrice,
    ceilingPrice,
    candidates: candidates.slice(0, 8),
    alerts: buildAlerts(input, selected, directCompetitors),
    featureScores: Object.fromEntries(Object.entries(scores).map(([key, value]) => [key, roundCurrency(value)])),
    reasoning: buildReasoning(input, selected, scores),
    experiments: [
      {
        name: "Profit frontier test",
        hypothesis: "A premium psychological price can increase profit per session without breaking rank velocity.",
        controlPrice: input.currentPrice,
        variantPrice: selected.price,
        allocationPercent: 20,
        successMetric: "profit_per_session",
        minimumSampleSessions: 1200,
      },
      {
        name: "Velocity defense test",
        hypothesis: "A lower anchor price improves conversion rate enough to lift long-term marketplace rank.",
        controlPrice: input.currentPrice,
        variantPrice: psychologicalPrice(Math.max(floorPrice, selected.price * 0.94), marketplace.priceEnding),
        allocationPercent: 15,
        successMetric: "rank_gain",
        minimumSampleSessions: 1500,
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}
