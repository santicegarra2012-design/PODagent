"use client";

import { SignUp } from "@clerk/nextjs";
import { Sparkles, Zap, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Sparkles, label: "AI-Powered SEO Generation" },
  { icon: TrendingUp, label: "Real-Time Trend Research" },
  { icon: Zap, label: "Instant Listing Optimization" },
  { icon: Shield, label: "Trademark Safety Checker" },
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        {/* Animated background glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[150px] opacity-40 pointer-events-none animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] opacity-30 pointer-events-none animate-blob" style={{ animationDelay: "3s" }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary/20 p-2.5 rounded-xl group-hover:bg-primary/30 transition-colors">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">POD Agent</span>
          </Link>
        </div>

        {/* Value proposition */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Start scaling your POD business with{" "}
            <span className="text-gradient-primary">AI today</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10">
            Join thousands of sellers using AI to dominate Etsy, Amazon Merch, and Redbubble.
          </p>

          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                  <f.icon className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-zinc-300 font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative z-10">
          <p className="text-zinc-600 text-sm">
            Trusted by <span className="text-zinc-400 font-semibold">2,000+</span> POD sellers worldwide
          </p>
        </div>
      </div>

      {/* Right Side — Clerk Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-zinc-950/50 lg:bg-transparent" />
        {/* Mobile glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] opacity-30 pointer-events-none lg:hidden" />
        
        <div className="relative z-10 w-full max-w-[440px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">POD Agent</span>
            </Link>
          </div>

          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none",
                card: "bg-transparent shadow-none border-none p-0 w-full",
                headerTitle: "text-2xl font-bold text-white",
                headerSubtitle: "text-zinc-400",
                socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all rounded-xl h-11",
                socialButtonsBlockButtonText: "text-sm font-medium",
                dividerLine: "bg-white/10",
                dividerText: "text-zinc-500",
                formFieldLabel: "text-zinc-400 text-sm font-medium",
                formFieldInput: "bg-white/5 border border-white/10 text-white rounded-xl h-11 focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-zinc-600",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-11 text-sm shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40",
                footerAction: "text-zinc-500",
                footerActionLink: "text-primary hover:text-primary/80 font-semibold",
                identityPreview: "bg-white/5 border border-white/10 rounded-xl",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-primary",
                formFieldAction: "text-primary hover:text-primary/80",
                alertText: "text-zinc-300",
                formResendCodeLink: "text-primary",
                otpCodeFieldInput: "bg-white/5 border border-white/10 text-white rounded-lg",
                footer: "bg-transparent",
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
