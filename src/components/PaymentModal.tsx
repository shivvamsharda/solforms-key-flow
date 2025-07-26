import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Wallet, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'pro' | 'enterprise';
  amountUSD: number;
  amountSOL: number;
  solPriceUSD: number;
  userId: string;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  planType,
  amountUSD,
  amountSOL,
  solPriceUSD,
  userId
}: PaymentModalProps) => {
  const [processing, setProcessing] = useState(false);
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!publicKey || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      // Get team wallet from Supabase function
      const { data: walletData, error: walletError } = await supabase.functions.invoke('get-team-wallet');
      if (walletError || !walletData?.teamWallet) {
        throw new Error('Unable to get team wallet address');
      }
      const teamWalletKey = new PublicKey(walletData.teamWallet);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: teamWalletKey,
          lamports: Math.floor(amountSOL * LAMPORTS_PER_SOL)
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign transaction
      const signedTransaction = await signTransaction(transaction);
      
      // Send to backend for processing
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          paymentData: {
            userId,
            planType,
            amountSOL,
            amountUSD,
            solPriceUSD
          },
          signedTransaction: Buffer.from(signedTransaction.serialize()).toString('base64')
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        toast({
          title: "Payment Successful!",
          description: `Your ${planType} subscription is now active. Transaction: ${data.transactionHash.slice(0, 8)}...`,
        });
        onClose();
        // Refresh the page to update subscription status
        window.location.reload();
      } else {
        throw new Error(data.error || 'Payment failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || 'Please try again',
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Confirm Payment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan:</span>
              <span className="font-semibold capitalize">{planType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount (USD):</span>
              <span className="font-semibold">${amountUSD}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount (SOL):</span>
              <span className="font-semibold">{amountSOL} SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SOL Price:</span>
              <span className="text-sm">${solPriceUSD}</span>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This will initiate a Solana transaction from your connected wallet. 
              Make sure you have enough SOL to cover the payment and transaction fees.
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={processing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={processing || !publicKey}
              className="flex-1"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Pay with Wallet
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};