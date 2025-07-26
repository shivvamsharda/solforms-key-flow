import { Shield, Wallet, Coins } from "lucide-react";

const SolutionSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Encrypted Responses",
      description: "Viewable only by wallet-connected creator using end-to-end encryption"
    },
    {
      icon: Wallet,
      title: "Wallet-Native Identity",
      description: "No emails or passwords needed - authenticate with your crypto wallet"
    },
    {
      icon: Coins,
      title: "Token Gating",
      description: "Control access using SPL tokens, NFTs, or custom wallet requirements"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">web3forms</span> is different.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built from the ground up for Web3, prioritizing privacy and wallet-native workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="group hover:scale-105 transition-all duration-300"
              >
                <div className="bg-gradient-card rounded-2xl p-8 border border-border shadow-card h-full hover:shadow-glow">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decorative elements */}
        <div className="relative mt-16">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-16 bg-gradient-to-b from-primary to-transparent"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;