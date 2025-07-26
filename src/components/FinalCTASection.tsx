import { Button } from "@/components/ui/button";
import { Wallet, BookOpen } from "lucide-react";

const FinalCTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-card to-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Ready to reclaim your 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> forms</span>?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join the Web3 revolution. Build forms that respect privacy, empower users, 
            and work seamlessly with wallets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              <Wallet className="w-5 h-5" />
              Create Your First Form
            </Button>
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              <BookOpen className="w-5 h-5" />
              Read the Docs
            </Button>
          </div>
          
          <p className="text-muted-foreground text-sm">
            Wallet-based forms • Fully encrypted • Zero email needed
          </p>
        </div>

        {/* Decorative elements */}
        <div className="relative mt-16">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-full blur-3xl w-96 h-96 mx-auto"></div>
          <div className="relative bg-gradient-card rounded-2xl p-8 border border-border shadow-card max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-muted-foreground text-sm">Forms Created</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">1M+</div>
                <div className="text-muted-foreground text-sm">Encrypted Responses</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-muted-foreground text-sm">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;