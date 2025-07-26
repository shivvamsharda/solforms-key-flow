const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "web3forms completely changed how we handle DAO governance. No more email vulnerabilities, just pure wallet-based voting.",
      author: "Alex Chen",
      role: "DAO Coordinator",
      project: "MetaDAO",
      avatar: "AC"
    },
    {
      quote: "The token-gating feature is incredible. We can now restrict surveys to our NFT holders without any workarounds.",
      author: "Sarah Martinez",
      role: "Community Manager", 
      project: "DegenApes",
      avatar: "SM"
    },
    {
      quote: "Finally, a form builder that understands Web3. The wallet integration is seamless and the encryption gives us peace of mind.",
      author: "Michael Torres",
      role: "Product Lead",
      project: "Jupiter Exchange",
      avatar: "MT"
    },
    {
      quote: "Our whitelist process went from chaotic to streamlined overnight. web3forms made NFT launches so much easier.",
      author: "Emily Wang",
      role: "Founder",
      project: "Solana Monkes",
      avatar: "EW"
    },
    {
      quote: "The analytics are perfect - we get insights without compromising user privacy. That's the Web3 way.",
      author: "David Kim",
      role: "Data Analyst",
      project: "Mango Markets",
      avatar: "DK"
    },
    {
      quote: "Best decision we made for our community engagement. The responses are encrypted and the UX is incredibly smooth.",
      author: "Lisa Thompson",
      role: "Community Lead",
      project: "Serum DEX",
      avatar: "LT"
    }
  ];

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="w-full px-4 lg:px-8 xl:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Trusted by Web3 Builders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what DAOs, NFT projects, and DeFi protocols are saying about web3forms
          </p>
        </div>

        {/* Scrolling testimonials */}
        <div className="relative">
          <div className="flex space-x-6 animate-marquee">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 bg-gradient-card rounded-xl p-6 border border-border shadow-card"
              >
                <p className="text-foreground mb-6 leading-relaxed text-sm">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {testimonial.author}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {testimonial.role} at {testimonial.project}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10"></div>
        </div>
      </div>
      
    </section>
  );
};

export default TestimonialsSection;