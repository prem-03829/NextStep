"use client";

import { useState } from "react";

import {
  generatePersonalization,
  getApiBaseUrl,
  sendChatMessage,
} from "@/lib/api";

function formatSummary(report) {
  if (!report) {
    return "No summary returned.";
  }

  if (typeof report === "string") {
    return report;
  }

  const sections = [
    report.career_target ? `Career target: ${report.career_target}` : null,
    Array.isArray(report.roadmap) && report.roadmap.length
      ? `Roadmap: ${report.roadmap.join(" -> ")}`
      : null,
    report.college_decision
      ? `College decision: ${report.college_decision}`
      : null,
    report.roi_strategy ? `ROI strategy: ${report.roi_strategy}` : null,
    report.travel_strategy
      ? `Travel strategy: ${report.travel_strategy}`
      : null,
    report.goal_strategy ? `Goal strategy: ${report.goal_strategy}` : null,
    report.final_advice ? `Final advice: ${report.final_advice}` : null,
  ].filter(Boolean);

  return sections.join("\n\n") || "No summary returned.";
}

export default function AiPage() {
  const [rank, setRank] = useState(12000);
  const [preferredCourse, setPreferredCourse] = useState("CS");
  const [interests, setInterests] = useState("coding, problem solving");
  const [summary, setSummary] = useState(
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
      const response = await generatePersonalization({
        rank,
        preferred_course: preferredCourse,
        interests: interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      setSummary(
        formatSummary(response.personalized_report || response.error),
      );
      setMentorAdvice(response.ai_mentor_advice || "");
    } catch (error) {
      setSummary(`Could not reach ${getApiBaseUrl()}. Start the backend and try again.`);
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

        <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-8 text-slate-300">
          {summary}
        </p>

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
