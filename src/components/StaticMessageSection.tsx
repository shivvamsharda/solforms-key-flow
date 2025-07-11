const StaticMessageSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Email is full of your personal data
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed">
            Forms built on email aren't private. They're just convenient surveillance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StaticMessageSection;