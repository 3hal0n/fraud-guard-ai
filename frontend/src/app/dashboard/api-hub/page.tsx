"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import AppLayout from "@/components/AppLayout";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  ApiError,
  ApiKeyItem,
  generateUserApiKey,
  getUserApiKey,
  getUserInfo,
  listUserApiKeys,
  revokeUserApiKey,
  UserInfo,
} from "@/lib/api";
import { motion } from "framer-motion";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export default function ApiHubPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  let user: { id?: string } | null = null;
  if (clerkEnabled) {
    const u = useUser();
    user = u?.user ?? null;
  }

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Default");
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revokingId, setRevokingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadApiKeys = async (userId: string) => {
    const keyList = await listUserApiKeys(userId);
    setKeys(keyList.keys || []);
  };

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    Promise.all([getUserInfo(user.id), getUserApiKey(user.id), listUserApiKeys(user.id)])
      .then(([info, keyInfo, keyList]) => {
        setUserInfo(info);
        setApiKey(keyInfo.api_key);
        setKeys(keyList.keys || []);
      })
      .catch((err: unknown) => {
        const apiErr = err as ApiError;
        setError(apiErr.detail || "Failed to load API Hub details.");
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Allow accessing Pro features during development/testing. Set
  // NEXT_PUBLIC_ALLOW_PRO_TEST=1 to force enabling in other environments.
  const allowProForTesting = process.env.NEXT_PUBLIC_ALLOW_PRO_TEST === "1";
  const isPro = userInfo?.plan === "PRO" || allowProForTesting;

  const curlSnippet = useMemo(() => {
    const key = apiKey || "<YOUR_API_KEY>";
    return `curl -X POST "${backendUrl}/api/v1/analyze" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${key}" \\
  -d '{
    "amount": 199.99,
    "merchant": "electronics",
    "location": "Austin",
    "time": "2026-03-22 10:30"
  }'`;
  }, [apiKey]);
  const pythonSnippet = useMemo(() => {
    const key = apiKey || "<YOUR_API_KEY>";
    return `import requests

url = "${backendUrl}/api/v1/analyze"
headers = {
  "Content-Type": "application/json",
  "X-API-Key": "${key}",
}
payload = {
  "amount": 199.99,
  "merchant": "electronics",
  "location": "Austin",
  "time": "2026-03-22 10:30",
}

response = requests.post(url, headers=headers, json=payload, timeout=15)
print(response.status_code)
print(response.json())`;
  }, [apiKey]);

  const jsFetchSnippet = useMemo(() => {
    const key = apiKey || "<YOUR_API_KEY>";
    return `const url = "${backendUrl}/api/v1/analyze";
const payload = {
  amount: 199.99,
  merchant: "electronics",
  location: "Austin",
  time: "2026-03-22 10:30",
};

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "${key}",
  },
  body: JSON.stringify(payload),
})
.then((r) => r.json())
.then(console.log)
.catch(console.error);`;
  }, [apiKey]);

  const axiosSnippet = useMemo(() => {
    const key = apiKey || "<YOUR_API_KEY>";
    return `import axios from "axios";

const url = "${backendUrl}/api/v1/analyze";
const payload = { amount: 199.99, merchant: "electronics", location: "Austin", time: "2026-03-22 10:30" };

axios.post(url, payload, { headers: { "X-API-Key": "${key}", "Content-Type": "application/json" } })
  .then(res => console.log(res.data))
  .catch(err => console.error(err));`;
  }, [apiKey]);

  const bulkCsvCurlSnippet = useMemo(() => {
    const key = apiKey || "<YOUR_API_KEY>";
    return `curl -X POST "${backendUrl}/api/v1/analyze/bulk-csv" \\
  -H "X-API-Key: ${key}" \\
  -F "user_id=YOUR_USER_ID" \\
  -F "file=@transactions.csv;type=text/csv"`;
  }, [apiKey]);

  const postmanNotes = useMemo(() => {
    return `To import into Postman: use the cURL snippet (top-left) and in Postman choose Import → Raw text → paste the cURL command.\n\nSet header "X-API-Key" with your key. For bulk uploads, use the Bulk CSV endpoint and set form-data with keys: user_id (string) and file (file).`;
  }, []);

  const onGenerate = async () => {
    if (!user?.id) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await generateUserApiKey(user.id, projectName.trim() || "Default");
      setApiKey(res.api_key);
      await loadApiKeys(user.id);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.detail || "Could not generate API key.");
    } finally {
      setGenerating(false);
    }
  };

  const onRevoke = async (keyId: number) => {
    if (!user?.id) return;
    setRevokingId(keyId);
    setError(null);
    try {
      await revokeUserApiKey(user.id, keyId);
      await loadApiKeys(user.id);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.detail || "Could not revoke API key.");
    } finally {
      setRevokingId(null);
    }
  };

  const onCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-medium text-white mb-2 tracking-tight">Developer API Hub</h1>
          <p className="text-slate-400">Generate your key and call the FastAPI endpoint directly from your code.</p>
        </motion.div>

        {loading ? (
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 text-slate-400">Loading API Hub...</div>
        ) : !isPro ? (
          <div className="bg-[#0A0A0A] border border-cyan-500/30 rounded-3xl p-8">
            <h2 className="text-white text-xl font-medium mb-2">Pro Feature</h2>
            <p className="text-slate-400 mb-5">API key generation is available only on the PRO plan.</p>
            <a href="/dashboard/billing" className="inline-flex px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors">
              Upgrade To PRO
            </a>
          </div>
        ) : (
          <>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Newly Generated API Key (shown once)</p>
                  <p className="font-mono text-sm text-cyan-300 break-all">{apiKey || "Generate a key to reveal it once."}</p>
                  <p className="text-xs text-slate-500 mt-2">Stored securely as hash. You cannot retrieve full key again later.</p>
                </div>
                <div className="flex gap-3">
                  <input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project name"
                    className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  />
                  <button
                    onClick={onGenerate}
                    disabled={generating}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors disabled:opacity-60"
                  >
                    {generating ? "Generating..." : "Generate API Key"}
                  </button>
                  <button
                    onClick={onCopy}
                    disabled={!apiKey}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
              <h3 className="text-white font-medium mb-3">Project API Keys</h3>
              {keys.length === 0 ? (
                <p className="text-slate-400 text-sm">No keys yet.</p>
              ) : (
                <div className="space-y-3">
                  {keys.map((k) => (
                    <div key={k.id} className="border border-white/10 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-white text-sm font-medium">{k.project_name}</p>
                        <p className="text-cyan-300 font-mono text-xs">{k.key_prefix}...{k.is_active ? " (active)" : " (revoked)"}</p>
                        <p className="text-slate-500 text-xs">Last used: {k.last_used_at || "never"}</p>
                      </div>
                      {k.is_active ? (
                        <button
                          onClick={() => onRevoke(k.id)}
                          disabled={revokingId === k.id}
                          className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm disabled:opacity-60"
                        >
                          {revokingId === k.id ? "Revoking..." : "Revoke"}
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-medium">cURL</h3>
                  <button onClick={() => navigator.clipboard.writeText(curlSnippet)} className="text-xs text-slate-400 hover:text-white">Copy</button>
                </div>
                <pre className="text-xs text-slate-300 bg-[#121214] border border-white/5 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">{curlSnippet}</pre>
              </div>

              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-medium">Python</h3>
                  <button onClick={() => navigator.clipboard.writeText(pythonSnippet)} className="text-xs text-slate-400 hover:text-white">Copy</button>
                </div>
                <pre className="text-xs text-slate-300 bg-[#121214] border border-white/5 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">{pythonSnippet}</pre>
              </div>

              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-medium">JavaScript (fetch)</h3>
                  <button onClick={() => navigator.clipboard.writeText(jsFetchSnippet)} className="text-xs text-slate-400 hover:text-white">Copy</button>
                </div>
                <pre className="text-xs text-slate-300 bg-[#121214] border border-white/5 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">{jsFetchSnippet}</pre>
              </div>

              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-medium">Axios (Node/Browser)</h3>
                  <button onClick={() => navigator.clipboard.writeText(axiosSnippet)} className="text-xs text-slate-400 hover:text-white">Copy</button>
                </div>
                <pre className="text-xs text-slate-300 bg-[#121214] border border-white/5 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">{axiosSnippet}</pre>
              </div>

              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-medium">Bulk CSV</h3>
                  <button onClick={() => navigator.clipboard.writeText(bulkCsvCurlSnippet)} className="text-xs text-slate-400 hover:text-white">Copy</button>
                </div>
                <pre className="text-xs text-slate-300 bg-[#121214] border border-white/5 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">{bulkCsvCurlSnippet}</pre>
              </div>

              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 sm:col-span-2 lg:col-span-1">
                <h3 className="text-white font-medium mb-3">Postman / Tips</h3>
                <p className="text-slate-400 text-sm whitespace-pre-wrap">{postmanNotes}</p>
                <hr className="border-white/5 my-4" />
                <h4 className="text-sm text-white font-medium mb-2">Endpoints</h4>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li><strong>/api/v1/analyze</strong> — POST JSON payload to score a single transaction.</li>
                  <li><strong>/api/v1/analyze/bulk-csv</strong> — POST multipart/form-data for CSV bulk audit (PRO only).</li>
                  <li><strong>/api/v1/transactions/:user_id</strong> — GET recent transactions for a user.</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
