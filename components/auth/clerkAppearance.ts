import { light } from "@clerk/themes";

export const authClerkAppearance = {
  baseTheme: light,
  variables: {
    colorPrimary: "#3b82f6",
    colorText: "#0f172a",
    colorTextSecondary: "#64748b",
    colorBackground: "#ffffff",
    colorInputBackground: "#f8fafc",
    colorInputText: "#0f172a",
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
    headerTitle: "!text-2xl !font-bold !text-slate-900",
    headerSubtitle: "!text-slate-500 !text-sm",
    socialButtonsBlockButton:
      "!h-12 !bg-white !hover:bg-slate-50 !text-slate-900 !font-semibold !border !border-slate-200 !rounded-xl !shadow-sm",
    socialButtonsBlockButtonText: "!text-slate-900 !font-semibold",
    dividerLine: "!bg-slate-200",
    dividerText: "!text-slate-400 !text-xs !uppercase !tracking-widest",
    formFieldLabel: "!text-slate-700 !font-medium !text-sm",
    formFieldInput:
      "!h-12 !bg-slate-50 !border !border-slate-300 !text-slate-900 !rounded-xl placeholder:!text-slate-400 focus:!border-blue-400 focus:!ring-2 focus:!ring-blue-500/30",
    formButtonPrimary:
      "!h-12 !bg-gradient-to-r !from-blue-500 !to-violet-600 hover:!from-blue-400 hover:!to-violet-500 !text-white !font-semibold !rounded-xl !shadow-lg !shadow-blue-500/25",
    formFieldAction: "!text-blue-600 hover:!text-blue-700",
    footerAction: "!text-slate-500",
    footerActionText: "!text-slate-500",
    footerActionLink: "!text-blue-600 hover:!text-blue-700 !font-semibold",
    identityPreview: "!bg-white !border !border-slate-200 !rounded-xl",
    identityPreviewText: "!text-slate-900",
    formResendCodeLink: "!text-blue-600 hover:!text-blue-700",
    otpCodeFieldInput:
      "!bg-slate-50 !border !border-slate-300 !text-slate-900 !rounded-xl",
    alertText: "!text-slate-700",
    footer: "!bg-transparent",
    logoBox: "hidden",
  },
};
