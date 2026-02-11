"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-navy-950" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-2xl font-semibold text-foreground">FraudGuard AI</span>
        </Link>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sign in</h1>
          <p className="text-slate-500 mb-6">Sign in to your account to continue</p>
          <SignIn routing="hash" />

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account? {" "}
              <Link href="/signup" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
