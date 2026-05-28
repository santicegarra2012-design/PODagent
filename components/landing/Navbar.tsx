"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 glass border-b-0 border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">POD Agent</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <Link href="/features" className="hover:text-slate-900 transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
          <Link href="/#testimonials" className="hover:text-slate-900 transition-colors">Testimonials</Link>
        </nav>

        <div className="flex items-center gap-4">
          {isLoaded && (
            <>
              {isSignedIn ? (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/dashboard"
                    className="text-sm font-medium hover:text-slate-900 transition-colors hidden sm:block"
                  >
                    Dashboard
                  </Link>
                  <UserButton />
                </div>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="hidden sm:block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-600 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
