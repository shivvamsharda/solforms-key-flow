import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const WalletButton = () => {
  const { connected, publicKey, wallets, select, connect } = useWallet();
  const { user, signInWithWallet, signOut, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    await signInWithWallet();
    setIsSigningIn(false);
  };

  const handleWalletSelect = async (walletName: string) => {
    const wallet = wallets.find((w) => w.adapter.name === walletName);
    if (wallet) {
      select(wallet.adapter.name);
      try {
        await connect();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!connected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="hero">
            <Wallet className="w-4 h-4" />
            Select Wallet
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {wallets.map((wallet) => (
            <DropdownMenuItem
              key={wallet.adapter.name}
              onClick={() => handleWalletSelect(wallet.adapter.name)}
              className="cursor-pointer"
            >
              <img 
                src={wallet.adapter.icon} 
                alt={wallet.adapter.name}
                className="w-4 h-4 mr-2"
              />
              {wallet.adapter.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
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