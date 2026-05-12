"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Image as ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] opacity-50 pointer-events-none animate-blob" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] opacity-40 pointer-events-none animate-blob" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Introducing POD Agent 2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
          >
            Supercharge your POD business with <span className="text-gradient-primary">AI-driven</span> insights
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl"
          >
            Automate SEO, discover trending designs, and scale your Etsy shop effortlessly with our powerful suite of AI tools.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              {isSignedIn ? "Go to Dashboard" : "Start for free"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 rounded-full font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white w-full sm:w-auto justify-center flex"
            >
              Explore features
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="rounded-xl overflow-hidden glass border-white/10 shadow-2xl shadow-primary/20 aspect-[16/9] flex flex-col">
            {/* Mockup Header */}
            <div className="h-12 border-b border-white/10 bg-black/40 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="ml-4 w-64 h-6 rounded-md bg-white/5" />
            </div>
            
            {/* Mockup Body */}
            <div className="flex-1 flex bg-[#0a0a0a]">
              {/* Sidebar */}
              <div className="w-48 border-r border-white/10 p-4 hidden sm:flex flex-col gap-2">
                <div className="h-8 rounded bg-primary/20 flex items-center px-2 mb-2">
                  <div className="w-4 h-4 rounded bg-primary mr-2" />
                  <div className="w-20 h-2.5 rounded bg-primary/50" />
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 rounded hover:bg-white/5 flex items-center px-2">
                    <div className="w-4 h-4 rounded bg-white/10 mr-2" />
                    <div className="w-16 h-2 rounded bg-white/20" />
                  </div>
                ))}
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="w-32 h-5 rounded bg-white/20 mb-2" />
                    <div className="w-48 h-3 rounded bg-white/10" />
                  </div>
                  <div className="w-24 h-8 rounded bg-primary/80" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Sparkles, color: "text-blue-400" },
                    { icon: BarChart3, color: "text-green-400" },
                    { icon: ImageIcon, color: "text-purple-400" }
                  ].map((card, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <card.icon className={`w-6 h-6 ${card.color} mb-3`} />
                      <div className="w-16 h-3 rounded bg-white/20 mb-2" />
                      <div className="w-24 h-6 rounded bg-white/40" />
                    </div>
                  ))}
                </div>
                
                <div className="flex-1 rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="w-full h-4 rounded bg-white/10 mb-4" />
                  <div className="w-3/4 h-4 rounded bg-white/10 mb-4" />
                  <div className="w-5/6 h-4 rounded bg-white/10 mb-4" />
                  <div className="w-1/2 h-4 rounded bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
