export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 shadow-2xl relative">
      {children}
      <div className="mt-6 text-center pointer-events-none">
        <span className="text-slate-500 text-xs uppercase tracking-wider block opacity-70">
          Secured by Clerk
        </span>
      </div>
    </section>
  );
}
