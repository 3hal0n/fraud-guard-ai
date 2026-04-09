"use client";

import AppLayout from "@/components/AppLayout";

export default function StatusPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-4">System Status</h1>
        <p className="text-slate-400 mb-6">All Systems Operational</p>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-[#0A0A0A] rounded border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-300">API</div>
              <div className="text-xs text-slate-500">99.9% uptime</div>
            </div>
            <div className="text-green-400 font-semibold">Operational</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
