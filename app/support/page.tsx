import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { HelpCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center relative overflow-hidden py-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <div className="relative z-10 p-12 glass rounded-3xl border border-slate-200 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Support</h1>
          <p className="text-slate-500 text-lg">Our support portal is under construction. Please email support@podagent.com for assistance.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
