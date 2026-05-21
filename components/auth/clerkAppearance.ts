import { dark } from "@clerk/themes";

export const authClerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#3b82f6",
    colorText: "#f8fafc",
    colorTextSecondary: "#94a3b8",
    colorBackground: "#0f172a",
    colorInputBackground: "#1e293b",
    colorInputText: "#ffffff",
    colorDanger: "#f87171",
    borderRadius: "0.75rem",
  },
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
    showOptionalFields: false,
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "bg-transparent shadow-none border-0 p-0 w-full",
    headerTitle: "text-2xl font-bold text-white",
    headerSubtitle: "text-slate-400 text-sm",
    socialButtonsBlockButton:
      "h-12 bg-white hover:bg-slate-100 text-slate-900 font-semibold border border-slate-200 rounded-xl shadow-sm",
    socialButtonsBlockButtonText: "text-slate-900 font-semibold",
    dividerLine: "bg-slate-600/50",
    dividerText: "text-slate-500 text-xs uppercase tracking-widest",
    formFieldLabel: "text-slate-200 font-medium text-sm",
    formFieldInput:
      "h-12 bg-slate-800 border-slate-600 text-white rounded-xl placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30",
    formButtonPrimary:
      "h-12 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-400 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25",
    footerActionText: "text-slate-400",
    footerActionLink: "text-cyan-400 hover:text-cyan-300 font-semibold",
    identityPreview: "bg-slate-800 border-slate-600 rounded-xl",
    identityPreviewText: "text-white",
    footer: "bg-transparent",
    logoBox: "hidden",
  },
};
