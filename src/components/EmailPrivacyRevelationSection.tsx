const EmailPrivacyRevelationSection = () => {
  return (
    <div 
      id="email-privacy-revelation"
      className="relative min-h-screen bg-black flex items-center justify-center px-8 py-16"
    >
      {/* Gradient background container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Rounded container with gradient border effect */}
        <div className="relative p-12 md:p-16 lg:p-20 rounded-3xl bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black border border-blue-500/20 backdrop-blur-sm">
          {/* Inner gradient background */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-radial from-blue-500/5 via-purple-500/5 to-transparent"></div>
          
          {/* Content */}
          <div className="relative text-center">
            <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-medium leading-relaxed text-gray-200">
              Unlike Big Tech form platforms like{" "}
              <span className="inline-flex items-center gap-1">
                Google Forms <span className="text-yellow-400 text-lg">🟨</span>
              </span>
              ,{" "}
              <span className="inline-flex items-center gap-1">
                Microsoft Forms <span className="text-blue-400 text-lg">🟦</span>
              </span>
              , and{" "}
              <span className="inline-flex items-center gap-1">
                Typeform <span className="text-orange-400 text-lg">🟧</span>
              </span>
              ,<br className="hidden md:block" />
              <span className="inline-flex items-center gap-2 font-bold text-green-400">
                <span className="text-green-400 text-lg">🟩</span>
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