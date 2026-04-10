"use client";

import AppLayout from "@/components/AppLayout";
import { BACKEND_BASE_URL } from "@/lib/api";

const authHeaders = `X-API-Key: <your_api_key>
Content-Type: application/json`;

const singleAnalyzeCurl = `curl -X POST "{BASE_URL}/api/v1/analyze" \
  -H "X-API-Key: <your_api_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 199.99,
    "merchant": "electronics",
    "location": "Colombo, Sri Lanka",
    "time": "2026-04-09 10:30"
  }'`;

const singleAnalyzePython = `import requests

base_url = "{BASE_URL}"
payload = {
    "amount": 199.99,
    "merchant": "electronics",
    "location": "Colombo, Sri Lanka",
    "time": "2026-04-09 10:30",
}

response = requests.post(
    f"{base_url}/api/v1/analyze",
    headers={"X-API-Key": "<your_api_key>", "Content-Type": "application/json"},
    json=payload,
    timeout=15,
)
print(response.status_code)
print(response.json())`;

const singleAnalyzeFetch = `const response = await fetch("{BASE_URL}/api/v1/analyze", {
  method: "POST",
  headers: {
    "X-API-Key": "<your_api_key>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    amount: 199.99,
    merchant: "electronics",
    location: "Colombo, Sri Lanka",
    time: "2026-04-09 10:30",
  }),
});

const data = await response.json();
console.log(data);`;

const bulkUploadCurl = `curl -X POST "{BASE_URL}/api/v1/analyze/bulk-csv" \
  -H "X-API-Key: <your_api_key>" \
  -F "user_id=<user_id>" \
  -F "file=@transactions.csv;type=text/csv"`;

const responseShape = `{
  "transaction_id": "uuid",
  "status": "safe | risk",
  "risk_score": 0.0,
  "confidence": 0.0,
  "model_version": "string",
  "explanation": {
    "top_features": ["merchant", "amount", "location"]
  }
}`;

export default function ApiDocsPage() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">API Documentation</h1>
          <p className="text-slate-400 max-w-3xl">This page covers the public transaction scoring API, authentication, response shape, bulk uploads, and common error handling. Use the dashboard API Hub for key generation and live testing.</p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Base URL</div>
            <div className="text-sm text-white">{BACKEND_BASE_URL}</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Auth</div>
            <div className="text-sm text-white whitespace-pre-wrap">{authHeaders}</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Rate limits</div>
            <div className="text-sm text-white">Plan-based limits apply. Use batch scoring where possible to reduce request volume.</div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Single transaction scoring</h2>
            <p className="text-slate-400">POST a JSON payload to receive a fraud decision, score, and explanation.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <pre className="bg-[#0B0D10] text-slate-300 rounded-2xl p-4 text-sm overflow-x-auto whitespace-pre-wrap">{singleAnalyzeCurl}</pre>
            <pre className="bg-[#0B0D10] text-slate-300 rounded-2xl p-4 text-sm overflow-x-auto whitespace-pre-wrap">{singleAnalyzePython}</pre>
          </div>
          <pre className="bg-[#0B0D10] text-slate-300 rounded-2xl p-4 text-sm overflow-x-auto whitespace-pre-wrap">{singleAnalyzeFetch}</pre>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Bulk CSV upload</h2>
            <p className="text-slate-400">For Pro users, upload a CSV file to score multiple transactions in a single request.</p>
          </div>
          <pre className="bg-[#0B0D10] text-slate-300 rounded-2xl p-4 text-sm overflow-x-auto whitespace-pre-wrap">{bulkUploadCurl}</pre>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-3">Response shape</h3>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap overflow-x-auto">{responseShape}</pre>
          </div>
          <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-3">Common errors</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><strong>401</strong> - Missing or invalid API key.</li>
              <li><strong>403</strong> - Plan does not allow the requested operation.</li>
              <li><strong>422</strong> - Invalid or incomplete request payload.</li>
              <li><strong>500</strong> - Unexpected server or model error.</li>
            </ul>
          </div>
        </section>

        <section className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-3">Integration notes</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Store the API key in environment variables, never in client-side source.</li>
            <li>Use Clerk for dashboard authentication and Stripe for billing; both are separate from request signing.</li>
            <li>For location-based scoring, send city or country strings such as Colombo, Sri Lanka or Negombo, Sri Lanka.</li>
            <li>Keep request payloads small and consistent to reduce latency and improve model throughput.</li>
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
