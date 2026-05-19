import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-2xl tracking-tight">POD Agent</span>
            </Link>
            <p className="text-zinc-400 max-w-sm mb-6">
              The ultimate AI toolkit for Print-on-Demand sellers. Automate SEO, discover trends, and scale your business faster than ever.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">Twitter</a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">GitHub</a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">LinkedIn</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/features" className="text-zinc-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/changelog" className="text-zinc-400 hover:text-white transition-colors">Changelog</Link></li>
              <li><Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/roadmap" className="text-zinc-400 hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/support" className="text-zinc-400 hover:text-white transition-colors">Support</Link></li>
              <li><Link href="/" className="text-zinc-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} POD Agent. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Built for modern sellers</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </footer>
  );
}
