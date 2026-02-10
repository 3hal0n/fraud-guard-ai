import { Shield, Zap, Lock } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "99% Accuracy ML Model",
      description: "State-of-the-art machine learning trained on millions of transactions.",
    },
    {
      icon: Zap,
      title: "Sub-second Latency",
      description: "Real-time fraud detection with response times under 100ms.",
    },
    {
      icon: Lock,
      title: "Bank-Grade Security",
      description: "SOC 2 compliant infrastructure with end-to-end encryption.",
    },
  ];

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade Fraud Detection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted by financial institutions to protect billions in transactions.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-8 hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
