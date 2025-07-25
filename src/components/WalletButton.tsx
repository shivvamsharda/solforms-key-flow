import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const WalletButton = () => {
  const { connected, publicKey } = useWallet();
  const { user, signInWithWallet, signOut, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    await signInWithWallet();
    setIsSigningIn(false);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!connected) {
    return <WalletMultiButton className="!bg-gradient-primary !text-primary-foreground hover:!shadow-glow hover:!scale-105 !font-semibold !h-10 !px-4 !py-2 !rounded-lg !transition-all !duration-300 !text-base" />;
  }

  if (connected && !user) {
    return (
      <Button 
        variant="wallet" 
        onClick={handleSignIn}
        disabled={loading || isSigningIn}
      >
        <Wallet className="w-4 h-4" />
        {isSigningIn ? "Signing In..." : "Sign In with Wallet"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="text-xs">
        {publicKey ? truncateAddress(publicKey.toBase58()) : "Connected"}
      </Button>
      <Button variant="ghost" size="icon" onClick={signOut}>
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};