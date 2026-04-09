"use client";

import AppLayout from "@/components/AppLayout";

export default function ApiDocsPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-4">API Documentation</h1>
        <p className="text-slate-400 mb-6">Public API docs and examples. Developers can use the API Hub inside the dashboard for key management and live testing.</p>

        <section className="mb-6">
          <h2 className="text-xl font-medium text-white mb-2">Endpoint: /api/v1/analyze</h2>
          <pre className="bg-[#0B0D10] text-slate-300 rounded p-4 text-sm">{`POST /api/v1/analyze
      Headers: X-API-Key: <key>
      Content-Type: application/json
      Payload: {"amount": 199.99, "merchant": "electronics", "location": "Colombo, Sri Lanka"}`}</pre>
        </section>
      </div>
    </AppLayout>
  );
}
