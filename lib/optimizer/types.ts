export interface ListingData {
  title: string;
  tags: string[];
  description: string;
  platform: string;
}

export interface OptimizationResults {
  seoScore: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  missingKeywords: string[];
  conversionTips: string[];
  trademarkWarnings: string[];
  improvedTitle: string;
  improvedTags: string[];
  improvedDescription: string;
}

export interface OptimizedListingRecord {
  id: string;
  user_id: string;
  original: ListingData;
  optimized: OptimizationResults;
  scores: { seo: number; readability: number };
  created_at: string;
}
