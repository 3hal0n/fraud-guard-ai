"use client";

import AppLayout from "@/components/AppLayout";

export default function TermsPage() {
  const year = new Date().getFullYear();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-white mb-4">Terms of Service</h1>
        <p className="text-slate-400 mb-6">Effective date: {year}-04-09</p>

        <section className="mb-6">
          <h2 className="text-xl font-medium text-white mb-2">Agreement</h2>
          <p className="text-slate-400">These Terms of Service (&quot;Terms&quot;) govern your access to and use of the FraudGuard AI services (&quot;Service&quot;). By using the Service, you agree to these Terms and our Privacy Policy.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Account Terms</h3>
          <p className="text-slate-400">You are responsible for maintaining the security of your account credentials. We use Clerk for authentication; account management actions may be subject to Clerk&apos;s terms.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Billing and Payment</h3>
          <p className="text-slate-400">Payments are processed by Stripe. You agree to pay fees for the plans you select. Refunds, billing disputes, and invoicing are handled according to our billing policy and Stripe&apos;s terms.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Acceptable Use</h3>
          <p className="text-slate-400">You will not use the Service for unlawful activities, to attempt to bypass security measures, or to submit data that you are not authorized to provide. We may suspend accounts engaging in abusive or illegal conduct.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Data and Privacy</h3>
          <p className="text-slate-400">Our processing of data is governed by the Privacy Policy. You are responsible for obtaining any necessary consents from end users before submitting personal data to the Service.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Intellectual Property</h3>
          <p className="text-slate-400">We retain all rights to the Service and associated intellectual property. You retain ownership of the data you submit, subject to the license you grant us to operate the Service.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Disclaimer & Limitation of Liability</h3>
          <p className="text-slate-400">The Service is provided &quot;as is&quot; and we disclaim implied warranties to the maximum extent permitted by law. Our liability is limited as set forth in these Terms; we are not liable for consequential damages arising from use of the Service.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Governing Law</h3>
          <p className="text-slate-400">These Terms are governed by the laws of the jurisdiction in which FraudGuard AI is incorporated, unless otherwise required by local mandatory law.</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Contact</h3>
          <p className="text-slate-400">Questions about these Terms can be sent to support@fraudguardai.com.</p>
        </section>
      </div>
    </AppLayout>
  );
}
