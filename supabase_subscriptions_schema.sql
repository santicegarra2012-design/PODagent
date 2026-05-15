-- SQL to create the subscriptions table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  status TEXT DEFAULT 'inactive',
  plan TEXT DEFAULT 'free',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own subscription
CREATE POLICY "Users can view their own subscription" 
ON subscriptions FOR SELECT 
USING (auth.uid()::text = user_id);

-- Create policy for service role to manage all subscriptions
CREATE POLICY "Service role can manage all subscriptions"
ON subscriptions FOR ALL
USING (true)
WITH CHECK (true);

-- Function to handle user creation and initial subscription state (if using Supabase Auth)
-- Since we use Clerk, we will handle the initial record in our webhook or checkout flow.
