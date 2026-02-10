import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free Starter",
      price: "$0",
      period: "month",
      description: "Perfect for testing and small-scale projects",
      features: [
        "5 daily fraud checks",
        "Basic support",
        "Standard accuracy model",
        "Email notifications",
      ],
      cta: "Sign Up Free",
      highlighted: false,
    },
    {
      name: "Pro Scale",
      price: "$29",
      period: "month",
      description: "For teams and growing businesses",
      features: [
        "Unlimited fraud checks",
        "Advanced analytics dashboard",
        "Priority support",
        "Custom risk thresholds",
        "API access",
        "Webhook integrations",
      ],
      cta: "Upgrade Now",
      highlighted: true,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees or surprises.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`glass-card p-8 ${
                  plan.highlighted
                    ? "border-primary/50 shadow-lg shadow-primary/5"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium mb-4">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                </div>

                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                  className="w-full mb-8"
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
