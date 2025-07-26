import { 
  MousePointer, 
  Upload, 
  BarChart3, 
  Shield, 
  GitBranch, 
  Users, 
  Share2,
  QrCode,
  Layers
} from "lucide-react";

const FeaturesGrid = () => {
  const features = [
    {
      icon: MousePointer,
      title: "Drag-and-Drop Builder",
      description: "Intuitive form builder with real-time preview and advanced customization options"
    },
    {
      icon: Upload,
      title: "File & Image Upload",
      description: "Secure file uploads with automatic encryption and IPFS storage integration"
    },
    {
      icon: BarChart3,
      title: "Wallet-Based Analytics",
      description: "Privacy-preserving analytics showing response patterns without exposing identities"
    },
    {
      icon: Shield,
      title: "Token-Gated Access",
      description: "Restrict form access based on NFT ownership, token balance, or custom criteria"
    },
    {
      icon: GitBranch,
      title: "Conditional Logic",
      description: "Smart form flows that adapt based on previous answers and wallet data"
    },
    {
      icon: Users,
      title: "Wallet Permissions",
      description: "Collaborative form management with wallet-based role assignments"
    },
    {
      icon: Share2,
      title: "Shareable Links",
      description: "Generate secure, customizable links with optional expiration and access limits"
    },
    {
      icon: QrCode,
      title: "QR Code Integration",
      description: "Instant QR codes for mobile-first form distribution and wallet connections"
    },
    {
      icon: Layers,
      title: "Advanced Templates",
      description: "Pre-built templates for DAO voting, NFT whitelisting, and DeFi applications"
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Powerful Features for Web3
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create, distribute, and analyze forms in the decentralized world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="group hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-card rounded-xl p-6 border border-border shadow-card h-full hover:shadow-glow hover:border-primary/20">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;