import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { clusterApiUrl } from '@solana/web3.js';

export const useRpcEndpoint = () => {
  return useQuery({
    queryKey: ['rpc-endpoint'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-rpc-url');
        
        if (error) {
          console.warn('Failed to get custom RPC URL, falling back to public:', error);
          return clusterApiUrl('mainnet-beta');
        }
        
        return data.rpcUrl || clusterApiUrl('mainnet-beta');
      } catch (error) {
        console.warn('Error fetching RPC URL, using fallback:', error);
        return clusterApiUrl('mainnet-beta');
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false, // Don't retry on failure, use fallback
  });
};