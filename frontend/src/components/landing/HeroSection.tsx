import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient orb */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-slate-surface/40 via-accent/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-teal-glow/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Demo badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/50 backdrop-blur-sm mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Book a live demo today</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up delay-100">
            Stop Transaction Fraud{" "}
            <span className="text-gradient-teal">in Real Time</span>{" "}
            with AI.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
            Protect your business with AI-powered fraud detection delivering sub-second decisions and bank-grade security.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up delay-300">
            <Button variant="hero" size="xl" asChild className="w-full sm:w-auto">
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild className="w-full sm:w-auto">
              <Link href="/demo">View Live Demo</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-up delay-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>5 free scans daily</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Setup in under 2 minutes</span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="mt-16 animate-fade-up delay-500">
            <div className="relative mx-auto max-w-5xl">
              <div className="glass-card p-2 rounded-2xl shadow-lg">
                <div className="bg-navy-medium rounded-xl overflow-hidden">
                  {/* Mock dashboard header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-coral-alert/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-primary/60" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 rounded-md bg-background/30 text-xs text-muted-foreground">
                        dashboard.fraudguard.ai
                      </div>
                    </div>
                  </div>
                  {/* Mock dashboard content */}
                  <div className="p-6">
                    <div className="grid grid-cols-12 gap-4">
                      {/* Sidebar mock */}
                      <div className="col-span-3 space-y-3">
                        <div className="h-8 bg-accent/50 rounded-lg w-full" />
                        <div className="h-6 bg-accent/30 rounded-lg w-3/4" />
                        <div className="h-6 bg-accent/30 rounded-lg w-3/4" />
                        <div className="h-6 bg-accent/30 rounded-lg w-3/4" />
                        <div className="h-6 bg-accent/30 rounded-lg w-3/4" />
                      </div>
                      {/* Main content mock */}
                      <div className="col-span-9 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-20 bg-accent/40 rounded-xl" />
                          <div className="h-20 bg-accent/40 rounded-xl" />
                          <div className="h-20 bg-primary/20 rounded-xl border border-primary/30" />
                        </div>
                        <div className="h-40 bg-accent/30 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-t from-primary/5 to-transparent rounded-3xl -z-10 blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
