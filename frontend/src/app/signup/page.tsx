"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

function SignUpContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 py-10">
      <main className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-sm text-slate-500">Start protecting your transactions today</p>
        </div>

        {planParam === "pro" && (
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-400 text-sm font-medium">
              Pro Plan Selected
            </span>
          </div>
        )}

        <div className="bg-navy-900/60 border border-slate-800 rounded-2xl p-6">
          <SignUp routing="hash" afterSignUpUrl="/dashboard" />
        </div>
      </main>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-950" />}>
      <SignUpContent />
    </Suspense>
  );
}
