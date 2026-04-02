"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 pt-24 pb-10">
      <main className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
          <p className="text-sm text-slate-500">Access your FraudGuard dashboard</p>
        </div>

        <div className="bg-navy-900/60 border border-slate-800 rounded-2xl p-6">
          <SignIn routing="hash" afterSignInUrl="/dashboard" />
        </div>
      </main>
    </div>
  );
}
