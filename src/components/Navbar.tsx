import { useState, useEffect } from "react";
import { WalletButton } from "@/components/WalletButton";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="https://sszxqukimsedglqwkneg.supabase.co/storage/v1/object/public/form-files//web3forms_logo_transparent.png" 
            alt="web3forms logo" 
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-foreground">web3forms</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#use-cases" className="text-muted-foreground hover:text-foreground transition-colors">
            Use Cases
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
        </div>

        <WalletButton />
      </div>
    </nav>
  );
};

export default Navbar;