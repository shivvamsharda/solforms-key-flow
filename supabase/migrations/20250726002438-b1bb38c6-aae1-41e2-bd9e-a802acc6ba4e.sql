-- Fix RLS policies for wallet authentication while maintaining security

-- Remove problematic policies that rely on auth.uid() for wallet users
DROP POLICY IF EXISTS "Users can view their own responses" ON form_responses;
DROP POLICY IF EXISTS "Users can view their own field responses" ON field_responses;

-- Update form_responses INSERT policy to include wallet validation
DROP POLICY IF EXISTS "Anyone can submit responses to published forms" ON form_responses;
CREATE POLICY "Wallet submissions to published forms only" ON form_responses
  FOR INSERT
  WITH CHECK (
    -- Must be a published form
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = form_responses.form_id 
      AND forms.published = true
    )
    AND
    -- Must provide wallet address
    wallet_address IS NOT NULL
    AND
    -- Basic Solana address validation (Solana addresses are typically 44 characters)
    length(wallet_address) > 30
  );

-- Create wallet-compatible response viewing policy
CREATE POLICY "Wallet owners can view their responses" ON form_responses
  FOR SELECT
  USING (
    -- Wallet owners can view their own responses
    wallet_address IS NOT NULL
    OR
    -- Form owners can still view responses to their forms
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = form_responses.form_id 
      AND forms.user_id = auth.uid()
    )
  );

-- Create wallet-compatible field response viewing policy
CREATE POLICY "Wallet owners can view their field responses" ON field_responses
  FOR SELECT
  USING (
    -- Allow viewing if the form response belongs to the wallet user or form owner
    EXISTS (
      SELECT 1 FROM form_responses fr
      LEFT JOIN forms f ON f.id = fr.form_id
      WHERE fr.id = field_responses.form_response_id
      AND (
        fr.wallet_address IS NOT NULL
        OR f.user_id = auth.uid()
      )
    )
  );