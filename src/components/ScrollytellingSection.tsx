import { useEffect, useState, useRef } from "react";
import { Eye, Mail, Shield, Network, AlertTriangle } from "lucide-react";

const ScrollytellingSection = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const frames = [
    {
      text: "Tracking pixels know when you open mail.",
      icon: Eye,
      animation: "eye-flicker",
      background: "bg-black"
    },
    {
      text: "Phishing links steal your identity.",
      icon: Shield,
      animation: "red-pulse",
      background: "bg-black animate-red-pulse"
    },
    {
      text: "Your inbox is a honeypot for attackers.",
      icon: Mail,
      animation: "fragment",
      background: "bg-black"
    },
    {
      text: "Metadata exposes who you talk to — and when.",
      icon: Network,
      animation: "network-pulse",
      background: "bg-black"
    },
    {
      text: "Password resets. Breach portals. Surveillance defaults.",
      icon: AlertTriangle,
      animation: "text-glitch",
      background: "bg-black"
    },
    {
      text: "Forms built on email aren't private. They're just convenient surveillance.",
      icon: null,
      animation: "ambient-glow",
      background: "bg-black",
      isFinal: true
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const frameHeight = sectionHeight / frames.length;
      
      // Check if section is in viewport
      const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
      setIsActive(isInViewport);

      if (isInViewport) {
        // Calculate which frame should be active
        const scrollProgress = Math.abs(rect.top);
        const frameIndex = Math.floor(scrollProgress / frameHeight);
        const clampedIndex = Math.max(0, Math.min(frameIndex, frames.length - 1));
        setCurrentFrame(clampedIndex);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [frames.length]);

  const currentFrameData = frames[currentFrame];

  return (
    <section 
      ref={sectionRef}
      className={`relative transition-all duration-1000 ${currentFrameData.background}`}
      style={{ height: `${frames.length * 100}vh` }}
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-6xl mx-auto px-6 text-center">
          {/* Background Effects */}
          {currentFrame === 1 && (
            <div className="absolute inset-0 opacity-20">
              <div className="w-64 h-32 mx-auto mt-32 border border-destructive/50 rounded-lg animate-text-glitch">
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-destructive/30 rounded animate-pulse"></div>
                  <div className="h-4 bg-destructive/30 rounded animate-pulse delay-100"></div>
                </div>
              </div>
            </div>
          )}
          
          {currentFrame === 3 && (
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 800 600">
                <g className="animate-network-pulse">
                  <circle cx="200" cy="150" r="4" fill="hsl(var(--destructive))" />
                  <circle cx="400" cy="100" r="4" fill="hsl(var(--destructive))" />
                  <circle cx="600" cy="200" r="4" fill="hsl(var(--destructive))" />
                  <circle cx="300" cy="300" r="4" fill="hsl(var(--destructive))" />
                  <circle cx="500" cy="350" r="4" fill="hsl(var(--destructive))" />
                  <line x1="200" y1="150" x2="400" y2="100" stroke="hsl(var(--destructive))" strokeWidth="1" />
                  <line x1="400" y1="100" x2="600" y2="200" stroke="hsl(var(--destructive))" strokeWidth="1" />
                  <line x1="300" y1="300" x2="500" y2="350" stroke="hsl(var(--destructive))" strokeWidth="1" />
                  <line x1="200" y1="150" x2="300" y2="300" stroke="hsl(var(--destructive))" strokeWidth="1" />
                </g>
              </svg>
            </div>
          )}

          {/* Main Heading - Persistent */}
          {!currentFrameData.isFinal && (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
              Email is full of your personal data
            </h1>
          )}

          {/* Icon */}
          {currentFrameData.icon && (
            <div className="mb-8">
              <currentFrameData.icon 
                className={`w-16 h-16 mx-auto text-destructive ${
                  currentFrame === 0 ? 'animate-eye-flicker' :
                  currentFrame === 2 ? 'animate-fragment' :
                  ''
                }`} 
              />
            </div>
          )}

          {/* Frame-Specific Text */}
          <h2 
            className={`text-2xl md:text-4xl lg:text-5xl font-bold text-foreground/90 leading-tight ${
              currentFrame === 4 ? 'animate-text-glitch' : ''
            } ${
              currentFrameData.isFinal ? 'animate-ambient-glow text-4xl md:text-6xl lg:text-7xl text-foreground' : ''
            }`}
          >
            {currentFrameData.text}
          </h2>

          {/* Ambient effects for final frame */}
          {currentFrameData.isFinal && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-destructive/10 rounded-full blur-3xl animate-ambient-glow"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScrollytellingSection;