"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkClientProvider({ children }: { children: React.ReactNode }) {
  // Ensure Clerk context exists in CI/static builds where env vars may be omitted.
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    // Don't initialize Clerk during builds or CI when the publishable key isn't provided.
    // Returning children without `ClerkProvider` prevents @clerk/nextjs from throwing
    // a missing-publishableKey error during prerendering.
    console.warn("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY not set — skipping Clerk initialization.");
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
