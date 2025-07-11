import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_50%)] opacity-20"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Your Forms. Your Keys.
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Your Data.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Create encrypted forms and collect responses — all without emails or passwords. Wallets only.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              <Wallet className="w-5 h-5" />
              Connect Wallet to Start
            </Button>
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              Explore Use Cases
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Form builder mockup */}
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-gradient-card rounded-2xl p-8 shadow-card border border-border">
              <div className="bg-card rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Community Feedback Form</h3>
                  <span className="text-sm text-accent bg-accent/10 px-3 py-1 rounded-full">Token Gated</span>
                </div>
                
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-24 bg-muted rounded"></div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground">0x1a23...4f8c submitted securely</span>
                  </div>
                  <div className="text-sm text-accent">✓ Encrypted</div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-accent/20 rounded-full animate-float delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;