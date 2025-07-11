import { useEffect, useState, useRef } from "react";
import { Eye, Mail, Shield, Network, AlertTriangle } from "lucide-react";

const ScrollytellingSection = () => {
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  const [currentScrollState, setCurrentScrollState] = useState<'notifications' | 'final'>('notifications');
  const [isActive, setIsActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      text: "Tracking pixels know when you open mail.",
      icon: Eye,
      position: "top-left"
    },
    {
      text: "Phishing links steal your identity.",
      icon: Shield,
      position: "top-right"
    },
    {
      text: "Your inbox is a honeypot for attackers.",
      icon: Mail,
      position: "middle-left"
    },
    {
      text: "Metadata exposes who you talk to — and when.",
      icon: Network,
      position: "middle-right"
    },
    {
      text: "Password resets. Breach portals. Surveillance defaults.",
      icon: AlertTriangle,
      position: "bottom-center"
    }
  ];

  const finalFrame = {
    text: "Forms built on email aren't private. They're just convenient surveillance.",
    isFinal: true
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const totalFrames = notifications.length + 1;
      const frameHeight = sectionHeight / totalFrames;
      
      const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
      setIsActive(isInViewport);

      if (isInViewport) {
        const scrollProgress = Math.abs(rect.top);
        const frameIndex = Math.floor(scrollProgress / frameHeight);
        const clampedIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1));
        
        if (clampedIndex >= notifications.length) {
          // Final frame
          setCurrentScrollState('final');
          setVisibleNotifications([]);
        } else {
          // Show notifications
          setCurrentScrollState('notifications');
          const newVisible = Array.from({ length: clampedIndex + 1 }, (_, i) => i);
          setVisibleNotifications(newVisible);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [notifications.length]);

  // Helper function to get notification position styles
  const getNotificationPosition = (position: string, index: number) => {
    const baseDelay = index * 200; // Stagger animations
    
    switch (position) {
      case "top-left":
        return `absolute top-16 left-8 md:left-16 transform animate-fade-in`;
      case "top-right":
        return `absolute top-16 right-8 md:right-16 transform animate-fade-in`;
      case "middle-left":
        return `absolute top-1/2 left-8 md:left-16 -translate-y-1/2 transform animate-fade-in`;
      case "middle-right":
        return `absolute top-1/2 right-8 md:right-16 -translate-y-1/2 transform animate-fade-in`;
      case "bottom-center":
        return `absolute bottom-32 left-1/2 -translate-x-1/2 transform animate-fade-in`;
      default:
        return `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform animate-fade-in`;
    }
  };

  const showFinalFrame = currentScrollState === 'final' && isActive;

  return (
    <section 
      ref={sectionRef}
      className="relative bg-black transition-all duration-1000"
      style={{ height: `${(notifications.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-6xl mx-auto px-6">
          
          {/* Main Content */}
          {!showFinalFrame ? (
            <>
              {/* Main Heading - Always Visible */}
              <div className="text-center mb-16">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Email is full of your personal data
                </h1>
              </div>

              {/* Notification Pop-ups */}
              {visibleNotifications.map((notificationIndex) => {
                const notification = notifications[notificationIndex];
                const IconComponent = notification.icon;
                
                return (
                  <div
                    key={notificationIndex}
                    className={`${getNotificationPosition(notification.position, notificationIndex)} 
                      bg-background/10 backdrop-blur-sm border border-destructive/30 rounded-lg p-4 
                      shadow-lg max-w-xs w-full hover:bg-background/20 transition-all duration-300
                      animate-scale-in`}
                    style={{
                      animationDelay: `${notificationIndex * 200}ms`
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-destructive mt-0.5" />
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {notification.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            /* Final Frame */
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight animate-ambient-glow">
                {finalFrame.text}
              </h2>
              
              {/* Ambient effects for final frame */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-destructive/10 rounded-full blur-3xl animate-ambient-glow"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScrollytellingSection;