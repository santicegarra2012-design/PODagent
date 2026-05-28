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
      <html lang="en">
        <body className="bg-background text-foreground antialiased selection:bg-primary/30 min-h-screen flex flex-col">
          {children}
          <Toaster theme="light" position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
