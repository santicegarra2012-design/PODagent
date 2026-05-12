"use client";

import { motion } from "framer-motion";
import { Search, ShoppingBag, TrendingUp, Save, ImageIcon } from "lucide-react";

const features = [
  {
    title: "AI SEO Generation",
    description: "Instantly generate high-converting titles, tags, and descriptions optimized for search algorithms.",
    icon: Search,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    title: "Etsy Optimization",
    description: "Analyze and improve your Etsy listings to outrank competitors and drive more organic traffic.",
    icon: ShoppingBag,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    title: "POD Trend Research",
    description: "Discover profitable niches and trending design concepts before they become saturated.",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    title: "Project Saving",
    description: "Organize your research, generated assets, and listing drafts in one centralized workspace.",
    icon: Save,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    title: "AI Image Generation",
    description: "Create stunning product mockups and design elements with advanced AI models.",
    icon: ImageIcon,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    badge: "Coming Soon"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need to <span className="text-gradient-primary">scale</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Powerful tools designed specifically for Print-on-Demand sellers to save time and increase sales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-8 rounded-2xl relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 rounded-xl ${feature.bg}`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  {feature.badge && (
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-zinc-300">
                      {feature.badge}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed flex-1">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
