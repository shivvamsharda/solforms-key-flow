import { Wallet, Wrench, Settings, Share2 } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Wallet,
      title: "Connect Your Wallet",
      description: "Sign in securely with your Solana wallet - no email or password required"
    },
    {
      icon: Wrench,
      title: "Build Your Form",
      description: "Use our intuitive drag-and-drop builder to create custom forms"
    },
    {
      icon: Settings,
      title: "Configure Encryption",
      description: "Set up token gating, access controls, and end-to-end encryption"
    },
    {
      icon: Share2,
      title: "Share & Collect",
      description: "Distribute your form and collect encrypted responses securely"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with web3forms in four simple steps
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              
              return (
                <div key={index} className="relative">
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-8 h-px bg-gradient-to-r from-primary to-primary/30 z-0"></div>
                  )}
                  
                  <div className="relative z-10 text-center">
                    <div className="inline-flex p-6 bg-gradient-card rounded-2xl border border-border shadow-card mb-4 hover:shadow-glow transition-all duration-300 group">
                      <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    
                    <div className="mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold mb-3">
                        {index + 1}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demo mockup */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-card rounded-2xl p-1 shadow-card">
            <div className="bg-card rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    See it in action
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Watch how easy it is to create a token-gated form and start collecting encrypted responses.
                  </p>
                  <button className="text-primary hover:text-primary-glow transition-colors font-medium">
                    Watch Demo →
                  </button>
                </div>
                
                <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
                  <span className="text-muted-foreground">Demo Video Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;