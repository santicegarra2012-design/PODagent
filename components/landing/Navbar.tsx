"use client";

import Link from "next/link";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 glass border-b-0 border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">POD Agent</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/#testimonials" className="hover:text-white transition-colors">Testimonials</Link>
        </nav>

        <div className="flex items-center gap-4">
          {isLoaded && (
            <>
              {isSignedIn ? (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/dashboard"
                    className="text-sm font-medium hover:text-white transition-colors hidden sm:block"
                  >
                    Dashboard
                  </Link>
                  <UserButton />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
                    Get Started
                  </button>
                </SignInButton>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
