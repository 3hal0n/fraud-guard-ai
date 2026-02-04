import AppLayout from "@/components/app/AppLayout";
import { Shield, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Good afternoon, Alex.</h1>
          <p className="text-muted-foreground">
            Here's your fraud detection overview for today.
          </p>
        </div>

        {/* Usage tracker card */}
        <div className="glass-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Daily Usage</h3>
              <p className="text-sm text-muted-foreground">
                Track your fraud check quota
              </p>
            </div>
            <Link href="/app/billing">
              <Button variant="outline" size="sm">
                Upgrade to Pro
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">3 / 5</span>
              <span className="text-sm text-muted-foreground">Free Checks Used Today</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-accent overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: "60%",
                  background: "linear-gradient(90deg, hsl(var(--primary)), hsl(174 60% 40%))",
                }}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Resets daily at midnight UTC. Upgrade to Pro for unlimited checks.
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Total Scans</h3>
            </div>
            <p className="text-3xl font-bold mb-1">47</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-destructive/15 border border-destructive/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-semibold">At-Risk Detected</h3>
            </div>
            <p className="text-3xl font-bold mb-1">3</p>
            <p className="text-sm text-muted-foreground">High-risk transactions</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent border border-border flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Accuracy Rate</h3>
            </div>
            <p className="text-3xl font-bold mb-1">99.2%</p>
            <p className="text-sm text-muted-foreground">Model performance</p>
          </div>
        </div>

        {/* Quick action CTA */}
        <div className="glass-card p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Run a New Analysis</h3>
          <p className="text-muted-foreground mb-6">
            Check a transaction for fraud risk in real-time
          </p>
          <Link href="/app/analyze">
            <Button size="lg">
              Analyze Transaction
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
