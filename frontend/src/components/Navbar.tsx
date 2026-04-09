"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-4 px-3 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg max-w-4xl w-full mx-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="FraudGuard" width={28} height={28} className="rounded-md flex-shrink-0" />
          <span className="text-white font-semibold tracking-wide text-sm md:text-base hidden sm:inline">FraudGuard AI</span>
        </Link>

        <nav className="flex-1 hidden md:flex justify-center gap-6 text-sm text-slate-300">
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/api-docs" className="hover:text-white transition-colors">API Docs</Link>
          <Link href="/status" className="hover:text-white transition-colors">Status</Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          {clerkEnabled ? (
            <>
              <SignedIn>
                <div className="hidden md:flex items-center gap-3">
                  <Link href="/dashboard" className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium shadow-lg hover:scale-[1.02] transition-transform">Dashboard</Link>
                  <UserButton />
                </div>
                <div className="md:hidden">
                  <UserButton />
                </div>
              </SignedIn>

              <SignedOut>
                <div className="hidden md:flex items-center gap-3">
                  <Link href="/login" className="px-4 py-2 text-white text-sm font-medium hover:text-slate-200 transition-colors">Login</Link>
                  <Link href="/signup" className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium shadow-lg hover:scale-[1.02] transition-transform">Get Started</Link>
                </div>
              </SignedOut>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" className="px-4 py-2 text-white text-sm font-medium hover:text-slate-200 transition-colors">Login</Link>
                <Link href="/signup" className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium shadow-lg">Get Started</Link>
              </div>
            </>
          )}

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="md:hidden inline-flex items-center justify-center p-1.5 rounded-md bg-white/3 text-slate-100 hover:bg-white/6 transition-colors"
          >
            <svg className={`${open ? "hidden" : "block"} h-5 w-5`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            <svg className={`${open ? "block" : "hidden"} h-5 w-5`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="pointer-events-auto absolute top-[64px] left-1/2 transform -translate-x-1/2 w-[92%] max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 z-40 md:hidden">
            <nav className="flex flex-col gap-2 text-sm text-slate-200">
            <Link onClick={() => setOpen(false)} href="/pricing" className="block px-3 py-2 rounded hover:bg-white/3 transition-colors cursor-pointer">Pricing</Link>
            <Link onClick={() => setOpen(false)} href="/api-docs" className="block px-3 py-2 rounded hover:bg-white/3 transition-colors cursor-pointer">API Docs</Link>
            <Link onClick={() => setOpen(false)} href="/status" className="block px-3 py-2 rounded hover:bg-white/3 transition-colors cursor-pointer">Status</Link>
            <hr className="my-2 border-white/10" />

            {clerkEnabled ? (
              <>
                <SignedOut>
                  <Link onClick={() => setOpen(false)} href="/login" className="block px-3 py-2 rounded hover:bg-white/3 transition-colors">Login</Link>
                  <Link onClick={() => setOpen(false)} href="/signup" className="mt-2 flex items-center justify-center w-full px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium shadow cursor-pointer hover:scale-[1.02] transition-transform">Get Started</Link>
                </SignedOut>
                <SignedIn>
                  <Link onClick={() => setOpen(false)} href="/dashboard" className="block px-3 py-2 rounded hover:bg-white/3 transition-colors">Dashboard</Link>
                </SignedIn>
              </>
            ) : (
              <>
                <Link onClick={() => setOpen(false)} href="/login" className="block px-3 py-2 rounded hover:bg-white/3 transition-colors">Login</Link>
                <Link onClick={() => setOpen(false)} href="/signup" className="mt-2 flex items-center justify-center w-full px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium shadow cursor-pointer hover:scale-[1.02] transition-transform">Get Started</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
