const EmailPrivacyRevelationSection = () => {
  return (
    <div 
      id="email-privacy-revelation"
      className="relative min-h-screen bg-black flex items-center justify-center px-4 py-20"
    >
      {/* Large gradient background container */}
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Rounded container with enhanced gradient border effect */}
        <div className="relative p-16 md:p-20 lg:p-24 xl:p-28 rounded-3xl bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-black border border-blue-400/30 backdrop-blur-sm shadow-2xl">
          {/* Enhanced inner gradient background */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-radial from-blue-500/10 via-purple-500/8 to-transparent"></div>
          {/* Additional glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
          
          {/* Content */}
          <div className="relative text-center max-w-5xl mx-auto">
            <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-medium leading-[1.4] text-gray-100 tracking-tight">
              Unlike Big Tech form platforms like{" "}
              <span className="text-yellow-400 font-semibold">
                Google Forms 🟨
              </span>
              ,{" "}
              <span className="text-blue-400 font-semibold">
                Microsoft Forms 🟦
              </span>
              , and{" "}
              <span className="text-orange-400 font-semibold">
                Typeform 🟧
              </span>
              ,
              <br className="hidden sm:block" />
              <span className="font-bold text-green-400">
                SolForms
              </span>{" "}
              prioritizes your{" "}
              <span className="font-bold text-green-400">privacy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPrivacyRevelationSection;