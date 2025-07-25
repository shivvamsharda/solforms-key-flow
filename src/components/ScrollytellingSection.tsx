import { useEffect, useState, useRef } from "react";

const ScrollytellingSection = () => {
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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


  // Container resize observer
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width, height });
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      updateDimensions();
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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

  // Dynamic responsive positioning system
  const getResponsiveRadius = () => {
    const baseRadius = Math.min(containerDimensions.width, containerDimensions.height) * 0.25;
    const minRadius = 120;
    const maxRadius = 300;
    return Math.max(minRadius, Math.min(maxRadius, baseRadius));
  };

  // Calculate optimal circular positions with collision avoidance
  const getCircularPosition = (notificationIndex: number) => {
    const totalNotifications = notifications.length;
    const radius = getResponsiveRadius();
    
    // Use golden angle for better distribution
    const goldenAngle = 137.5; // degrees
    const baseAngle = (notificationIndex * goldenAngle) % 360;
    
    // Add slight radius variation for visual interest
    const radiusVariation = 1 + (Math.sin(notificationIndex * 0.5) * 0.2);
    const adjustedRadius = radius * radiusVariation;
    
    // Convert to radians
    const radian = (baseAngle * Math.PI) / 180;
    
    // Calculate position
    const x = Math.cos(radian) * adjustedRadius;
    const y = Math.sin(radian) * adjustedRadius;
    
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
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-visible">
        <div 
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8"
          style={{ 
            minHeight: '100vh',
            padding: `${getResponsiveRadius() + 100}px 20px`
          }}
        >
          {/* Main Heading - Always Visible */}
          <div className="text-center relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black text-foreground leading-tight tracking-tight max-w-4xl mx-auto">
              Email is full of your personal data
            </h1>
          </div>

          {/* Notification Pop-ups - Responsive circular distribution */}
          {visibleNotifications.map((notificationIndex) => {
            const notification = notifications[notificationIndex];
            const position = getCircularPosition(notificationIndex);
            
            return (
              <div
                key={notificationIndex}
                className="px-2 py-1 sm:px-3 sm:py-2 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm z-20"
                style={{
                  ...position,
                  opacity: 1
                }}
              >
                <p className="text-xs sm:text-sm md:text-base font-display font-bold text-red-500 tracking-wide whitespace-nowrap">
                  {notification.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScrollytellingSection;