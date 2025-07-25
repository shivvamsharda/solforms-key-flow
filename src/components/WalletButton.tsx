import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const WalletButton = () => {
  const { connected, publicKey, wallets } = useWallet();
  const { user, connectAndSignIn, signOut, loading, isConnecting } = useAuth();
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);

  const handleWalletSelect = async (walletName: WalletName) => {
    setIsWalletMenuOpen(false);
    await connectAndSignIn(walletName);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // If connected and authenticated, show user info
  if (connected && user) {
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
  }

  // Show connect wallet button with dropdown
  return (
    <Popover open={isWalletMenuOpen} onOpenChange={setIsWalletMenuOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="wallet" 
          disabled={loading || isConnecting}
          className="flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-1">
          {wallets.filter(wallet => wallet.readyState === 'Installed').map((wallet) => (
            <Button
              key={wallet.adapter.name}
              variant="ghost"
              className="w-full justify-start h-auto p-3"
              onClick={() => handleWalletSelect(wallet.adapter.name)}
            >
              <img 
                src={wallet.adapter.icon} 
                alt={wallet.adapter.name} 
                className="w-6 h-6 mr-3"
              />
              <span className="text-sm font-medium">{wallet.adapter.name}</span>
            </Button>
          ))}
          {wallets.filter(wallet => wallet.readyState !== 'Installed').map((wallet) => (
            <Button
              key={wallet.adapter.name}
              variant="ghost"
              className="w-full justify-start h-auto p-3 opacity-50"
              disabled
            >
              <img 
                src={wallet.adapter.icon} 
                alt={wallet.adapter.name} 
                className="w-6 h-6 mr-3"
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{wallet.adapter.name}</span>
                <span className="text-xs text-muted-foreground">Not installed</span>
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};