import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { authClerkAppearance } from "@/components/auth/clerkAppearance";
import "./globals.css";

export const metadata: Metadata = {
  title: "POD Agent",
  description: "Premium AI POD SaaS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={authClerkAppearance}>
      <html lang="en" className="dark">
        <body className="bg-background text-foreground antialiased selection:bg-primary/30 min-h-screen flex flex-col">
          {children}
          <Toaster theme="dark" position="bottom-right" className="!bg-zinc-950 !border-white/10 !text-white" />
        </body>
      </html>
    </ClerkProvider>
  );
}
