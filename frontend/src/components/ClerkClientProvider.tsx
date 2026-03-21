"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkClientProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // CI/static builds may not provide Clerk keys; render app shell without auth provider.
  if (!publishableKey) {
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
