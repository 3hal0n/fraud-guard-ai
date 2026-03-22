"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import AppLayout from "@/components/AppLayout";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ApiError, generateUserApiKey, getUserApiKey, getUserInfo, UserInfo } from "@/lib/api";
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
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    Promise.all([getUserInfo(user.id), getUserApiKey(user.id)])
      .then(([info, keyInfo]) => {
        setUserInfo(info);
        setApiKey(keyInfo.api_key);
      })
      .catch((err: unknown) => {
        const apiErr = err as ApiError;
        setError(apiErr.detail || "Failed to load API Hub details.");
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Allow accessing Pro features during development/testing. Set
  // NEXT_PUBLIC_ALLOW_PRO_TEST=1 to force enabling in other environments.
  const allowProForTesting =
    process.env.NEXT_PUBLIC_ALLOW_PRO_TEST === "1" || process.env.NODE_ENV !== "production";
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

  const onGenerate = async () => {
    if (!user?.id) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await generateUserApiKey(user.id);
      setApiKey(res.api_key);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.detail || "Could not generate API key.");
    } finally {
      setGenerating(false);
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
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Current API Key</p>
                  <p className="font-mono text-sm text-cyan-300 break-all">{apiKey || "No key generated yet."}</p>
                </div>
                <div className="flex gap-3">
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

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
                <h3 className="text-white font-medium mb-3">cURL</h3>
                <pre className="text-xs text-slate-300 bg-[#121214] border border-white/5 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">{curlSnippet}</pre>
              </div>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
                <h3 className="text-white font-medium mb-3">Python</h3>
                <pre className="text-xs text-slate-300 bg-[#121214] border border-white/5 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">{pythonSnippet}</pre>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
