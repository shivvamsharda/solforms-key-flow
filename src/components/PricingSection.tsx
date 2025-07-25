import { Button } from "@/components/ui/button";
import { Check, Wallet, Loader2 } from "lucide-react";
import { useSolanaPrice } from "@/hooks/useSolanaPrice";
import { PaymentModal } from "@/components/PaymentModal";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const PricingSection = () => {
  const { priceUSD, proSOL, enterpriseSOL, loading: priceLoading, error } = useSolanaPrice();
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    planType: 'pro' | 'enterprise';
    amountUSD: number;
    amountSOL: number;
  }>({
    isOpen: false,
    planType: 'pro',
    amountUSD: 50,
    amountSOL: 0
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePayment = (planType: 'pro' | 'enterprise') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in with your wallet to subscribe",
        variant: "destructive"
      });
      return;
    }

    const amountUSD = planType === 'pro' ? 50 : 150;
    const amountSOL = planType === 'pro' ? proSOL : enterpriseSOL;

    setPaymentModal({
      isOpen: true,
      planType,
      amountUSD,
      amountSOL
    });
  };

  const plans = [
    {
      name: "Free",
      price: "0",
      currency: "SOL",
      period: "forever",
      description: "Perfect for trying out web3forms",
      features: [
        "Up to 3 forms",
        "100 responses/month",
        "Basic encryption",
        "Wallet authentication",
        "Community support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      price: priceLoading ? "..." : proSOL.toString(),
      currency: "SOL",
      period: "/month",
      usdPrice: 50,
      description: "For serious Web3 builders",
      features: [
        "Unlimited forms",
        "10,000 responses/month",
        "Advanced encryption",
        "Token gating",
        "Conditional logic",
        "File uploads",
        "Priority support",
        "Custom branding"
      ],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: priceLoading ? "..." : enterpriseSOL.toString(),
      currency: "SOL",
      period: "/month",
      usdPrice: 150,
      description: "For DAOs and large organizations",
      features: [
        "Everything in Pro",
        "Unlimited responses",
        "White-label solution",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "Custom features"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pay with SOL. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gradient-card rounded-2xl p-8 border shadow-card hover:shadow-glow transition-all duration-300 ${
                plan.popular 
                  ? "border-primary shadow-glow scale-105" 
                  : "border-border hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {plan.description}
                </p>
                
                <div className="flex items-center justify-center mb-2">
                  {priceLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-xl text-muted-foreground ml-2">{plan.currency}</span>
                    </>
                  )}
                </div>
                {plan.usdPrice && (
                  <div className="text-center text-sm text-muted-foreground mb-2">
                    ≈ ${plan.usdPrice}/month
                  </div>
                )}
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? "default" : "outline"} 
                size="lg" 
                className="w-full"
                onClick={() => {
                  if (plan.name === "Free") return;
                  if (plan.name === "Enterprise") {
                    handlePayment('enterprise');
                  } else if (plan.name === "Pro") {
                    handlePayment('pro');
                  }
                }}
                disabled={plan.name === "Free" || priceLoading}
              >
                {plan.name === "Free" ? (
                  plan.cta
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    {plan.cta}
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            All plans include wallet-native payments • No credit cards required • Cancel anytime
          </p>
          {error && (
            <p className="text-yellow-600 text-xs mt-2">
              {error} • Prices may be slightly outdated
            </p>
          )}
        </div>

        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={() => setPaymentModal(prev => ({ ...prev, isOpen: false }))}
          planType={paymentModal.planType}
          amountUSD={paymentModal.amountUSD}
          amountSOL={paymentModal.amountSOL}
          solPriceUSD={priceUSD}
          userId={user?.id || ''}
        />
      </div>
    </section>
  );
};

export default PricingSection;