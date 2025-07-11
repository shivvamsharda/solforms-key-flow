import { useEffect, useState, useRef } from "react";

const ScrollytellingSection = () => {
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  const [currentScrollState, setCurrentScrollState] = useState<'notifications' | 'final'>('notifications');
  const [isActive, setIsActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { text: "PERSONAL PHOTOS" },
    { text: "BANK CHECKS" },
    { text: "MEETINGS" },
    { text: "ADDRESSES" },
    { text: "COMMERCIAL SECRETS" },
    { text: "CONTRACTS" },
    { text: "DOCUMENTS" },
    { text: "PASSWORD RESET LINKS" },
    { text: "LINKS TO CLOUD FILES" }
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

  // Pre-defined angles and positions for each notification (calculated once)
  const predefinedPositions = [
    { angle: 45, radius: 350 },   // PERSONAL PHOTOS
    { angle: 85, radius: 380 },   // BANK CHECKS  
    { angle: 125, radius: 360 },  // MEETINGS
    { angle: 165, radius: 370 },  // ADDRESSES
    { angle: 240, radius: 420 },  // COMMERCIAL SECRETS - moved to bottom-left with larger radius
    { angle: 275, radius: 390 },  // CONTRACTS
    { angle: 315, radius: 370 },  // DOCUMENTS
    { angle: 15, radius: 400 },   // PASSWORD RESET LINKS
    { angle: 200, radius: 450 }   // LINKS TO CLOUD FILES - moved to bottom with larger radius
  ];
  
  // Helper function to get circular position using trigonometry
  const getCircularPosition = (notificationIndex: number) => {
    const { angle, radius } = predefinedPositions[notificationIndex] || { angle: 0, radius: 200 };
    
    // Convert angle to radians
    const radian = (angle * Math.PI) / 180;
    
    // Calculate x and y offsets using trigonometry
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    
    return {
      transform: `translate(${x}px, ${y}px)`,
      position: 'absolute' as const,
      top: '50%',
      left: '50%'
    };
  };

  const showFinalFrame = currentScrollState === 'final' && isActive;

  return (
    <section 
      ref={sectionRef}
      className="relative bg-black transition-all duration-1000"
      style={{ height: `${(notifications.length + 1) * 60}vh` }}
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-6xl mx-auto px-6">
          
          {/* Main Content */}
          {!showFinalFrame ? (
            <>
              {/* Notification Pop-ups - Plain text distributed in 360 degrees */}
              {visibleNotifications.map((notificationIndex) => {
                const notification = notifications[notificationIndex];
                const position = getCircularPosition(notificationIndex);
                
                return (
                  <p
                    key={notificationIndex}
                    className="text-base md:text-lg font-bold text-red-500 tracking-wide transition-opacity duration-300"
                    style={{
                      ...position,
                      opacity: 1
                    }}
                  >
                    {notification.text}
                  </p>
                );
              })}
            </>
          ) : (
            /* Final Frame - Empty since message moved to static section */
            <div className="text-center">
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