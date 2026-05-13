-- SQL to create the image_generations table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS image_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  style TEXT,
  aspect_ratio TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE image_generations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own generations
CREATE POLICY "Users can view their own image generations" 
ON image_generations FOR SELECT 
USING (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own generations
CREATE POLICY "Users can delete their own image generations" 
ON image_generations FOR DELETE 
USING (auth.uid()::text = user_id);

-- Note: Insert policy is handled by the service role in our API, 
-- but if you want to allow client-side inserts, add an INSERT policy.
