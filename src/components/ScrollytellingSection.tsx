import { useEffect, useState, useRef } from "react";

const ScrollytellingSection = () => {
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  const [currentScrollState, setCurrentScrollState] = useState<'notifications' | 'final'>('notifications');
  const [isActive, setIsActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      text: "PERSONAL PHOTOS",
      position: "top-left-far"
    },
    {
      text: "BANK CHECKS",
      position: "top-right-far"
    },
    {
      text: "MEETINGS",
      position: "left-upper"
    },
    {
      text: "ADDRESSES",
      position: "right-upper"
    },
    {
      text: "COMMERCIAL SECRETS",
      position: "left-lower"
    },
    {
      text: "CONTRACTS",
      position: "right-lower"
    },
    {
      text: "DOCUMENTS",
      position: "bottom-left-far"
    },
    {
      text: "PASSWORD RESET LINKS",
      position: "bottom-right-far"
    },
    {
      text: "LINKS TO CLOUD FILES",
      position: "bottom-center-far"
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
    switch (position) {
      case "top-left-far":
        return `absolute top-12 left-4 md:left-8 transform animate-fade-in`;
      case "top-right-far":
        return `absolute top-12 right-4 md:right-8 transform animate-fade-in`;
      case "left-upper":
        return `absolute top-1/3 left-4 md:left-8 transform animate-fade-in`;
      case "right-upper":
        return `absolute top-1/3 right-4 md:right-8 transform animate-fade-in`;
      case "left-lower":
        return `absolute top-2/3 left-4 md:left-8 transform animate-fade-in`;
      case "right-lower":
        return `absolute top-2/3 right-4 md:right-8 transform animate-fade-in`;
      case "bottom-left-far":
        return `absolute bottom-12 left-4 md:left-8 transform animate-fade-in`;
      case "bottom-right-far":
        return `absolute bottom-12 right-4 md:right-8 transform animate-fade-in`;
      case "bottom-center-far":
        return `absolute bottom-12 left-1/2 -translate-x-1/2 transform animate-fade-in`;
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
                
                return (
                  <div
                    key={notificationIndex}
                    className={`${getNotificationPosition(notification.position, notificationIndex)} 
                      bg-muted/80 border border-muted-foreground/20 p-3 md:p-4 
                      max-w-[200px] md:max-w-[250px] transition-all duration-300
                      animate-scale-in`}
                    style={{
                      animationDelay: `${notificationIndex * 200}ms`
                    }}
                  >
                    <p className="text-xs md:text-sm font-medium text-foreground tracking-wide">
                      {notification.text}
                    </p>
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