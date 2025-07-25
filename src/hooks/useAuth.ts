import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const wallet = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You have successfully signed in with your wallet.",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out.",
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signInWithWallet = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithWeb3({
        chain: 'solana',
        statement: 'I accept the Terms of Service for SolForms',
        wallet: {
          publicKey: wallet.publicKey,
          signMessage: wallet.signMessage!,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Failed to sign in with wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [wallet.connected, wallet.publicKey, wallet.signMessage, toast]);

  // Auto-authenticate when wallet connects
  useEffect(() => {
    if (wallet.connected && wallet.publicKey && !user && !loading && isConnecting) {
      // Small delay to ensure wallet is fully connected
      setTimeout(async () => {
        await signInWithWallet();
        setIsConnecting(false);
      }, 100);
    }
  }, [wallet.connected, wallet.publicKey, user, loading, isConnecting, signInWithWallet]);

  const connectAndSignIn = useCallback(async (walletName: WalletName) => {
    try {
      setIsConnecting(true);
      
      // Select and connect to wallet
      wallet.select(walletName);
      await wallet.connect();
      
      // signInWithWallet will be called automatically by the useEffect above
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  }, [wallet, toast, signInWithWallet]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      if (wallet.connected) {
        wallet.disconnect();
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    session,
    loading,
    isConnecting,
    connectAndSignIn,
    signInWithWallet,
    signOut,
    isAuthenticated: !!user,
  };
};