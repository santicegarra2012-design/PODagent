"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Etsy Top Seller",
    content: "POD Agent completely transformed my workflow. What used to take me hours in keyword research now takes seconds. My organic traffic is up 300%.",
    avatar: "S"
  },
  {
    name: "David Chen",
    role: "Apparel Brand Owner",
    content: "The trend research feature is honestly a cheat code. We found a micro-niche before anyone else and did $10k in our first month.",
    avatar: "D"
  },
  {
    name: "Elena Rodriguez",
    role: "Digital Artist",
    content: "Finally, a tool that understands the Print-on-Demand business. The interface is stunning and the AI actually provides usable titles and tags.",
    avatar: "E"
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative bg-black/50 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Loved by <span className="text-gradient-primary">successful</span> sellers
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            See how POD Agent is helping creators build profitable businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-8 rounded-3xl flex flex-col"
            >
              <div className="flex gap-1 mb-6 text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
              
              <p className="text-zinc-300 mb-8 flex-1 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-lg text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-zinc-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
