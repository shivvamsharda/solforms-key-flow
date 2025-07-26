import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SolanaPrice {
  priceUSD: number;
  proSOL: number;
  enterpriseSOL: number;
  loading: boolean;
  error: string | null;
}

export const useSolanaPrice = (): SolanaPrice => {
  const [priceData, setPriceData] = useState<SolanaPrice>({
    priceUSD: 0,
    proSOL: 0,
    enterpriseSOL: 0,
    loading: true,
    error: null
  });

  const fetchPrice = async () => {
    try {
      // Check cache first (5 minute cache)
      const { data: cachedPrice } = await supabase
        .from('pricing_cache')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      const now = new Date();
      const cacheAge = cachedPrice 
        ? (now.getTime() - new Date(cachedPrice.updated_at).getTime()) / (1000 * 60)
        : 6; // Force fetch if no cache

      if (cachedPrice && cacheAge < 5) {
        // Use cached price
        const priceUSD = parseFloat(cachedPrice.sol_price_usd.toString());
        setPriceData({
          priceUSD,
          proSOL: Math.round((50 / priceUSD) * 10000) / 10000,
          enterpriseSOL: Math.round((150 / priceUSD) * 10000) / 10000,
          loading: false,
          error: null
        });
        return;
      }

      // Fetch fresh price from CoinGecko
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch SOL price');
      }

      const data = await response.json();
      const priceUSD = data.solana.usd;

      // Update cache
      await supabase
        .from('pricing_cache')
        .upsert({
          sol_price_usd: priceUSD,
          updated_at: now.toISOString()
        });

      setPriceData({
        priceUSD,
        proSOL: Math.round((50 / priceUSD) * 10000) / 10000,
        enterpriseSOL: Math.round((150 / priceUSD) * 10000) / 10000,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching SOL price:', error);
      
      // Fallback to cached price if available
      const { data: fallbackPrice } = await supabase
        .from('pricing_cache')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (fallbackPrice) {
        const priceUSD = parseFloat(fallbackPrice.sol_price_usd.toString());
        setPriceData({
          priceUSD,
          proSOL: Math.round((50 / priceUSD) * 10000) / 10000,
          enterpriseSOL: Math.round((150 / priceUSD) * 10000) / 10000,
          loading: false,
          error: 'Using cached price due to network error'
        });
      } else {
        setPriceData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch SOL price'
        }));
      }
    }
  };

  useEffect(() => {
    fetchPrice();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return priceData;
};