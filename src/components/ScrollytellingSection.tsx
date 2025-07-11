import { useEffect, useState, useRef } from "react";

const ScrollytellingSection = () => {
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
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


  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const frameHeight = sectionHeight / notifications.length;
      
      const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
      setIsActive(isInViewport);

      if (isInViewport) {
        const scrollProgress = Math.abs(rect.top);
        const frameIndex = Math.floor(scrollProgress / frameHeight);
        const clampedIndex = Math.max(0, Math.min(frameIndex, notifications.length - 1));
        
        const newVisible = Array.from({ length: clampedIndex + 1 }, (_, i) => i);
        setVisibleNotifications(newVisible);
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

  return (
    <section 
      ref={sectionRef}
      className="relative bg-black transition-all duration-1000"
      style={{ height: `${notifications.length * 60}vh` }}
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-6xl mx-auto px-6 py-12">
          
          {/* Main Content */}
          <>
            {/* Main Heading - Always Visible */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black text-foreground leading-tight tracking-tight">
                Email is full of your personal data
              </h1>
            </div>

            {/* Notification Pop-ups - Plain text distributed in 360 degrees */}
            {visibleNotifications.map((notificationIndex) => {
              const notification = notifications[notificationIndex];
              const position = getCircularPosition(notificationIndex);
              
              return (
                <div
                  key={notificationIndex}
                  className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm"
                  style={{
                    ...position,
                    opacity: 1
                  }}
                >
                  <p className="text-base md:text-lg font-display font-bold text-red-500 tracking-wide whitespace-nowrap">
                    {notification.text}
                  </p>
                </div>
              );
            })}
          </>
        </div>
      </div>
    </section>
  );
};

export default ScrollytellingSection;