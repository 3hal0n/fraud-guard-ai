"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkClientProvider({ children }: { children: React.ReactNode }) {
  // Ensure Clerk context exists in CI/static builds where env vars may be omitted.
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    // Fail fast during build so CI shows a clear error about missing Clerk key
    // (avoid using a placeholder key that hides the real configuration problem).
    // Keeping this console.error helps diagnose missing secrets in CI logs.
    // eslint-disable-next-line no-console
    console.error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable.");
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
