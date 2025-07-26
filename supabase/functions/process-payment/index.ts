import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from 'https://esm.sh/@solana/web3.js@1.98.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentData, signedTransaction } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const rpcUrl = Deno.env.get('RPC_URL')!;
    const teamWallet = Deno.env.get('TEAM_WALLET')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const connection = new Connection(rpcUrl, 'confirmed');

    // Verify the transaction is to our team wallet
    const transaction = Transaction.from(Buffer.from(signedTransaction, 'base64'));
    const instruction = transaction.instructions[0];
    
    if (!instruction || instruction.programId.toString() !== SystemProgram.programId.toString()) {
      throw new Error('Invalid transaction: not a system transfer');
    }

    const toKey = instruction.keys[1]?.pubkey?.toString();
    if (toKey !== teamWallet) {
      throw new Error('Invalid transaction: wrong recipient');
    }

    // Send the transaction
    const txHash = await connection.sendRawTransaction(transaction.serialize());
    console.log('Transaction sent:', txHash);

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: paymentData.userId,
        transaction_hash: txHash,
        amount_sol: paymentData.amountSOL,
        amount_usd: paymentData.amountUSD,
        sol_price_usd: paymentData.solPriceUSD,
        status: 'pending',
        plan_type: paymentData.planType
      });

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      throw new Error('Failed to create payment record');
    }

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(txHash, 'confirmed');
    
    if (confirmation.value.err) {
      // Update payment status to failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('transaction_hash', txHash);
      
      throw new Error('Transaction failed on blockchain');
    }

    // Update payment status to confirmed
    await supabase
      .from('payments')
      .update({ 
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('transaction_hash', txHash);

    // Create or update subscription
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: paymentData.userId,
        plan_type: paymentData.planType,
        status: 'active',
        expires_at: expiresAt.toISOString(),
        sol_amount_paid: paymentData.amountSOL,
        usd_amount_paid: paymentData.amountUSD
      });

    if (subError) {
      console.error('Error creating subscription:', subError);
      throw new Error('Failed to create subscription');
    }

    console.log('Payment processed successfully:', txHash);

    return new Response(
      JSON.stringify({ 
        success: true, 
        transactionHash: txHash,
        subscription: {
          planType: paymentData.planType,
          expiresAt: expiresAt.toISOString()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});