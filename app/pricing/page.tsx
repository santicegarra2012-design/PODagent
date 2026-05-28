import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
