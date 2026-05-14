export type TrendScore = "Very High" | "High" | "Medium" | "Low";
export type CompetitionLevel = "Low" | "Medium" | "High" | "Crowded";

export type TrendType = "Evergreen" | "Seasonal";

export interface TrendResult {
  id: string;
  niche: string;
  score: TrendScore;
  competition: CompetitionLevel;
  type: TrendType;
  platforms: string[];
  productIdeas: string[];
  etsyKeywords: string[];
  tiktokIdeas: string[];
  recommendedStyles: string[];
  reasoning: string;
}

export interface TrendSave {
  id: string;
  user_id: string;
  niche: string;
  keywords: string[];
  created_at: string;
}
