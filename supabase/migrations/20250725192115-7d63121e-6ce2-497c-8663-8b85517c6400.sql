-- Enhance forms table with missing columns
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS form_schema jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS thank_you_message text DEFAULT 'Thank you for your response!';
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS response_limit integer DEFAULT NULL;
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone DEFAULT NULL;

-- Create token_balances table for SPL token caching
CREATE TABLE IF NOT EXISTS public.token_balances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text NOT NULL,
  token_mint text NOT NULL,
  balance bigint NOT NULL DEFAULT 0,
  checked_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, token_mint)
);

-- Create form_analytics table for tracking
CREATE TABLE IF NOT EXISTS public.form_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id uuid NOT NULL,
  event_type text NOT NULL, -- 'view', 'start', 'complete', 'abandon'
  wallet_address text,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create form_shares table for tracking sharing methods
CREATE TABLE IF NOT EXISTS public.form_shares (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id uuid NOT NULL,
  share_type text NOT NULL, -- 'link', 'qr', 'embed'
  share_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone
);

-- Enable RLS on new tables
ALTER TABLE public.token_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_shares ENABLE ROW LEVEL SECURITY;

-- RLS policies for token_balances
CREATE POLICY "Users can view their own token balances" 
ON public.token_balances 
FOR SELECT 
USING (auth.uid()::text = wallet_address);

CREATE POLICY "System can insert token balances" 
ON public.token_balances 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update token balances" 
ON public.token_balances 
FOR UPDATE 
USING (true);

-- RLS policies for form_analytics
CREATE POLICY "Form owners can view analytics for their forms" 
ON public.form_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM forms 
  WHERE forms.id = form_analytics.form_id 
  AND forms.user_id = auth.uid()
));

CREATE POLICY "Anyone can create analytics events" 
ON public.form_analytics 
FOR INSERT 
WITH CHECK (true);

-- RLS policies for form_shares
CREATE POLICY "Form owners can manage shares for their forms" 
ON public.form_shares 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM forms 
  WHERE forms.id = form_shares.form_id 
  AND forms.user_id = auth.uid()
));

CREATE POLICY "Anyone can view active shares" 
ON public.form_shares 
FOR SELECT 
USING (expires_at IS NULL OR expires_at > now());

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_token_balances_wallet_token ON public.token_balances(wallet_address, token_mint);
CREATE INDEX IF NOT EXISTS idx_form_analytics_form_id ON public.form_analytics(form_id);
CREATE INDEX IF NOT EXISTS idx_form_analytics_event_type ON public.form_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_form_shares_form_id ON public.form_shares(form_id);