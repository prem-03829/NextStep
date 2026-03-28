"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import {
  ArrowRight,
  Compass,
  MapPinned,
  Milestone,
  Route,
  Sparkles,
  Target,
} from "lucide-react";

import { CareerJourneyScene } from "@/components/scene/career-journey-scene";

type StorySection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  marker: string;
  align: "left" | "right";
  insight: string;
  metrics?: Array<{ label: string; value: string; width: string }>;
  bullets?: string[];
};

const sections: StorySection[] = [
  {
    id: "discover",
    eyebrow: "Self Discovery",
    title: "Start with who you are, not what everyone else is doing",
    body:
      "NextStep translates your strengths, interests, and personality into a direction you can trust. The goal is not just picking a course. It is choosing a future that feels like your own.",
    marker: "Know Yourself",
    align: "right",
    insight: "Turn confusion into a grounded starting point.",
    bullets: ["Interest mapping", "Strength signals", "Personality alignment"],
  },
  {
    id: "skills",
    eyebrow: "Skill Gap",
    title: "See the distance between where you are and where you want to go",
    body:
      "Instead of vague advice, you get a practical view of readiness. We show what you already have, what is missing, and what to do next so progress feels possible.",
    marker: "Close The Gap",
    align: "left",
    insight: "Clear readiness beats generic motivation.",
    metrics: [
      { label: "Current readiness", value: "74%", width: "74%" },
      { label: "Missing skills", value: "3 focus areas", width: "58%" },
      { label: "Action clarity", value: "Weekly roadmap", width: "92%" },
    ],
  },
  {
    id: "paths",
    eyebrow: "Career Match",
    title: "Explore careers that fit your thinking style and real potential",
    body:
      "The best path is not always the loudest one. NextStep highlights career directions that connect with how you solve problems, what energizes you, and where you can grow with confidence.",
    marker: "Find The Fit",
    align: "right",
    insight: "A better match creates momentum you can feel.",
    bullets: ["Personalized career clusters", "Reasoned recommendations", "Less pressure, more fit"],
  },
  {
    id: "destination",
    eyebrow: "College Decisions",
    title: "Move from hopeful guessing to confident college choices",
    body:
      "Compare colleges, estimate your chances, and understand outcomes in one place. That means less panic, fewer random choices, and more confidence when it is time to decide.",
    marker: "Choose Smart",
    align: "left",
    insight: "The final decision should feel informed, not risky.",
    bullets: ["Chance prediction", "College comparison", "Outcome visibility"],
  },
];

const heroStats = [
  { label: "From", value: "Confusion", note: "Scattered advice and pressure" },
  { label: "Through", value: "Clarity", note: "Signals, gaps, and fit" },
  { label: "To", value: "Momentum", note: "A path you can act on" },
];

const floatingSignals = [
  { label: "Career Fit", value: "92%", position: "top-6 right-6" },
  { label: "Skill Readiness", value: "Mapped", position: "top-28 -left-5" },
  { label: "Next Moves", value: "Weekly", position: "bottom-10 right-10" },
];

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reducedMotion;
}

function useStoryProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      setProgress(window.scrollY / maxScroll);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}

export function LandingExperience() {
  const progress = useStoryProgress();
  const reducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observers = sectionRefs.current
      .filter((node): node is HTMLElement => Boolean(node))
      .map((node, index) => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(index + 1);
            }
          },
          { threshold: 0.45 },
        );
        observer.observe(node);
        return observer;
      });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      document.querySelectorAll<HTMLElement>("[data-reveal='true']").forEach((node) => {
        node.style.opacity = "1";
        node.style.transform = "translate3d(0, 0, 0)";
      });
      return;
    }

    const targets = document.querySelectorAll("[data-reveal='true']");

    anime({
      targets,
      opacity: [0, 1],
      translateY: [42, 0],
      scale: [0.98, 1],
      delay: anime.stagger(90),
      duration: 1100,
      easing: "easeOutExpo",
    });

    anime({
      targets: "[data-float='true']",
      translateY: [
        { value: -10, duration: 2200 },
        { value: 0, duration: 2200 },
      ],
      easing: "easeInOutSine",
      loop: true,
      direction: "alternate",
      delay: anime.stagger(260),
    });
  }, [reducedMotion]);

  return (
    <main className="story-shell relative overflow-x-hidden bg-ink text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="landing-aurora" />
        <div className="landing-grid" />
        <div className="landing-noise" />
        <CareerJourneyScene progress={progress} activeSection={activeSection} />
      </div>

      <header className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link
            href="/dashboard"
            className="glass-panel flex items-center gap-3 rounded-full px-4 py-2 shadow-soft"
          >
            <Compass className="h-4 w-4 text-sky-200" />
            <span className="font-display text-sm uppercase tracking-[0.22em] text-slate-100">
              NextStep
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="glass-panel hidden items-center gap-3 rounded-full px-4 py-2 text-sm text-slate-300 md:flex"
          >
            <Route className="h-4 w-4 text-sky-200" />
            <span>Open your guidance workspace</span>
          </Link>
        </div>
      </header>

      <div className="relative z-10">
        <section className="relative flex min-h-screen items-center px-6 pb-10 pt-28 md:px-10">
          <div className="hero-radial hero-radial-blue left-[4%] top-[14%] h-72 w-72" />
          <div className="hero-radial hero-radial-warm right-[8%] top-[18%] h-80 w-80" />

          <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="max-w-3xl space-y-8">
              <div
                data-reveal="true"
                className="glass-panel inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm text-slate-300 shadow-soft"
              >
                <Sparkles className="h-4 w-4 text-sky-200" />
                Built for students who want clarity, not noise
              </div>

              <div data-reveal="true" className="space-y-6">
                <p className="section-kicker font-display text-sm uppercase text-slate-400">
                  Guidance should feel calm, cinematic, and useful
                </p>
                <h1 className="max-w-4xl font-display text-5xl leading-[0.96] md:text-7xl xl:text-[5.8rem]">
                  Find the future that
                  <span className="text-gradient"> actually fits you.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                  NextStep combines self-discovery, career matching, skill-gap clarity,
                  and college decisions into one guided experience that feels decisive.
                </p>
              </div>

              <div data-reveal="true" className="flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="orb-button rounded-full p-[1px] shadow-soft"
                >
                  <span className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
                    Start Your Journey
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link
                  href="/dashboard"
                  className="glass-panel rounded-full px-5 py-3 text-sm text-slate-300"
                >
                  Explore the dashboard
                </Link>
              </div>

              <div
                data-reveal="true"
                className="grid gap-4 pt-4 sm:grid-cols-3"
              >
                {heroStats.map((item) => (
                  <article
                    key={item.label}
                    className="hero-stat-card glass-panel rounded-[1.75rem] p-5 shadow-soft"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {item.label}
                    </p>
                    <h2 className="mt-3 font-display text-3xl text-white">
                      {item.value}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.note}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-end">
              {floatingSignals.map((signal) => (
                <div
                  key={signal.label}
                  data-float="true"
                  className={`floating-pill glass-panel absolute ${signal.position} hidden rounded-2xl px-4 py-3 text-sm shadow-soft md:block`}
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {signal.label}
                  </p>
                  <p className="mt-1 font-display text-2xl text-white">{signal.value}</p>
                </div>
              ))}

              <div
                data-reveal="true"
                className="spotlight-card dashboard-glow glass-panel relative w-full max-w-xl overflow-hidden rounded-[2rem] p-6 shadow-soft md:p-7"
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-500">
                      Guidance cockpit
                    </p>
                    <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
                      See your journey at a glance
                    </h2>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <MapPinned className="h-6 w-6 text-sky-200" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                          Student signal
                        </p>
                        <h3 className="mt-2 font-display text-2xl text-white">
                          Product Design x Psychology
                        </h3>
                      </div>
                      <Target className="h-5 w-5 text-[#ffb684]" />
                    </div>

                    <div className="mt-6 space-y-4">
                      {[
                        { label: "Career fit", value: "92%", width: "92%" },
                        { label: "Confidence level", value: "High", width: "82%" },
                        { label: "Action readiness", value: "Weekly path", width: "76%" },
                      ].map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-slate-300">
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                          </div>
                          <div className="meter-bar h-2 rounded-full bg-white/8">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-sky-300 via-sky-200 to-[#ffb684]"
                              style={{ width: item.width }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Why it feels better
                      </p>
                      <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          One place for self-awareness and decisions
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          Recommendations with visible reasoning
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          A calmer path from doubt to direction
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Core outcomes
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {["Self Discovery", "Skill Gap", "Career Match", "College Choices"].map(
                          (item) => (
                            <span
                              key={item}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.16em] text-slate-300"
                            >
                              {item}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-6 pb-12 md:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.34fr_1fr]">
            <aside className="progress-track hidden lg:block">
              <div className="sticky top-28 space-y-4">
                <p className="section-kicker font-display text-sm uppercase text-slate-400">
                  The journey
                </p>
                <div className="space-y-4">
                  {sections.map((section, index) => {
                    const isActive = activeSection === index + 1;
                    return (
                      <div
                        key={section.id}
                        className={`journey-node glass-panel rounded-[1.5rem] px-4 py-4 ${
                          isActive ? "journey-node-active" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="journey-dot mt-1.5 h-2.5 w-2.5 rounded-full bg-slate-500" />
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                              {section.eyebrow}
                            </p>
                            <p className="mt-2 font-display text-2xl text-white">
                              {section.marker}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {section.insight}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div className="space-y-16 md:space-y-24">
              {sections.map((section, index) => {
                const isActive = activeSection === index + 1;

                return (
                  <section
                    key={section.id}
                    ref={(node) => {
                      sectionRefs.current[index] = node;
                    }}
                    className="relative flex min-h-[80vh] items-center"
                  >
                    <div className="mx-auto grid w-full md:grid-cols-2">
                      <div
                        className={
                          section.align === "left" ? "md:col-start-1" : "md:col-start-2"
                        }
                      >
                        <div
                          className={`story-card glass-panel max-w-xl rounded-[2rem] p-8 shadow-soft md:p-10 ${
                            isActive ? "story-card-active" : ""
                          }`}
                        >
                          <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-sky-200">
                            {section.marker}
                          </div>
                          <p className="section-kicker font-display text-xs uppercase text-slate-400">
                            {section.eyebrow}
                          </p>
                          <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">
                            {section.title}
                          </h2>
                          <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">
                            {section.body}
                          </p>

                          {section.metrics && (
                            <div className="mt-8 grid gap-4">
                              {section.metrics.map((metric) => (
                                <div
                                  key={metric.label}
                                  className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4"
                                >
                                  <div className="flex items-center justify-between">
                                    <p className="text-slate-300">{metric.label}</p>
                                    <p className="font-display text-xl text-white">
                                      {metric.value}
                                    </p>
                                  </div>
                                  <div className="meter-bar mt-3 h-2 rounded-full bg-white/8">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-sky-300 via-sky-200 to-[#ffb684]"
                                      style={{ width: metric.width }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {section.bullets && (
                            <div className="mt-8 space-y-4">
                              {section.bullets.map((branch) => (
                                <div
                                  key={branch}
                                  className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-slate-300"
                                >
                                  {branch}
                                </div>
                              ))}
                            </div>
                          )}

                          {section.id === "destination" && (
                            <div className="mt-8 flex flex-wrap gap-4">
                              <Link
                                href="/dashboard"
                                className="orb-button rounded-full p-[1px]"
                              >
                                <span className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
                                  Start Your Journey
                                  <ArrowRight className="h-4 w-4" />
                                </span>
                              </Link>
                              <Link
                                href="/dashboard"
                                className="glass-panel rounded-full px-5 py-3 text-sm text-slate-300"
                              >
                                Go to Dashboard
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative flex min-h-[72vh] items-end px-6 pb-20 md:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <div className="dashboard-glow glass-panel max-w-3xl rounded-[2rem] p-8 shadow-soft md:p-10">
              <div className="flex items-center gap-3 text-sky-200">
                <Milestone className="h-5 w-5" />
                <span className="section-kicker text-sm uppercase text-slate-400">
                  Final Step
                </span>
              </div>
              <h2 className="mt-4 font-display text-4xl md:text-6xl">
                Your future deserves better than guesswork
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Move with clarity, see what fits, and make decisions with much more
                confidence than a spreadsheet or random advice can give you.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/dashboard" className="orb-button rounded-full p-[1px]">
                  <span className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
                    Enter NextStep
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
                <div className="glass-panel rounded-full px-5 py-3 text-sm text-slate-300">
                  Calm guidance for big decisions
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
