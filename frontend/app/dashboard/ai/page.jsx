"use client";

import { useState } from "react";
import { Compass, Flag, Map, Sparkles, Target } from "lucide-react";

import {
  generatePersonalization,
  getApiBaseUrl,
  sendChatMessage,
} from "@/lib/api";

function normalizeSummary(report) {
  if (!report) {
    return null;
  }

  if (typeof report === "string") {
    return {
      headline: "AI summary",
      intro: report,
      roadmap: [],
      cards: [],
      finalAdvice: "",
    };
  }

  return {
    headline: report.career_target || "Personalized guidance",
    intro: report.college_decision || "Your summary is ready.",
    roadmap: Array.isArray(report.roadmap) ? report.roadmap : [],
    cards: [
      {
        key: "college",
        title: "College Decision",
        body: report.college_decision,
        icon: Compass,
      },
      {
        key: "roi",
        title: "ROI Strategy",
        body: report.roi_strategy,
        icon: Target,
      },
      {
        key: "travel",
        title: "Travel Strategy",
        body: report.travel_strategy,
        icon: Map,
      },
      {
        key: "goal",
        title: "Goal Strategy",
        body: report.goal_strategy,
        icon: Flag,
      },
    ].filter((card) => Boolean(card.body)),
    finalAdvice: report.final_advice || "",
  };
}

export default function AiPage() {
  const [rank, setRank] = useState(12000);
  const [preferredCourse, setPreferredCourse] = useState("CS");
  const [interests, setInterests] = useState("coding, problem solving");
  const [summaryData, setSummaryData] = useState(null);
  const [summaryError, setSummaryError] = useState(
    "Generate a personalized summary from the backend.",
  );
  const [mentorAdvice, setMentorAdvice] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  async function handleGenerate() {
    try {
      setSummaryLoading(true);
      setSummaryError("");
      const response = await generatePersonalization({
        rank,
        preferred_course: preferredCourse,
        interests: interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      if (response.error) {
        setSummaryData(null);
        setSummaryError(response.error);
      } else {
        setSummaryData(normalizeSummary(response.personalized_report));
      }
      setMentorAdvice(response.ai_mentor_advice || "");
    } catch (error) {
      setSummaryData(null);
      setSummaryError(
        `Could not reach ${getApiBaseUrl()}. Start the backend and try again.`,
      );
      setMentorAdvice("");
    } finally {
      setSummaryLoading(false);
    }
  }

  async function handleChat() {
    try {
      setChatLoading(true);
      const response = await sendChatMessage(message);
      setReply(response.response);
    } catch (error) {
      setReply(`Could not reach ${getApiBaseUrl()}. Start the backend and try again.`);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
            AI Decision Summary
          </p>
          <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
            Source: {getApiBaseUrl()}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Rank</span>
            <input
              type="number"
              value={rank}
              onChange={(event) => setRank(Number(event.target.value))}
              className="w-full rounded-2xl border border-white/10 bg-[#060a17] px-4 py-3 text-sm text-white outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Preferred Course</span>
            <input
              value={preferredCourse}
              onChange={(event) => setPreferredCourse(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#060a17] px-4 py-3 text-sm text-white outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Interests</span>
            <input
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#060a17] px-4 py-3 text-sm text-white outline-none"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="mt-6 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/15"
        >
          {summaryLoading ? "Generating..." : "Generate Summary"}
        </button>

        {summaryData ? (
          <div className="mt-6 space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-sky-200/15 bg-[linear-gradient(135deg,rgba(91,157,255,0.16),rgba(255,255,255,0.04),rgba(255,184,117,0.14))] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-sky-100/70">
                    Recommended Direction
                  </p>
                  <h2 className="mt-3 font-display text-4xl text-white">
                    {summaryData.headline}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
                    {summaryData.intro}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/20 text-sky-100">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
            </div>

            {summaryData.roadmap.length ? (
              <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-sky-200/80">
                  Roadmap
                </p>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {summaryData.roadmap.map((step, index) => (
                    <div
                      key={`${step}-${index}`}
                      className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Step {index + 1}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {summaryData.cards.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {summaryData.cards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <article
                      key={card.key}
                      className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-soft"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/20 to-orange-200/10 text-sky-100">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                          {card.title}
                        </p>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-slate-200">
                        {card.body}
                      </p>
                    </article>
                  );
                })}
              </div>
            ) : null}

            {summaryData.finalAdvice ? (
              <div className="rounded-[2rem] border border-orange-200/15 bg-[linear-gradient(180deg,rgba(255,186,120,0.12),rgba(255,255,255,0.03))] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-100/80">
                  Final Advice
                </p>
                <p className="mt-4 text-sm leading-8 text-slate-100">
                  {summaryData.finalAdvice}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-8 text-slate-300">
            {summaryError}
          </p>
        )}

        {mentorAdvice ? (
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-300">
            {mentorAdvice}
          </div>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
          Chat With AI
        </p>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
          <div className="rounded-[1.25rem] bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">
            Ask the backend chat service about colleges, scholarships, or careers.
          </div>
          <textarea
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type your question here..."
            className="mt-4 w-full resize-none rounded-[1.25rem] border border-white/10 bg-[#060a17] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={handleChat}
            className="mt-4 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/15"
          >
            {chatLoading ? "Sending..." : "Send"}
          </button>

          {reply ? (
            <div className="mt-4 rounded-[1.25rem] bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">
              {reply}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
