"use client";

import AppLayout from "@/components/AppLayout";

export default function PricingPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-4">Pricing</h1>
        <p className="text-slate-400 mb-6">Simple, transparent pricing for startups and enterprises. Contact sales for custom plans.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0A0A0A] rounded-lg border border-white/5">
            <h3 className="text-lg font-medium text-white mb-2">Developer</h3>
            <p className="text-slate-400 mb-4">Free for evaluation. Basic scoring and dashboard.</p>
            <div className="text-3xl font-bold text-white">Free</div>
          </div>

          <div className="p-6 bg-[#0A0A0A] rounded-lg border border-white/5">
            <h3 className="text-lg font-medium text-white mb-2">Pro</h3>
            <p className="text-slate-400 mb-4">Realtime API, API keys, and bulk audit features.</p>
            <div className="text-3xl font-bold text-white">$99 / month</div>
          </div>

          <div className="p-6 bg-[#0A0A0A] rounded-lg border border-white/5">
            <h3 className="text-lg font-medium text-white mb-2">Enterprise</h3>
            <p className="text-slate-400 mb-4">SLA, dedicated support, and custom integrations.</p>
            <div className="text-3xl font-bold text-white">Contact us</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
