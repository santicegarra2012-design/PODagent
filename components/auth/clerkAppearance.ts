export const authClerkAppearance = {
  variables: {
    colorPrimary: "#3b82f6",
    colorText: "#f8fafc",
    colorTextSecondary: "#94a3b8",
    colorBackground: "transparent",
    colorInputBackground: "#1a2332",
    colorInputText: "#ffffff",
    colorDanger: "#f87171",
    borderRadius: "0.875rem",
    fontFamily: "inherit",
  },
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
    showOptionalFields: false,
  },
  elements: {
    rootBox: "w-full min-h-[360px] !opacity-100 !visible",
    cardBox: "w-full shadow-none !opacity-100",
    card: "bg-transparent shadow-none border-none p-0 w-full gap-0 !opacity-100",
    header: "mb-6 gap-2",
    headerTitle: "text-2xl font-bold text-white tracking-tight text-center w-full",
    headerSubtitle: "text-slate-400 text-[15px] leading-relaxed text-center w-full mt-1",
    main: "gap-5",
    form: "gap-5",
    socialButtons: "gap-3",
    socialButtonsBlockButton:
      "group w-full !h-12 flex items-center justify-center gap-3 !bg-white hover:!bg-slate-50 !text-slate-900 !font-semibold !text-[15px] !rounded-xl !border !border-slate-200/80 !shadow-md !shadow-black/10 hover:!shadow-lg hover:!shadow-black/15 hover:-translate-y-0.5 transition-all duration-200",
    socialButtonsBlockButtonText: "!text-slate-900 !font-semibold",
    socialButtonsBlockButtonArrow: "hidden",
    socialButtonsProviderIcon: "w-5 h-5",
    dividerRow: "relative flex items-center gap-4 py-1 my-1",
    dividerLine: "flex-1 h-px bg-gradient-to-r from-transparent via-slate-500/40 to-transparent",
    dividerText:
      "text-slate-500 text-[11px] font-semibold uppercase tracking-[0.2em] shrink-0 px-0",
    formFieldRow: "gap-2",
    formFieldLabel: "text-slate-200 text-sm font-medium mb-1.5 block",
    formFieldInput:
      "!h-12 w-full !bg-[#1a2332] !border !border-slate-500/50 !rounded-xl !text-white !text-[15px] !px-4 placeholder:!text-slate-500 hover:!border-slate-400/70 focus:!border-cyan-400/80 focus:!ring-2 focus:!ring-cyan-400/25 !shadow-inner !shadow-black/20 transition-all duration-200",
    formFieldInputShowPasswordButton:
      "text-slate-400 hover:text-white transition-colors",
    formButtonPrimary:
      "!h-12 w-full !bg-gradient-to-r !from-blue-500 !via-blue-600 !to-violet-600 hover:!from-blue-400 hover:!via-blue-500 hover:!to-violet-500 !text-white !font-semibold !text-[15px] !rounded-xl !border-0 !shadow-lg !shadow-blue-500/30 hover:!shadow-blue-500/50 hover:!brightness-110 hover:-translate-y-0.5 active:!translate-y-0 !transition-all !duration-200",
    formButtonReset:
      "!h-12 w-full !bg-gradient-to-r !from-blue-500 !via-blue-600 !to-violet-600 !text-white !font-semibold !rounded-xl",
    footer: "bg-transparent pt-2",
    footerAction: "mt-6 text-center w-full",
    footerActionText: "text-slate-400 text-sm",
    footerActionLink:
      "text-cyan-400 hover:text-cyan-300 font-semibold transition-colors ml-1",
    identityPreview:
      "!bg-[#1a2332] !border !border-slate-500/50 !rounded-xl !px-4 !py-3 mb-4",
    identityPreviewText: "!text-white font-medium",
    identityPreviewEditButton: "text-cyan-400 hover:text-cyan-300 transition-colors",
    formFieldAction: "text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors",
    alertText: "!text-slate-200 text-sm",
    alert: "!bg-red-500/10 !border !border-red-500/30 !rounded-xl",
    formResendCodeLink: "text-cyan-400 hover:text-cyan-300 font-medium transition-colors",
    otpCodeFieldInput:
      "!bg-[#1a2332] !border !border-slate-500/50 !text-white !rounded-xl focus:!border-cyan-400/80 focus:!ring-2 focus:!ring-cyan-400/25",
    formFieldSuccessText: "text-emerald-400 text-sm",
    formFieldErrorText: "text-red-400 text-sm",
    formFieldHintText: "text-slate-500 text-sm",
    spinner: "text-cyan-400",
    logoBox: "hidden",
    footerPages: "hidden",
  },
};
