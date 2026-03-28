"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BrainCircuit,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  Target,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/colleges",
    label: "Smart Search",
    icon: GraduationCap,
  },
  {
    href: "/dashboard/predictor",
    label: "Predictor",
    icon: Target,
  },
  {
    href: "/dashboard/compare",
    label: "Compare",
    icon: BarChart3,
  },
  {
    href: "/dashboard/scholarships",
    label: "Scholarships",
    icon: Sparkles,
  },
  {
    href: "/dashboard/ai",
    label: "AI Summary",
    icon: BrainCircuit,
  },
];

function getTitle(pathname) {
  if (pathname === "/dashboard/colleges") {
    return "Smart College Search";
  }

  if (pathname === "/dashboard/predictor") {
    return "College Predictor";
  }

  if (pathname === "/dashboard/compare") {
    return "Compare College";
  }

  if (pathname === "/dashboard/scholarships") {
    return "Scholarship Options";
  }

  if (pathname === "/dashboard/ai") {
    return "AI Summary";
  }

  return "Dashboard";
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(108,146,213,0.18),transparent_22%),radial-gradient(circle_at_82%_10%,rgba(255,176,128,0.12),transparent_20%),radial-gradient(circle_at_70%_42%,rgba(129,102,197,0.12),transparent_24%),linear-gradient(180deg,rgba(8,14,32,0.96),rgba(5,8,22,0.92))]" />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.4)_0.7px,transparent_0.7px)] [background-size:24px_24px]" />
        <div className="absolute left-[-12rem] top-24 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-0 h-72 w-72 rounded-full bg-orange-300/10 blur-3xl" />
      </div>
      <div className="flex min-h-screen">
        <aside className="relative hidden w-72 shrink-0 border-r border-white/10 bg-[#070b1b]/60 px-6 py-8 backdrop-blur-xl lg:block">
          <Link
            href="/dashboard"
            className="glass-panel inline-flex items-center gap-3 rounded-[2rem] px-4 py-3 shadow-soft"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/20 to-cyan-100/10 text-sky-100">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl text-white">NextStep</p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Dashboard
              </p>
            </div>
          </Link>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                    active
                      ? "border-sky-200/20 bg-gradient-to-r from-sky-300/12 to-white/5 text-white shadow-[0_12px_40px_rgba(64,116,211,0.12)]"
                      : "border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b1bcc]/70 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-5 md:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  NextStep Workspace
                </p>
                <h1 className="mt-2 font-display text-4xl text-white">
                  {getTitle(pathname)}
                </h1>
              </div>

              <div className="glass-panel flex items-center gap-3 rounded-full px-3 py-2 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-200/20 to-white/10 text-sm font-semibold text-sky-100">
                  NS
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm text-white">Aarav Sharma</p>
                  <p className="text-xs text-slate-400">Student Profile</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto px-6 pb-4 lg:hidden">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-sky-200/20 bg-sky-200/10 text-white"
                        : "border-white/10 bg-white/5 text-slate-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <main className="relative z-10 flex-1 px-6 py-8 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
