"use client";

import AppLayout from "@/components/AppLayout";

export default function PrivacyPage() {
  const year = new Date().getFullYear();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-400 mb-6">Last updated: {year}-04-09</p>

        <section className="mb-6">
          <h2 className="text-xl font-medium text-white mb-2">Introduction</h2>
          <p className="text-slate-400">This Privacy Policy describes how FraudGuard AI ("we", "us", "our") collects, uses, discloses, and protects the personal data of our business customers and their end users in connection with our fraud detection software-as-a-service ("Service"). By using our Service, you agree to the collection and use of information in accordance with this policy.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Data We Collect</h3>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Account and Billing Data: contact name, email, organization, billing information. Payments are processed by Stripe; we do not store full card numbers.</li>
            <li>Transaction Data: transaction amount, merchant, timestamps, IP address, and provided location strings for fraud analysis.</li>
            <li>Authentication Data: identifiers and session data from Clerk (identity provider) for account login and management.</li>
            <li>Usage & Telemetry: application logs, performance metrics, and aggregated usage statistics.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">How We Use Your Data</h3>
          <p className="text-slate-400">We process data to provide and improve the Service, detect fraud, send account notices, handle billing via Stripe, and comply with legal obligations. We may use aggregated or anonymized data for analytics and product improvement.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Third-Party Services</h3>
          <p className="text-slate-400">We integrate with third-party providers, including Clerk (identity/authentication) and Stripe (payments). Those providers have their own privacy policies and processing terms. We limit personal data shared with such providers to what is necessary for the integration.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Data Retention</h3>
          <p className="text-slate-400">We retain account and transaction data for as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce agreements. You may request deletion of your account data as described in the "Your Rights" section.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Security</h3>
          <p className="text-slate-400">We implement reasonable administrative, technical, and physical safeguards to protect customer data. Access to production data is restricted to authorized personnel and logged for audit. However, no system is completely secure, and we cannot guarantee absolute security.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Your Rights</h3>
          <p className="text-slate-400">Customers may access, correct, export, or request deletion of their personal data by contacting support@fraudguardai.com. We will respond to verifiable requests in accordance with applicable law.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Contact</h3>
          <p className="text-slate-400">For privacy questions, data requests, or concerns, contact: support@fraudguardai.com</p>
        </section>
      </div>
    </AppLayout>
  );
}
