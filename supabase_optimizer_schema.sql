-- SQL to create the optimized_listings table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS optimized_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  original JSONB NOT NULL,
  optimized JSONB NOT NULL,
  scores JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE optimized_listings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own optimizations
CREATE POLICY "Users can view their own optimized listings" 
ON optimized_listings FOR SELECT 
USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own optimizations
CREATE POLICY "Users can insert their own optimized listings" 
ON optimized_listings FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own optimizations
CREATE POLICY "Users can delete their own optimized listings" 
ON optimized_listings FOR DELETE 
USING (auth.uid()::text = user_id);
