"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";

export default function AuthHeader() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  // When Clerk is disabled (e.g. CI or forks without secrets), avoid calling Clerk hooks.
  // `process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is replaced at build time so this branch is stable.
  let isSignedIn = false;
  type ClerkLikeUser = {
    primaryEmailAddress?: { emailAddress?: string | null } | null;
  };
  let user: ClerkLikeUser | null = null;
  if (clerkEnabled) {
    const auth = useAuth();
    const u = useUser();
    isSignedIn = Boolean(auth?.isSignedIn);
    user = (u?.user as ClerkLikeUser | null) ?? null;
  }

  return (
    <header className="w-full border-b bg-white/5">
      <nav className="mx-auto max-w-6xl flex items-center justify-between p-4">
        <div className="text-lg font-semibold">FraudGuard AI</div>
        <div className="flex items-center gap-4">
          {/* Debug: display sign-in state and email when available */}
          <div className="text-sm text-slate-400">
            {isSignedIn ? (
              <span>Signed in{user?.primaryEmailAddress ? ` as ${user.primaryEmailAddress.emailAddress}` : ""}</span>
            ) : (
              <span>Not signed in</span>
            )}
          </div>

          {clerkEnabled ? (
            <>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <button className="px-3 py-1 rounded bg-sky-600 text-white">Sign in</button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-3 py-1 rounded bg-transparent border ml-2">Sign up</button>
                </SignUpButton>
              </SignedOut>
            </>
          ) : (
            // Clerk disabled: show simple links
            <>
              <a href="/login" className="px-3 py-1 rounded bg-sky-600 text-white">Sign in</a>
              <a href="/signup" className="px-3 py-1 rounded bg-transparent border ml-2">Sign up</a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
