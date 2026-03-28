import { SiteHeader } from "@/components/site-header";

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-ink text-white">
      <SiteHeader />
      <section className="px-6 pb-16 pt-14 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl space-y-4">
            <p className="font-display text-sm uppercase tracking-[0.28em] text-slate-400">
              NextStep Prototype
            </p>
            <h1 className="font-display text-4xl leading-tight md:text-6xl">{title}</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">{subtitle}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
