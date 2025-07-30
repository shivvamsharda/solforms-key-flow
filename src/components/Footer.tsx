import { MessageCircle, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <img 
              src="https://sszxqukimsedglqwkneg.supabase.co/storage/v1/object/public/form-files//web3forms_logo_transparent.png" 
              alt="web3forms logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-foreground">web3forms</span>
          </div>

          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <a 
              href="https://x.com/web3formsapp" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="http://t.me/web3formsapp" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Telegram"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Powered by <span className="text-accent">Solana</span> • Built with{" "}
            <span className="text-accent">Supabase</span> &{" "}
            <span className="text-accent">Web3.Storage</span> • © 2025 web3forms
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;