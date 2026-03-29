"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, RotateCcw } from "lucide-react";

import { STORAGE_KEY } from "@/lib/nextstep-data";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/simulation", label: "Simulation" },
  { href: "/colleges", label: "Colleges" },
];

export function SiteHeader() {
  const pathname = usePathname();

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = "/onboarding";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b1bcc]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="glass-panel flex items-center gap-3 rounded-full px-4 py-2">
          <Compass className="h-4 w-4 text-sky-200" />
          <span className="font-display text-sm uppercase tracking-[0.22em] text-slate-100">
            NextStep
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={reset}
          className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-200"
        >
          <RotateCcw className="h-4 w-4" />
          Start Over
        </button>
      </div>
    </header>
  );
}
