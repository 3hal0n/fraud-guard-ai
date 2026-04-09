"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { getUserInfo, UserInfo } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface AppLayoutProps {
  children: ReactNode;
}

const baseNavItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Analyze New",
    href: "/dashboard/analyze",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    name: "History",
    href: "/dashboard/history",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: "Global Threat Map",
    href: "/dashboard/map",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
      </svg>
    ),
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

const proNavItems = [
  {
    name: "API Hub",
    href: "/dashboard/api-hub",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h3m-7.5 6h12m-9 6h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    name: "Bulk CSV Audit",
    href: "/dashboard/bulk-audit",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h10m4 0l2-2m0 0l-2-2m2 2H14" />
      </svg>
    ),
  },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const footerOnlyPaths = ["/privacy", "/terms"];
  const isFooterOnly = footerOnlyPaths.includes(pathname || "");
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  // We avoid throwing when Clerk isn't configured (CI/fork runs) by
  // only using Clerk's values when the publishable key is present.
  // ESLint hook ordering is intentionally disabled above because the
  // provider may be skipped during CI; runtime-safe guards are used instead.
  type ClerkLikeUser = {
    id?: string;
    firstName?: string | null;
    emailAddresses?: Array<{ emailAddress?: string | null }>;
  };
  let user: ClerkLikeUser | null = null;
  if (clerkEnabled) {
    const _u = useUser();
    user = (_u?.user as ClerkLikeUser | null) ?? null;
  }
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Allow showing Pro features during local development/testing. In production
  // this will be false unless the user actually has a PRO plan.
  const allowProForTesting = process.env.NEXT_PUBLIC_ALLOW_PRO_TEST === "1";
  const navItems = userInfo?.plan === "PRO" || allowProForTesting ? [...baseNavItems, ...proNavItems] : baseNavItems;

  useEffect(() => {
    if (!user?.id) return;
    getUserInfo(user.id).then(setUserInfo).catch(() => null);
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row font-sans text-white selection:bg-cyan-500/30">
      
      {/* --- MOBILE NAVBAR (Hidden on lg screens) --- */}
      <header className="lg:hidden sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <Link href={isFooterOnly ? "/" : "/dashboard"} className="flex items-center gap-3">
          <Image src="/logo.svg" alt="FraudGuard" width={32} height={32} className="object-contain rounded" />
          <span className="font-medium text-white tracking-tight">FraudGuard</span>
        </Link>
        <div className="flex items-center gap-4 overflow-visible">
          {isFooterOnly ? (
            <Link href="/login" className="px-3 py-1 rounded bg-sky-600 text-white text-sm">Login</Link>
          ) : clerkEnabled ? (
            <div className="relative">
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8 border border-white/10" } }} />
              {userInfo?.plan === "PRO" && (
                <span className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-500 px-1 text-[9px] font-bold leading-none text-black border border-cyan-300">
                  PRO
                </span>
              )}
            </div>
          ) : (
            <Link href="/login" className="px-3 py-1 rounded bg-sky-600 text-white text-sm">Login</Link>
          )}
          {!isFooterOnly && (
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white hover:bg-white/5 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && !isFooterOnly && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 z-40 bg-[#050505] pt-24 px-4 pb-8 flex flex-col"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${isActive ? "bg-white/10 text-cyan-400 border border-white/10" : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"}`}>
                    {item.icon}
                    <span className="font-medium text-lg">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DESKTOP SIDEBAR (Hidden on mobile) --- */}
      {isDashboard && (
        <aside className="hidden lg:flex w-72 bg-black border-r border-white/5 flex-col z-20 h-screen sticky top-0">
        <div className="p-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Image src="/logo.svg" alt="FraudGuard AI" width={32} height={32} className="rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all" />
            <span className="text-lg font-medium text-white tracking-tight">FraudGuard <span className="text-cyan-400">AI</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive ? "bg-white/10 text-cyan-400 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"}`}>
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors overflow-visible">
            <div className="flex items-center gap-3 overflow-hidden">
              {clerkEnabled ? (
                <>
                  <div className="relative">
                    <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 border border-white/10" } }} />
                    {userInfo?.plan === "PRO" && (
                      <span className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-500 px-1.5 py-0.5 text-[9px] font-bold leading-none text-black border border-cyan-300">
                        PRO
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || "Loading..."}
                    </p>
                    <p className="text-xs text-cyan-500 truncate">
                      {userInfo ? `${userInfo.plan === "PRO" ? "Pro" : "Developer"} Plan` : "Developer Plan"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1">
                  <Link href="/login" className="px-3 py-1 rounded bg-sky-600 text-white text-sm">Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        </aside>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 lg:h-screen overflow-y-auto">
        
        {/* Desktop Top Header (Hidden on Mobile) */}
        {!isDashboard && !isFooterOnly && (
          <header className="hidden lg:flex bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 z-10 sticky top-0 items-center justify-end gap-3">
            <button className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 relative text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#050505]"></span>
            </button>
            <button className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1 1 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </header>
        )}

        <main className={`flex-1 relative ${isDashboard ? "p-4 sm:p-6 lg:p-6" : "p-4 sm:p-8 lg:p-10"}`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none z-0 hidden lg:block" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}