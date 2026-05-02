"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import AppLayout from "@/components/AppLayout";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  ApiError,
  BillingOverview,
  createCheckoutSession,
  getBillingOverview,
  getUserInfo,
  pingBackend,
  UserInfo,
} from "@/lib/api";

export default function BillingPage() {
  const [upgradeState, setUpgradeState] = useState<string | null>(null);
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  let user: { id?: string } | null = null;
  if (clerkEnabled) {
    const u = useUser();
    user = u?.user ?? null;
  }

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [billing, setBilling] = useState<BillingOverview | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setUpgradeState(params.get("upgrade"));
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setLoadingInfo(false);
      return;
    }

    void pingBackend().catch(() => {
      // Best-effort warm-up for Render cold starts; checkout still proceeds.
    });

    Promise.all([getUserInfo(user.id), getBillingOverview(user.id)])
      .then(([info, overview]) => {
        setUserInfo(info);
        setBilling(overview);
      })
      .catch(() => setApiError("Failed to load billing profile."))
      .finally(() => setLoadingInfo(false));
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || upgradeState !== "success") return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 8;

    const pollUntilPro = async () => {
      attempts += 1;
      try {
        const [info, overview] = await Promise.all([
          getUserInfo(user.id as string),
          getBillingOverview(user.id as string),
        ]);

        if (cancelled) return;
        setUserInfo(info);
        setBilling(overview);

        if ((info.plan || "FREE").toUpperCase() === "PRO") {
          setApiError(null);
          return;
        }
      } catch {
        // ignore transient polling errors
      }

      if (!cancelled && attempts < maxAttempts) {
        setTimeout(pollUntilPro, 2000);
      }
    };

    pollUntilPro();
    return () => {
      cancelled = true;
    };
  }, [user?.id, upgradeState]);

  const currentPlan = useMemo<"free" | "pro">(() => {
    if (((billing?.plan || userInfo?.plan || "FREE").toUpperCase() === "PRO")) return "pro";
    return "free";
  }, [billing?.plan, userInfo?.plan]);

  const usedChecks = userInfo?.daily_usage ?? 0;
  const maxChecks = userInfo?.daily_limit ?? 5;
  const usagePercentage = maxChecks > 0 ? (usedChecks / maxChecks) * 100 : 0;
  const nextPaymentAt = billing?.subscription?.next_payment_at;

  const formattedNextPayment = useMemo(() => {
    if (!nextPaymentAt) return "Not scheduled";
    const dt = new Date(nextPaymentAt);
    if (Number.isNaN(dt.getTime())) return "Not scheduled";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(dt);
  }, [nextPaymentAt]);

  const billingHistory = billing?.history || [];

  const handleUpgrade = async () => {
    if (!user?.id) {
      setApiError("You must be signed in to upgrade.");
      return;
    }

    setApiError(null);
    setIsRedirecting(true);
    try {
      await pingBackend().catch(() => {
        // Continue even if the warm-up ping fails; checkout may still succeed.
      });
      const { checkout_url } = await createCheckoutSession(user.id);
      if (!checkout_url) {
        throw new Error("Missing checkout URL from server.");
      }
      window.location.href = checkout_url;
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setApiError(apiErr.detail || "Failed to start checkout session.");
      setIsRedirecting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-medium text-white mb-2 tracking-tight">Billing & Plans</h1>
          <p className="text-slate-400">Manage your subscription and API usage.</p>
          {upgradeState === "success" && (
            <p className="mt-3 text-sm text-cyan-400">Payment successful. Syncing your subscription status...</p>
          )}
          {upgradeState === "cancel" && (
            <p className="mt-3 text-sm text-amber-400">Checkout was canceled. You can retry anytime.</p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Current Plan Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-lg font-medium text-white mb-1">Active Subscription</h2>
                <p className="text-sm text-slate-500">{currentPlan === "free" ? "Developer Tier" : "Pro Scale Tier"}</p>
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-md">
                <span className="text-[10px] font-bold text-white tracking-wider uppercase">Active</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-5 bg-[#121214] rounded-2xl border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Cost</p>
                <p className="text-2xl font-light text-white">${currentPlan === "free" ? "0" : "29"}<span className="text-sm text-slate-600">/mo</span></p>
              </div>
              <div className="p-5 bg-[#121214] rounded-2xl border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Limit</p>
                <p className="text-2xl font-light text-white">{currentPlan === "free" ? "5" : "Unlimited"}<span className="text-sm text-slate-600">{currentPlan === "free" ? "/day" : ""}</span></p>
              </div>
              <div className="p-5 bg-[#121214] rounded-2xl border border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Support</p>
                <p className="text-2xl font-light text-white">{currentPlan === "free" ? "Basic" : "Priority"}</p>
              </div>
            </div>

            {currentPlan === "pro" && (
              <div className="bg-[#121214] p-5 rounded-2xl border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Next Payment</span>
                  <span className="text-sm font-medium text-cyan-300">{formattedNextPayment}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Subscription status: {(billing?.subscription?.status || "inactive").replace("_", " ")}
                </p>
              </div>
            )}

            {currentPlan === "free" && (
              <div className="bg-[#121214] p-5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Today&apos;s API Usage</span>
                  <span className="text-sm font-medium text-white">{loadingInfo ? "-" : `${usedChecks} / ${maxChecks}`}</span>
                </div>
                <div className="relative w-full h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500" style={{ width: `${Math.min(usagePercentage, 100)}%` }} />
                </div>
              </div>
            )}
          </motion.div>

          {/* Upgrade Card */}
          {currentPlan === "free" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0A0A0A] border border-cyan-500/30 rounded-[2rem] p-8 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 mb-8">
                <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
                  <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">Upgrade Recommended</span>
                </div>
                <h3 className="text-2xl font-medium text-white mb-2">Pro Scale</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-light text-cyan-400">$29</span>
                  <span className="text-slate-500">/ month</span>
                </div>
                <p className="text-sm text-slate-400">Unlock production capacity.</p>
              </div>

              <ul className="relative z-10 space-y-3 mb-8 flex-1">
                {["Unlimited API Checks", "Dashboard Analytics", "Priority Support", "Webhooks & Alerts"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleUpgrade}
                disabled={isRedirecting || loadingInfo}
                className="relative z-10 w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRedirecting ? "Redirecting..." : "Upgrade to Pro"}
              </button>
              {apiError && <p className="relative z-10 text-red-400 text-xs mt-3">{apiError}</p>}
            </motion.div>
          )}
        </div>

        {/* Billing History (Dark style table replacement) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8">
          <h2 className="text-lg font-medium text-white mb-6">Billing History</h2>
          
          {billingHistory.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
              <p className="text-slate-500 text-sm">No billing records yet. Completed Stripe payments will appear here.</p>
            </div>
          ) : (
             <div className="space-y-3">
              {billingHistory.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4 bg-[#121214] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">{inv.invoice_id || `PAY-${inv.id}`}</p>
                    <p className="text-xs text-slate-500">{new Date(inv.paid_at || inv.created_at || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{new Intl.NumberFormat("en-US", { style: "currency", currency: (inv.currency || "USD").toUpperCase() }).format(inv.amount)}</p>
                      <p className={`text-xs ${(inv.status || "").toLowerCase() === "paid" ? "text-cyan-400" : "text-amber-400"}`}>{inv.status}</p>
                    </div>
                  </div>
                </div>
              ))}
             </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}