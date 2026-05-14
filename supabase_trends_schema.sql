-- SQL to create the trend_saves table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS trend_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  niche TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE trend_saves ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own saved trends
CREATE POLICY "Users can view their own trend saves" 
ON trend_saves FOR SELECT 
USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own trend saves
CREATE POLICY "Users can insert their own trend saves" 
ON trend_saves FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own trend saves
CREATE POLICY "Users can delete their own trend saves" 
ON trend_saves FOR DELETE 
USING (auth.uid()::text = user_id);
