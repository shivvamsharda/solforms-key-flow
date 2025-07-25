import { useEffect, useState, useRef } from "react";

interface NotificationPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ScrollytellingSection = () => {
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [notificationPositions, setNotificationPositions] = useState<NotificationPosition[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

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

  // Calculate fixed orbital radius outside the protected solar zone
  const getOrbitalRadius = () => {
    const solarRadius = Math.max(200, containerDimensions.width * 0.15, containerDimensions.height * 0.15);
    const orbitalRadius = solarRadius + 100; // Fixed buffer beyond solar zone
    return Math.min(orbitalRadius, Math.min(containerDimensions.width, containerDimensions.height) * 0.4);
  };

  // Estimate notification dimensions
  const estimateNotificationSize = (text: string) => {
    const baseWidth = text.length * 8;
    const responsiveWidth = Math.max(80, Math.min(200, baseWidth + 40));
    const responsiveHeight = containerDimensions.width < 640 ? 32 : 40;
    return { width: responsiveWidth, height: responsiveHeight };
  };

  // Calculate exact orbital position for each notification (360° distribution)
  const calculateOrbitalPosition = (notificationIndex: number, text: string): NotificationPosition => {
    const centerX = containerDimensions.width / 2;
    const centerY = containerDimensions.height / 2;
    const orbitalRadius = getOrbitalRadius();
    const notificationSize = estimateNotificationSize(text);
    
    // Calculate exact angle for perfect 360° distribution
    const angleIncrement = 360 / notifications.length;
    const angle = notificationIndex * angleIncrement;
    const radian = (angle * Math.PI) / 180;
    
    // Calculate position on the orbital circle
    const x = centerX + Math.cos(radian) * orbitalRadius - notificationSize.width / 2;
    const y = centerY + Math.sin(radian) * orbitalRadius - notificationSize.height / 2;
    
    return {
      x,
      y,
      width: notificationSize.width,
      height: notificationSize.height
    };
  };

  // Update positions when visible notifications change
  useEffect(() => {
    if (containerDimensions.width === 0 || containerDimensions.height === 0) return;
    
    const newPositions: NotificationPosition[] = [];
    
    visibleNotifications.forEach((notificationIndex) => {
      const notification = notifications[notificationIndex];
      const position = calculateOrbitalPosition(notificationIndex, notification.text);
      newPositions[notificationIndex] = position;
    });
    
    setNotificationPositions(newPositions);
  }, [visibleNotifications, containerDimensions, notifications]);

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
            padding: '150px 20px'
          }}
        >
          {/* Main Heading - Always Visible */}
          <div className="text-center relative z-10">
            <h1 
              ref={headlineRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black text-foreground leading-tight tracking-tight max-w-4xl mx-auto"
            >
              Email is full of your personal data
            </h1>
          </div>

          {/* Notification Pop-ups - Collision-free positioning */}
          {visibleNotifications.map((notificationIndex) => {
            const notification = notifications[notificationIndex];
            const position = notificationPositions[notificationIndex];
            
            if (!position) return null;
            
            return (
              <div
                key={notificationIndex}
                className="px-2 py-1 sm:px-3 sm:py-2 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm z-20 absolute"
                style={{
                  left: position.x,
                  top: position.y,
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