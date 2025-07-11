import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ScrollytellingSection from "@/components/ScrollytellingSection";
import EmailPrivacyRevelationSection from "@/components/EmailPrivacyRevelationSection";
import SolutionSection from "@/components/SolutionSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import UseCasesSection from "@/components/UseCasesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <ScrollytellingSection />
      <EmailPrivacyRevelationSection />
      <SolutionSection />
      <FeaturesGrid />
      <UseCasesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;
