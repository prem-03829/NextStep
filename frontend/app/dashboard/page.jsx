import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Compass,
  GraduationCap,
  MapPinned,
  Milestone,
  SearchCheck,
  Sparkles,
  Target,
} from "lucide-react";

const collegeTools = [
  {
    title: "Smart College Search",
    badge: "Search + filter",
    description: "Filter by fees, location, course, placement, and fit.",
    href: "/dashboard/colleges",
    icon: SearchCheck,
  },
  {
    title: "College Predictor",
    badge: "Eligibility insights",
    description: "Estimate likely options from score, course, and category.",
    href: "/dashboard/predictor",
    icon: Target,
  },
  {
    title: "AI Decision Summary",
    badge: "Personalized guidance",
    description: "Convert your profile into a clearer next step.",
    href: "/dashboard/ai",
    icon: BrainCircuit,
  },
  {
    title: "Compare College",
    badge: "Side-by-side view",
    description: "Compare two colleges across costs, outcomes, and fit.",
    href: "/dashboard/compare",
    icon: BarChart3,
  },
];

const searchHighlights = [
  "Fees",
  "Location",
  "Course",
  "Placement",
  "Facilities",
  "Linguistic Minority",
];

const quickStats = [
  {
    label: "Filters Ready",
    value: "6",
    note: "Budget, fit, and eligibility",
  },
  {
    label: "Decision Modes",
    value: "4",
    note: "Search, predict, compare, summarize",
  },
  {
    label: "Experience",
    value: "Guided",
    note: "Built for calmer choices",
  },
];

const journeyMoments = [
  {
    label: "Discover",
    title: "Filter smart",
    text: "Shortlist with the filters that matter most.",
    icon: SearchCheck,
  },
  {
    label: "Predict",
    title: "Check odds",
    text: "See likely options from score and category.",
    icon: Target,
  },
  {
    label: "Decide",
    title: "Compare finalists",
    text: "Review finalists side by side before deciding.",
    icon: BarChart3,
  },
  {
    label: "Reflect",
    title: "Get clarity",
    text: "Use AI summary to shape the next move.",
    icon: BrainCircuit,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="glass-panel relative overflow-hidden rounded-[2.5rem] p-8 shadow-soft md:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-6rem] top-[-5rem] h-56 w-56 rounded-full bg-sky-300/10 blur-3xl" />
          <div className="absolute right-[-3rem] top-8 h-48 w-48 rounded-full bg-orange-200/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-sky-300/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(ellipse_at_center,rgba(255,190,120,0.14),transparent_68%)]" />
          <div className="absolute bottom-0 left-1/2 h-40 w-[88%] -translate-x-1/2 rounded-t-[100%] bg-[linear-gradient(180deg,rgba(17,25,45,0),rgba(17,25,45,0.32))]" />
          <div className="absolute bottom-6 left-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-200/30 to-transparent" />
        </div>

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              <Compass className="h-4 w-4 text-sky-200" />
              Your college decision hub
            </div>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">
                Smarter Discovery
              </p>
              <h2 className="max-w-4xl font-display text-5xl leading-[0.96] text-white md:text-6xl">
                Explore colleges with
                <span className="text-gradient"> more clarity, less noise.</span>
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                Search, predict, compare, and use AI guidance in one focused workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/colleges"
                className="orb-button rounded-full p-[1px] shadow-soft"
              >
                <span className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
                  Start Smart Search
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href="/dashboard/ai"
                className="glass-panel rounded-full px-6 py-3 text-sm text-slate-200"
              >
                Open AI Summary
              </Link>
            </div>

            <div className="grid gap-4 pt-2 md:grid-cols-3">
              {quickStats.map((stat) => (
                <article
                  key={stat.label}
                  className="glass-panel rounded-[1.75rem] p-5 transition duration-300 hover:-translate-y-1"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    {stat.label}
                  </p>
                  <h3 className="mt-3 font-display text-3xl text-white">
                    {stat.value}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {stat.note}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <article className="glass-panel rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Guidance Path
                  </p>
                  <h3 className="mt-2 font-display text-3xl text-white">
                    Search. Predict. Compare.
                  </h3>
                </div>
                <MapPinned className="h-10 w-10 text-sky-200" />
              </div>
              <div className="mt-5 space-y-3">
                {[
                  "Shortlist faster",
                  "Check likely options",
                  "Compare finalists",
                ].map((step) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] border border-sky-200/15 bg-[linear-gradient(135deg,rgba(102,164,234,0.18),rgba(255,255,255,0.04),rgba(255,183,118,0.14))] p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/20 text-sky-100">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                    Active Workspace
                  </p>
                  <p className="text-sm text-slate-100">
                    One place for the full decision flow.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 shadow-soft">
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-sky-300/10 blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-sky-200">
              <Milestone className="h-4 w-4" />
              Decision Journey
            </div>
            <h3 className="mt-5 max-w-[12ch] font-display text-4xl leading-tight text-white">
              A calmer path to confidence.
            </h3>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
              Move from shortlisting to a final decision with less friction.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {journeyMoments.map((moment) => {
            const Icon = moment.icon;

            return (
              <article
                key={moment.label}
                className="glass-panel group relative overflow-hidden rounded-[2rem] p-5 shadow-soft transition duration-300 hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/5 to-transparent" />
                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/20 to-orange-200/10 text-sky-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-400">
                    {moment.label}
                  </p>
                  <h3 className="mt-3 font-display text-[2.4rem] leading-[1.02] text-white">
                    {moment.title}
                  </h3>
                  <p className="mt-3 max-w-[24ch] text-sm leading-6 text-slate-300">
                    {moment.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="dashboard-glow relative overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-soft md:p-7">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-3rem] top-[-3rem] h-40 w-40 rounded-full bg-sky-300/12 blur-3xl" />
            <div className="absolute right-[-2rem] bottom-[-2rem] h-36 w-36 rounded-full bg-orange-200/10 blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-sky-200">
              <BrainCircuit className="h-4 w-4" />
              AI guidance
            </div>
            <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-white">
              Turn search results into a clearer recommendation.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Use AI to connect your rank, interests, and course preference with a practical next step.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/ai"
                className="orb-button rounded-full p-[1px] shadow-soft"
              >
                <span className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
                  Open AI Summary
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
            What You Can Do Here
          </p>
          <div className="mt-5 space-y-3">
            {[
              "Search real college data",
              "Predict likely options",
              "Compare shortlisted colleges",
              "Generate AI guidance",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.5fr_0.7fr]">
        <div className="glass-panel rounded-[2rem] p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
            College Discovery Tools
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {collegeTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <article
                  key={tool.title}
                  className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(11,16,34,0.82),rgba(15,22,42,0.55))] p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-200/20"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/5 to-transparent opacity-70" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/20 to-cyan-100/10 text-sky-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="max-w-[10rem] rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-sky-100">
                      {tool.badge}
                    </span>
                  </div>
                  <h2 className="mt-6 max-w-[10ch] font-display text-[2.35rem] leading-[1.04] text-white">
                    {tool.title}
                  </h2>
                  <p className="mt-4 max-w-[24ch] text-[15px] leading-6 text-slate-300">
                    {tool.description}
                  </p>
                  <Link
                    href={tool.href}
                    className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/15"
                  >
                    Open Tool
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
            Quick Overview
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,29,0.88),rgba(16,20,37,0.56))] p-5">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Active college tools</span>
              <span>4</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-sky-300 via-cyan-200 to-orange-200" />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Search, predict, compare, and turn results into a practical next step.
            </p>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/20 to-white/10 text-sky-100">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Best Next Step
                </p>
                <p className="text-sm leading-6 text-slate-200">
                  Start with Smart Search, then use AI Summary to read your shortlist.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/colleges"
              className="rounded-full border border-sky-200/20 bg-sky-200/10 px-5 py-3 text-sm text-white transition hover:bg-sky-200/15"
            >
              View Colleges
            </Link>
            <Link
              href="/dashboard/ai"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Open AI Summary
            </Link>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
          Smart Search Filters
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="h-4 w-4 text-sky-200" />
          Tailor results to your budget, preference, and eligibility.
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {searchHighlights.map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,29,0.86),rgba(16,22,39,0.58))] px-5 py-5 text-sm text-slate-200 transition duration-300 hover:-translate-y-1 hover:border-sky-200/20"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
