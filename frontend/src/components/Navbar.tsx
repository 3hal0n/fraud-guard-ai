"use client";

import Link from "next/link";
import React from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useAuth, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-navy-950" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-foreground">FraudGuard AI</span>
          </div>

          <div className="flex items-center gap-4">
            <SignedIn>
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-400">{user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress}</div>
                <UserButton />
              </div>
            </SignedIn>

            <SignedOut>
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm text-slate-500 hover:text-foreground transition-colors">Login</Link>
                <SignUpButton>
                  <span className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-navy-950 rounded-lg font-medium text-sm transition-all">Sign Up</span>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
}
