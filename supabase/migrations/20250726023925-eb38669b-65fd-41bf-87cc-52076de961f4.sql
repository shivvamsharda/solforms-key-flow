-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE,
  sol_amount_paid DECIMAL(10, 4),
  usd_amount_paid DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_id UUID,
  transaction_hash TEXT NOT NULL UNIQUE,
  amount_sol DECIMAL(10, 4) NOT NULL,
  amount_usd DECIMAL(10, 2) NOT NULL,
  sol_price_usd DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  plan_type TEXT NOT NULL CHECK (plan_type IN ('pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Create pricing cache table
CREATE TABLE public.pricing_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sol_price_usd DECIMAL(10, 4) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update payments" 
ON public.payments 
FOR UPDATE 
USING (true);

-- RLS Policies for pricing cache
CREATE POLICY "Anyone can view pricing cache" 
ON public.pricing_cache 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage pricing cache" 
ON public.pricing_cache 
FOR ALL 
USING (true);

-- Create triggers for timestamp updates
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_transaction_hash ON public.payments(transaction_hash);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_pricing_cache_updated_at ON public.pricing_cache(updated_at DESC);