import { useEffect, useState } from "react";

const EmailPrivacyRevelationSection = () => {
  const [currentSection, setCurrentSection] = useState(0);

  const revelations = [
    "Email forms were never meant for privacy.",
    "They track who fills them.",
    "They log your IP, location, device ID.",
    "They can be changed without your knowledge.",
    "They're centralized, unverified, and censorable.",
    "They aren't trustless. They aren't sovereign.",
    "Email forms are surveillance disguised as convenience."
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionHeight = windowHeight;
      
      // Find the start of this component (after other sections)
      const componentStart = document.getElementById('email-privacy-revelation')?.offsetTop || 0;
      const relativeScroll = scrollTop - componentStart;
      
      if (relativeScroll >= 0) {
        const sectionIndex = Math.floor(relativeScroll / sectionHeight);
        const clampedIndex = Math.max(0, Math.min(sectionIndex, revelations.length - 1));
        setCurrentSection(clampedIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [revelations.length]);

  return (
    <div 
      id="email-privacy-revelation"
      className="relative bg-gradient-to-b from-black via-gray-900 to-black"
      style={{ height: `${revelations.length * 100}vh` }}
    >
      {revelations.map((text, index) => (
        <div
          key={index}
          className="sticky top-0 h-screen flex items-center justify-center px-8"
          style={{
            zIndex: revelations.length - index,
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className={`
                text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                font-display font-black text-white 
                leading-tight tracking-tight
                transition-all duration-1000 ease-out
                ${currentSection === index 
                  ? 'opacity-100 translate-y-0' 
                  : currentSection > index 
                    ? 'opacity-20 -translate-y-8' 
                    : 'opacity-0 translate-y-8'
                }
              `}
            >
              {text}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailPrivacyRevelationSection;