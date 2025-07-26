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

      </div>
    </section>
  );
};

export default FinalCTASection;