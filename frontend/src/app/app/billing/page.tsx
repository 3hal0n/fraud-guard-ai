import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

export default function BillingPage() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & Plan Management</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing details
          </p>
        </div>

        {/* Current plan card */}
        <div className="glass-card p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium">
                Free Plan
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Daily Usage</p>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-bold">3 / 5</span>
                <span className="text-muted-foreground mb-1">checks used today</span>
              </div>
              <div className="w-full h-2 rounded-full bg-accent overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: "60%",
                    background: "linear-gradient(90deg, hsl(var(--primary)), hsl(174 60% 40%))",
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
              <Check className="w-4 h-4 text-primary" />
              <span>5 daily fraud checks</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              <span>Basic support</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              <span>Standard accuracy model</span>
            </div>
          </div>
        </div>

        {/* Upgrade section */}
        <div className="glass-card p-8 border-primary/50">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
              <p className="text-muted-foreground">
                Unlock unlimited fraud checks and advanced features
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">$29</p>
              <p className="text-sm text-muted-foreground">per month</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-1">Unlimited fraud checks</p>
                <p className="text-sm text-muted-foreground">
                  No daily limits, scan as many transactions as you need
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-1">Advanced analytics dashboard</p>
                <p className="text-sm text-muted-foreground">
                  Detailed insights and reporting tools
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-1">Priority support</p>
                <p className="text-sm text-muted-foreground">
                  24/7 dedicated support team
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-1">Custom risk thresholds</p>
                <p className="text-sm text-muted-foreground">
                  Configure detection sensitivity
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-1">Full API access</p>
                <p className="text-sm text-muted-foreground">
                  Integrate with your systems
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-1">Webhook integrations</p>
                <p className="text-sm text-muted-foreground">
                  Real-time notifications
                </p>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full md:w-auto px-12">
            Upgrade to Pro – $29/month
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Cancel anytime. No long-term contracts. Billed monthly.
          </p>
        </div>

        {/* Payment method placeholder */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <p className="text-muted-foreground mb-6">
            No payment method on file. Add a payment method to upgrade to Pro.
          </p>
          <Button variant="outline">Add Payment Method</Button>
        </div>
      </div>
    </AppLayout>
  );
}
