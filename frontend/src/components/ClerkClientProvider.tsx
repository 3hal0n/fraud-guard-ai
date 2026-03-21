"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkClientProvider({ children }: { children: React.ReactNode }) {
  // Ensure Clerk context exists in CI/static builds where env vars may be omitted.
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_ci_placeholder";

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
