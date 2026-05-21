export type DashboardSummary = {
  counts: {
    projects: number;
    trendSaves: number;
    imageGenerations: number;
    trademarkChecks: number;
  };
  recentProjects: Array<{
    id: string;
    niche: string;
    title: string;
    tags: string[];
    created_at: string;
  }>;
  recentTrendSaves: Array<{
    id: string;
    niche: string;
    keywords: string[];
    created_at: string;
  }>;
  recentTrademarkChecks: Array<{
    id: string;
    keyword: string;
    risk_level: string;
    created_at: string;
  }>;
  recentImageGenerations: Array<{
    id: string;
    prompt: string;
    image_url: string;
    style: string | null;
    platform: string | null;
    created_at: string;
  }>;
};
