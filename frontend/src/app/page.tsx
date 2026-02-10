import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-navy-950" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-foreground">FraudGuard AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-slate-500 hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-navy-950 rounded-lg font-medium text-sm transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="grid grid-cols-8 grid-rows-8 gap-px opacity-10">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-slate-700/30"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
            Stop Transaction Fraud
            <br />
            <span className="text-teal-400">in Real Time with AI</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Real-time AI-powered fraud detection with sub-second decisions.
            Protect your platform with enterprise-grade machine learning that never sleeps.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-navy-950 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-105"
            >
              Start Free Trial
            </Link>
            <button className="px-8 py-4 bg-transparent hover:bg-navy-800 text-foreground border border-slate-700 rounded-lg font-semibold text-lg transition-all">
              View Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass rounded-2xl p-8 hover:bg-navy-800/50 transition-all">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">99% Accuracy ML Model</h3>
              <p className="text-slate-500 leading-relaxed">
                Trained on millions of transactions with continuous learning to adapt to evolving fraud patterns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-2xl p-8 hover:bg-navy-800/50 transition-all">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Sub-second Latency</h3>
              <p className="text-slate-500 leading-relaxed">
                Real-time fraud detection with &lt;200ms response time. Never slow down your checkout flow.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-2xl p-8 hover:bg-navy-800/50 transition-all">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Bank-Grade Security</h3>
              <p className="text-slate-500 leading-relaxed">
                SOC 2 Type II compliant with end-to-end encryption. Your data is always protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-500 text-lg">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Starter Plan */}
            <div className="glass rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-foreground mb-2">Free Starter</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground">$0</span>
                  <span className="text-slate-500">/ month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-400">5 Daily Checks</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-400">Basic Support</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-400">Email Support</span>
                </li>
              </ul>

              <Link
                href="/signup"
                className="block w-full px-6 py-3 bg-navy-800 hover:bg-navy-700 text-foreground rounded-lg font-semibold text-center transition-all"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Pro Scale Plan */}
            <div className="glass rounded-2xl p-8 ring-2 ring-teal-500/50 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-teal-500 text-navy-950 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-foreground mb-2">Pro Scale</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-teal-400">$29</span>
                  <span className="text-slate-500">/ month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground font-medium">Unlimited Checks</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground font-medium">Advanced Analytics Dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground font-medium">Priority Support</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-foreground font-medium">Custom Alerts</span>
                </li>
              </ul>

              <Link
                href="/signup?plan=pro"
                className="block w-full px-6 py-3 bg-teal-500 hover:bg-teal-600 text-navy-950 rounded-lg font-semibold text-center transition-all shadow-lg shadow-teal-500/30"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto text-center text-slate-500 text-sm">
          <p>&copy; 2026 FraudGuard AI. All rights reserved. SOC 2 Type II Compliant.</p>
        </div>
      </footer>
    </div>
  );
}
