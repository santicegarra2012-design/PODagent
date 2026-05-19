import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#3b82f6", // tailwind blue-500
          colorBackground: "#09090b", // zinc-950
          colorInputBackground: "#18181b", // zinc-900
          colorInputText: "#ffffff",
        },
        elements: {
          card: "bg-background border border-white/10 shadow-2xl",
          headerTitle: "text-foreground",
          headerSubtitle: "text-zinc-400",
          socialButtonsBlockButton: "border-white/10 hover:bg-white/5",
          formButtonPrimary: "bg-primary text-white hover:bg-primary/90",
          footerActionLink: "text-primary hover:text-primary/90",
        }
      }}
    >
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-primary/30 min-h-screen flex flex-col`}>
          {children}
          <Toaster theme="dark" position="bottom-right" className="!bg-zinc-950 !border-white/10 !text-white" />
        </body>
      </html>
    </ClerkProvider>
  );
}