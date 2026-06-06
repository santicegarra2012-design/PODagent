export type Profile = {
  id: string;
  user_id: string;
  name: string | null;
  goal: string | null;
  experience_level: string | null;
  preferred_niches: string[] | null;
  created_at: string;
};

export type Memory = {
  id: string;
  user_id: string;
  content: string;
  importance: number; // 1-10
  category: "goal" | "niche" | "preference" | "strategy" | "general" | string;
  created_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  due_date: string | null;
  created_at: string;
};

export type Opportunity = {
  id: string;
  niche: string;
  trend_score: number; // 0-100
  competition_score: number; // 0-100
  opportunity_score: number; // 0-100
  source: string | null;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  message: string;
  created_at: string;
};

export type Design = {
  id: string;
  user_id: string;
  niche: string;
  title: string;
  prompt: string;
  image_url: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
};
