import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">SolForms</span>
          </div>

          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#docs" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Powered by <span className="text-accent">Solana</span> • Built with{" "}
            <span className="text-accent">Supabase</span> &{" "}
            <span className="text-accent">Web3.Storage</span> • © 2025 SolForms
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;