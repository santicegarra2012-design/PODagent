import Link from "next/link";

function MerchAgentLogo() {
  return (
    <svg
      className="w-8 h-8 text-white"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect height="8" width="12" x="6" y="14" />
      <path d="M6 10V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6" />
    </svg>
  );
}

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#020617] text-slate-200 font-sans min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />

      <main className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex flex-col items-center group">
            <div className="bg-primary p-2.5 rounded-2xl mb-3 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:bg-primary/90 transition-colors">
              <MerchAgentLogo />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
              Merch Agent
            </h1>
          </Link>
        </div>

        {children}

        <footer className="mt-8 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-md">
            <span className="text-orange-500 font-medium text-sm tracking-wide">Development mode</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
