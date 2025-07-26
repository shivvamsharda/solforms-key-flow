-- Fix RLS policies to allow wallet-authenticated users to submit responses

-- Drop existing restrictive policies that require auth.uid()
DROP POLICY IF EXISTS "Anyone can create field responses for published forms" ON field_responses;

-- Create new wallet-compatible policy for field responses
CREATE POLICY "Allow field responses for published forms" ON field_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM form_responses fr
      JOIN forms f ON f.id = fr.form_id
      WHERE fr.id = field_responses.form_response_id 
      AND f.published = true
    )
  );

-- Ensure form_analytics policy is also wallet-compatible
DROP POLICY IF EXISTS "Anyone can create analytics events" ON form_analytics;

CREATE POLICY "Allow analytics for published forms" ON form_analytics
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = form_analytics.form_id 
      AND forms.published = true
    )
  );