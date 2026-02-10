"use client";

import AppLayout from "@/components/AppLayout";
import { useState } from "react";

export default function BillingPage() {
  const [currentPlan] = useState<"free" | "pro">("free");
  const usedChecks = 3;
  const maxChecks = 5;
  const usagePercentage = (usedChecks / maxChecks) * 100;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Billing & Plans</h1>
          <p className="text-slate-500">Manage your subscription and usage</p>
        </div>

        {/* Current Plan Card */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Current Plan</h2>
              <p className="text-sm text-slate-500">Your active subscription details</p>
            </div>
            <div className="px-4 py-2 bg-slate-700/30 rounded-full">
              <span className="text-sm font-medium text-slate-400">
                {currentPlan === "free" ? "Free Starter" : "Pro Scale"}
              </span>
            </div>
          </div>

          {/* Plan Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-navy-900 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Monthly Cost</p>
              <p className="text-2xl font-bold text-foreground">
                ${currentPlan === "free" ? "0" : "29"}
                <span className="text-sm text-slate-500 font-normal ml-1">/ month</span>
              </p>
            </div>
            <div className="p-4 bg-navy-900 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Daily Checks</p>
              <p className="text-2xl font-bold text-foreground">
                {currentPlan === "free" ? "5" : "Unlimited"}
              </p>
            </div>
            <div className="p-4 bg-navy-900 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Support Level</p>
              <p className="text-2xl font-bold text-foreground">
                {currentPlan === "free" ? "Basic" : "Priority"}
              </p>
            </div>
          </div>

          {/* Usage Progress */}
          {currentPlan === "free" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Today&apos;s Usage</span>
                <span className="text-sm font-medium text-foreground">
                  {usedChecks} / {maxChecks} checks
                </span>
              </div>
              <div className="relative w-full h-3 bg-navy-900 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Resets daily at midnight UTC</p>
            </div>
          )}

          {currentPlan === "pro" && (
            <div className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/30">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-teal-400">
                  <span className="font-medium">Unlimited checks active</span> — No daily limits
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade Section */}
        {currentPlan === "free" && (
          <div className="glass rounded-2xl p-8 ring-2 ring-teal-500/50 relative overflow-hidden">
            {/* Decorative Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full mb-3">
                    <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-teal-400">Recommended</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Upgrade to Pro Scale</h2>
                  <p className="text-slate-400">Unlock unlimited fraud detection and premium features</p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-teal-400">$29</span>
                    <span className="text-slate-500">/ month</span>
                  </div>
                </div>
              </div>

              {/* Pro Features Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  "Unlimited daily transaction checks",
                  "Advanced analytics dashboard",
                  "Priority email & chat support",
                  "Custom fraud alerts & webhooks",
                  "API access for integrations",
                  "Monthly usage reports",
                  "Dedicated account manager",
                  "99.99% uptime SLA",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className="w-full px-8 py-4 bg-teal-500 hover:bg-teal-600 text-navy-950 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 hover:scale-[1.02]">
                Upgrade to Pro – $29/month
              </button>

              <p className="text-center text-xs text-slate-500 mt-4">
                Cancel anytime. No hidden fees. Billed monthly.
              </p>
            </div>
          </div>
        )}

        {/* Payment Method (Pro Only) */}
        {currentPlan === "pro" && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Payment Method</h2>
            <div className="flex items-center justify-between p-4 bg-navy-900 rounded-lg border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center">
                  <svg className="w-8 h-6" viewBox="0 0 32 20" fill="none">
                    <rect width="32" height="20" rx="4" fill="#1e293b"/>
                    <circle cx="12" cy="10" r="6" fill="#eb001b" opacity="0.8"/>
                    <circle cx="20" cy="10" r="6" fill="#f79e1b" opacity="0.8"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                  <p className="text-sm text-slate-500">Expires 12/2027</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-foreground rounded-lg text-sm font-medium transition-all">
                Update
              </button>
            </div>
          </div>
        )}

        {/* Billing History */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Billing History</h2>
          
          {currentPlan === "free" ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-500">No billing history yet</p>
              <p className="text-sm text-slate-600 mt-1">Upgrade to Pro to view invoices</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { date: "Jan 10, 2026", amount: "$29.00", status: "Paid", invoice: "INV-2026-001" },
                { date: "Dec 10, 2025", amount: "$29.00", status: "Paid", invoice: "INV-2025-012" },
                { date: "Nov 10, 2025", amount: "$29.00", status: "Paid", invoice: "INV-2025-011" },
              ].map((invoice, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-navy-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{invoice.invoice}</p>
                      <p className="text-sm text-slate-500">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{invoice.amount}</p>
                      <p className="text-sm text-teal-400">{invoice.status}</p>
                    </div>
                    <button className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-foreground rounded-lg text-sm font-medium transition-all">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-navy-900 rounded-lg border border-slate-700">
              <h3 className="font-medium text-foreground mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-slate-400">
                Yes, you can cancel your Pro subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </div>
            <div className="p-4 bg-navy-900 rounded-lg border border-slate-700">
              <h3 className="font-medium text-foreground mb-2">What happens if I exceed my free tier limit?</h3>
              <p className="text-sm text-slate-400">
                Once you reach 5 checks per day on the Free plan, you&apos;ll need to wait until the next day or upgrade to Pro for unlimited checks.
              </p>
            </div>
            <div className="p-4 bg-navy-900 rounded-lg border border-slate-700">
              <h3 className="font-medium text-foreground mb-2">Do you offer annual billing?</h3>
              <p className="text-sm text-slate-400">
                Yes! Contact our sales team for annual billing options with a discount. Email sales@fraudguardai.com
              </p>
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className="glass-light rounded-2xl p-6 border border-teal-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">Need help with billing?</h3>
              <p className="text-sm text-slate-400 mb-3">
                Our support team is here to assist you with any billing questions or concerns.
              </p>
              <a
                href="mailto:support@fraudguardai.com"
                className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors"
              >
                Contact Support
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
