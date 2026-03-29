"use client";

import { useEffect, useState } from "react";

import { fetchPredictor, getApiBaseUrl } from "@/lib/api";

const categoryOptions = ["OPEN", "OBC", "SC"];
const courseOptions = ["ALL", "B.Tech", "B.E."];

export default function PredictorPage() {
  const [percentile, setPercentile] = useState(85);
  const [course, setCourse] = useState("ALL");
  const [category, setCategory] = useState("OPEN");
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPredictions() {
      try {
        setLoading(true);
        setError("");
        const response = await fetchPredictor({
          percentile,
          category,
          course,
        });
        const mergedResults = [
          ...(response.results.safe || []),
          ...(response.results.moderate || []),
          ...(response.results.dream || []),
        ];

        if (!cancelled) {
          setResults(mergedResults);
          setSummary(response.summary);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            `Could not load predictions from ${getApiBaseUrl()}. Start the backend and try again.`,
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPredictions();

    return () => {
      cancelled = true;
    };
  }, [percentile, category, course]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
              Prediction Inputs
            </p>
            <p className="mt-2 text-sm text-slate-400">{summary || "Live predictor results from FastAPI."}</p>
          </div>
          <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
            Source: {getApiBaseUrl()}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Exam Percentile</span>
            <input
              type="range"
              min="50"
              max="99"
              value={percentile}
              onChange={(event) => setPercentile(Number(event.target.value))}
              className="w-full accent-sky-300"
            />
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
              {percentile} percentile
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Course</span>
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              {courseOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {loading ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          Loading prediction results...
        </div>
      ) : error ? (
        <div className="rounded-[1.75rem] border border-amber-200/20 bg-amber-200/10 p-6 text-sm text-amber-50">
          {error}
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.length ? (
            results.map((college) => (
              <article
                key={`${college.college}-${college.degree}-${college.branch}`}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl text-white">
                      {college.college}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      {college.city || "Unknown city"}
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                    {college.category}
                  </span>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                    <span>Course</span>
                    <span>
                      {college.degree} {college.branch}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                    <span>Confidence</span>
                    <span>{Math.round(college.confidence * 100)}%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                    <span>Cutoff</span>
                    <span>{college.cutoff}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                    <span>Risk</span>
                    <span className="capitalize">{college.risk}</span>
                  </div>
                  <div className="rounded-2xl bg-black/20 px-4 py-3">
                    <span className="block text-slate-400">Why this appeared</span>
                    <span className="mt-1 block text-white">
                      {college.explanation || college.reason}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              No colleges match this prediction yet. Try changing percentile,
              course, or category.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
