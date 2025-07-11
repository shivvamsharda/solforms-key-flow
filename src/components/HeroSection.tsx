import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight, Plus, Type, CheckSquare, Lock, Zap, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--primary)_0%,_transparent_50%)] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--accent)_0%,_transparent_50%)] opacity-20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-6 relative z-10 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                Encrypted Forms
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">You Can Trust</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                Create secure forms with wallet-based authentication. No emails, no passwords, no data harvesting.
                <span className="text-primary font-medium"> Just pure privacy.</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Start Building Forms
              </Button>
              <Button variant="outline" size="xl" className="group">
                See How It Works
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">End-to-end encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Instant setup</span>
              </div>
            </div>
          </div>
          
          {/* Right Form Preview */}
          <div className="relative">
            {/* Form Builder Interface */}
            <div className="bg-gradient-card rounded-2xl shadow-card border border-border overflow-hidden">
              {/* Form Builder Header */}
              <div className="bg-card/50 backdrop-blur-sm border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    solforms.xyz/build
                  </div>
                </div>
              </div>
              
              {/* Form Canvas */}
              <div className="p-6 bg-card">
                <div className="space-y-6">
                  {/* Form Title */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Form Title</span>
                    </div>
                    <input 
                      className="w-full text-2xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" 
                      defaultValue="Community Feedback Survey"
                      readOnly
                    />
                  </div>
                  
                  {/* Form Description */}
                  <div className="space-y-2">
                    <textarea 
                      className="w-full bg-transparent border-none outline-none text-muted-foreground placeholder:text-muted-foreground resize-none" 
                      defaultValue="Help us improve our platform by sharing your thoughts and suggestions."
                      rows={2}
                      readOnly
                    />
                  </div>
                  
                  {/* Form Fields */}
                  <div className="space-y-4">
                    {/* Text Input */}
                    <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        What's your main use case? *
                      </label>
                      <input 
                        className="w-full p-3 bg-muted/50 border border-border rounded-md text-foreground placeholder:text-muted-foreground"
                        placeholder="e.g., Event registration, surveys, feedback..."
                        readOnly
                      />
                    </div>
                    
                    {/* Dropdown */}
                    <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        How did you hear about us?
                      </label>
                      <select className="w-full p-3 bg-muted/50 border border-border rounded-md text-foreground">
                        <option>Select an option...</option>
                        <option>Twitter</option>
                        <option>Friend referral</option>
                        <option>Search engine</option>
                      </select>
                    </div>
                    
                    {/* Checkbox */}
                    <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <CheckSquare className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <label className="text-sm font-medium text-foreground">
                            I agree to participate in follow-up research
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Optional - help us improve by participating in user interviews
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Add Field Button */}
                  <button className="w-full p-4 border-2 border-dashed border-border hover:border-primary/50 rounded-lg transition-colors group">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground group-hover:text-primary">
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Add Field</span>
                    </div>
                  </button>
                </div>
                
                {/* Wallet Integration Footer */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Wallet-gated responses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">0 responses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full animate-float blur-sm"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-accent/20 rounded-full animate-float delay-1000 blur-sm"></div>
            <div className="absolute top-1/2 -right-8 w-8 h-8 bg-primary/30 rounded-full animate-float delay-500"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;