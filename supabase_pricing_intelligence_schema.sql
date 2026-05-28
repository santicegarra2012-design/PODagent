-- Dynamic pricing intelligence schema for POD marketplaces.
-- Run in Supabase SQL Editor after the core user/auth schema is configured.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS pricing_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  marketplace TEXT NOT NULL,
  external_product_id TEXT,
  title TEXT NOT NULL,
  product_type TEXT NOT NULL,
  niche TEXT NOT NULL,
  fulfillment_provider TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  current_price NUMERIC(10, 2) NOT NULL,
  production_cost NUMERIC(10, 2) NOT NULL,
  shipping_cost NUMERIC(10, 2) NOT NULL,
  min_margin_percent NUMERIC(5, 2) DEFAULT 30,
  pricing_objective TEXT NOT NULL DEFAULT 'balanced',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pricing_market_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES pricing_products(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  marketplace TEXT NOT NULL,
  snapshot_type TEXT NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_url TEXT,
  raw_payload_path TEXT,
  normalized JSONB NOT NULL DEFAULT '{}',
  quality_score NUMERIC(4, 3) NOT NULL DEFAULT 0.75
);

CREATE TABLE IF NOT EXISTS pricing_competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES pricing_products(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  marketplace TEXT NOT NULL,
  competitor_fingerprint TEXT NOT NULL,
  title TEXT NOT NULL,
  seller_name TEXT,
  price NUMERIC(10, 2) NOT NULL,
  shipping_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  bsr INT,
  rank_percentile NUMERIC(5, 4),
  is_direct_substitute BOOLEAN NOT NULL DEFAULT false,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  attributes JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS pricing_sales_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES pricing_products(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  units INT NOT NULL DEFAULT 0,
  revenue NUMERIC(12, 2) NOT NULL DEFAULT 0,
  profit NUMERIC(12, 2) NOT NULL DEFAULT 0,
  sessions INT NOT NULL DEFAULT 0,
  conversion_rate NUMERIC(6, 5) NOT NULL DEFAULT 0,
  marketplace_rank INT,
  UNIQUE(product_id, date, price)
);

CREATE TABLE IF NOT EXISTS pricing_trend_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES pricing_products(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  source TEXT NOT NULL,
  label TEXT NOT NULL,
  score NUMERIC(4, 3) NOT NULL,
  velocity NUMERIC(4, 3) NOT NULL,
  acceleration NUMERIC(4, 3) NOT NULL DEFAULT 0,
  confidence NUMERIC(4, 3) NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS pricing_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES pricing_products(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  marketplace TEXT NOT NULL,
  objective TEXT NOT NULL,
  current_price NUMERIC(10, 2) NOT NULL,
  recommended_price NUMERIC(10, 2) NOT NULL,
  confidence_score NUMERIC(4, 3) NOT NULL,
  expected_profit NUMERIC(12, 2) NOT NULL,
  expected_units NUMERIC(10, 2) NOT NULL,
  expected_margin_percent NUMERIC(5, 2) NOT NULL,
  floor_price NUMERIC(10, 2) NOT NULL,
  ceiling_price NUMERIC(10, 2) NOT NULL,
  feature_scores JSONB NOT NULL,
  candidates JSONB NOT NULL,
  reasoning JSONB NOT NULL,
  alerts JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'suggested',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pricing_experiments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES pricing_products(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES pricing_recommendations(id) ON DELETE SET NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  control_price NUMERIC(10, 2) NOT NULL,
  variant_price NUMERIC(10, 2) NOT NULL,
  allocation_percent INT NOT NULL DEFAULT 20,
  success_metric TEXT NOT NULL,
  minimum_sample_sessions INT NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  result JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS pricing_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES pricing_products(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pricing_products_user_marketplace_idx ON pricing_products(user_id, marketplace);
CREATE INDEX IF NOT EXISTS pricing_competitors_product_observed_idx ON pricing_competitors(product_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS pricing_sales_history_product_date_idx ON pricing_sales_history(product_id, date DESC);
CREATE INDEX IF NOT EXISTS pricing_trend_signals_product_observed_idx ON pricing_trend_signals(product_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS pricing_recommendations_product_generated_idx ON pricing_recommendations(product_id, generated_at DESC);
CREATE INDEX IF NOT EXISTS pricing_events_user_created_idx ON pricing_events(user_id, created_at DESC);

ALTER TABLE pricing_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_market_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_sales_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_trend_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their pricing products" ON pricing_products
FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users manage their pricing snapshots" ON pricing_market_snapshots
FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users manage their pricing competitors" ON pricing_competitors
FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users manage their pricing sales history" ON pricing_sales_history
FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users manage their pricing trend signals" ON pricing_trend_signals
FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users manage their pricing recommendations" ON pricing_recommendations
FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users manage their pricing experiments" ON pricing_experiments
FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users manage their pricing events" ON pricing_events
FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
