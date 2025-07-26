import { Vote, UserCheck, BarChart, Calendar, MessageSquare, Coins } from "lucide-react";

const UseCasesSection = () => {
  const useCases = [
    {
      icon: Vote,
      title: "DAO Voting & Proposals",
      description: "Secure governance voting with token-weighted responses and transparent tallying"
    },
    {
      icon: UserCheck,
      title: "Whitelisting Applications",
      description: "Streamlined NFT mint whitelisting with wallet verification and automated approval"
    },
    {
      icon: BarChart,
      title: "Token-Gated Surveys",
      description: "Exclusive community surveys restricted to token holders or NFT owners"
    },
    {
      icon: Calendar,
      title: "Private RSVP Collection",
      description: "Event registration with encrypted attendee data and wallet-based confirmation"
    },
    {
      icon: MessageSquare,
      title: "Community Feedback",
      description: "Anonymous community input with verifiable wallet ownership without revealing identity"
    },
    {
      icon: Coins,
      title: "DeFi User Research",
      description: "Protocol feedback and feature requests from verified protocol users"
    }
  ];

  return (
    <section id="use-cases" className="py-20 bg-gradient-to-b from-background to-card">
      <div className="w-full px-4 lg:px-8 xl:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Built for <span className="bg-gradient-primary bg-clip-text text-transparent">Web3 Workflows</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From DAO governance to NFT projects, web3forms adapts to your decentralized needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            
            return (
              <div
                key={index}
                className="group hover:scale-105 transition-all duration-300"
              >
                <div className="bg-gradient-card rounded-xl p-6 border border-border shadow-card h-full hover:shadow-glow">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-accent/10 rounded-xl mb-4 group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-7 h-7 text-accent" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {useCase.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            And many more use cases limited only by your imagination
          </p>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;