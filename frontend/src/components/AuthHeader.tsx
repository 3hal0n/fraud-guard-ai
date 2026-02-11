"use client";

import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function AuthHeader() {
  return (
    <header className="w-full border-b bg-white/5">
      <nav className="mx-auto max-w-6xl flex items-center justify-between p-4">
        <div className="text-lg font-semibold">FraudGuard AI</div>
        <div className="flex items-center gap-2">
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
        </div>
      </nav>
    </header>
  );
}
