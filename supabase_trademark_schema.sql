-- SQL to create the trademark_checks table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS trademark_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  keyword TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  response JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE trademark_checks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own trademark checks
CREATE POLICY "Users can view their own trademark checks" 
ON trademark_checks FOR SELECT 
USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own trademark checks
CREATE POLICY "Users can insert their own trademark checks" 
ON trademark_checks FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own trademark checks
CREATE POLICY "Users can delete their own trademark checks" 
ON trademark_checks FOR DELETE 
USING (auth.uid()::text = user_id);
