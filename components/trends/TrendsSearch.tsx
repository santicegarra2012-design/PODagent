"use client";

import { useState } from "react";
import { Search, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TrendsSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const suggestions = [
  "Summer 2026 beach vibes",
  "Vintage 90s aesthetic",
  "Niches for funny dads",
  "Cyber sigilism POD ideas",
  "Retro racing trends",
];

export function TrendsSearch({ onSearch, isLoading }: TrendsSearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        
        <form 
          onSubmit={handleSubmit}
          className="relative glass border-white/10 rounded-2xl p-2 flex items-center gap-2"
        >
          <div className="pl-4">
            <Search className="w-5 h-5 text-zinc-500" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for trending niches, aesthetics, or events…"
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 text-base py-3"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
              "bg-primary text-white shadow-lg shadow-primary/25",
              "hover:bg-primary-600 active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Discover Trends
              </>
            )}
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
          <ArrowRight className="w-3 h-3" />
          Quick Ideas
        </span>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setQuery(s);
              onSearch(s);
            }}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
