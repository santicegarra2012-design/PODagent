export type RiskLevel = "Safe" | "Medium Risk" | "High Risk";

export interface TrademarkCheckResult {
  riskLevel: RiskLevel;
  explanation: string;
  flaggedTerms: string[];
  safeAlternatives: string[];
  complianceTips: string[];
}

export interface TrademarkCheckRecord {
  id: string;
  user_id: string;
  keyword: string;
  risk_level: RiskLevel;
  response: TrademarkCheckResult;
  created_at: string;
}
