import { useEffect, useState } from "react";
import { Eye, Mail, Shield, AlertTriangle, Database, Users, DollarSign } from "lucide-react";

const ScrollytellingSection = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  const securityIssues = [
    {
      icon: Eye,
      title: "Tracking pixels",
      description: "Hidden images that track when and where you open emails"
    },
    {
      icon: Database,
      title: "Metadata leakage",
      description: "IP addresses, device info, and behavioral patterns exposed"
    },
    {
      icon: Shield,
      title: "Password resets",
      description: "Account takeovers through email-based authentication"
    },
    {
      icon: AlertTriangle,
      title: "Phishing",
      description: "Malicious links disguised as legitimate form submissions"
    },
    {
      icon: Database,
      title: "Centralized databases",
      description: "Single points of failure storing all your personal data"
    },
    {
      icon: Users,
      title: "Identity spoofing",
      description: "Easy to fake email addresses and impersonate others"
    },
    {
      icon: DollarSign,
      title: "Data brokerage",
      description: "Your responses sold to advertisers and third parties"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const startOffset = windowHeight;
      
      securityIssues.forEach((_, index) => {
        const cardOffset = startOffset + (index * 200);
        if (scrollY > cardOffset && !visibleCards.includes(index)) {
          setVisibleCards(prev => [...prev, index]);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCards]);

  return (
    <section className="min-h-screen bg-background py-20 relative">
      <div className="container mx-auto px-6">
        <div className="sticky top-1/4 mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-center text-foreground mb-4">
            Email is full of your
          </h2>
          <h2 className="text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-destructive to-orange-500 bg-clip-text text-transparent">
            personal data
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {securityIssues.map((issue, index) => {
            const Icon = issue.icon;
            const isVisible = visibleCards.includes(index);
            
            return (
              <div
                key={index}
                className={`transform transition-all duration-700 ${
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="bg-gradient-card rounded-xl p-6 border border-border shadow-card">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <Icon className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {issue.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Forms built on email aren't private.
            </h3>
            <p className="text-xl text-muted-foreground">
              They're just convenient <span className="text-destructive">surveillance</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollytellingSection;