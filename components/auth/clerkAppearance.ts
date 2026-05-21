import { dark } from "@clerk/themes";

export const authClerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#3b82f6",
    colorText: "#ffffff",
    colorTextSecondary: "#cbd5e1",
    colorBackground: "#111827",
    colorInputBackground: "#1f2937",
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
    headerTitle: "!text-2xl !font-bold !text-white",
    headerSubtitle: "!text-slate-300 !text-sm",
    socialButtonsBlockButton:
      "!h-12 !bg-white !hover:bg-slate-100 !text-slate-950 !font-semibold !border !border-slate-200 !rounded-xl !shadow-sm",
    socialButtonsBlockButtonText: "!text-slate-950 !font-semibold",
    dividerLine: "!bg-slate-600/50",
    dividerText: "!text-slate-400 !text-xs !uppercase !tracking-widest",
    formFieldLabel: "!text-slate-200 !font-medium !text-sm",
    formFieldInput:
      "!h-12 !bg-slate-800/95 !border !border-slate-500 !text-white !rounded-xl placeholder:!text-slate-400 focus:!border-blue-400 focus:!ring-2 focus:!ring-blue-500/30",
    formButtonPrimary:
      "!h-12 !bg-gradient-to-r !from-blue-500 !to-violet-600 hover:!from-blue-400 hover:!to-violet-500 !text-white !font-semibold !rounded-xl !shadow-lg !shadow-blue-500/25",
    formFieldAction: "!text-cyan-300 hover:!text-cyan-200",
    footerAction: "!text-slate-300",
    footerActionText: "!text-slate-300",
    footerActionLink: "!text-cyan-300 hover:!text-cyan-200 !font-semibold",
    identityPreview: "!bg-slate-800 !border !border-slate-600 !rounded-xl",
    identityPreviewText: "!text-white",
    formResendCodeLink: "!text-cyan-300 hover:!text-cyan-200",
    otpCodeFieldInput:
      "!bg-slate-800/95 !border !border-slate-500 !text-white !rounded-xl",
    alertText: "!text-slate-100",
    footer: "!bg-transparent",
    logoBox: "hidden",
  },
};
