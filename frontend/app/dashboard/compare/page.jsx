"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchColleges, getApiBaseUrl } from "@/lib/api";
import { normalizeCollege } from "@/lib/college-utils";

const comparisonRows = [
  { key: "city", label: "City" },
  { key: "featuredCourse", label: "Featured Course" },
  { key: "feesLabel", label: "Fees" },
  { key: "placementLabel", label: "Placement" },
  { key: "avgPackageLabel", label: "Average Package" },
  { key: "roiLabel", label: "ROI" },
];

export default function ComparePage() {
  const [colleges, setColleges] = useState([]);
  const [leftCollege, setLeftCollege] = useState("");
  const [rightCollege, setRightCollege] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const response = await fetchColleges();
        const normalized = response.colleges.map(normalizeCollege).slice(0, 30);

        if (!cancelled) {
          setColleges(normalized);
          setLeftCollege(normalized[0]?.name || "");
          setRightCollege(normalized[1]?.name || normalized[0]?.name || "");
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            `Could not load colleges from ${getApiBaseUrl()}. Start the backend and try again.`,
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedColleges = useMemo(() => {
    return {
      left: colleges.find((college) => college.name === leftCollege),
      right: colleges.find((college) => college.name === rightCollege),
    };
  }, [colleges, leftCollege, rightCollege]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
            Compare Colleges
          </p>
          <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
            Source: {getApiBaseUrl()}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">College 1</span>
            <select
              value={leftCollege}
              onChange={(event) => setLeftCollege(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              {colleges.map((college) => (
                <option key={college.id} value={college.name}>
                  {college.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">College 2</span>
            <select
              value={rightCollege}
              onChange={(event) => setRightCollege(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              {colleges.map((college) => (
                <option key={college.id} value={college.name}>
                  {college.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {loading ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          Loading colleges for comparison...
        </div>
      ) : error ? (
        <div className="rounded-[1.75rem] border border-amber-200/20 bg-amber-200/10 p-6 text-sm text-amber-50">
          {error}
        </div>
      ) : (
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-soft backdrop-blur-xl">
          <div className="grid grid-cols-3 border-b border-white/10 bg-black/20">
            <div className="px-6 py-4 text-sm uppercase tracking-[0.2em] text-slate-400">
              Criteria
            </div>
            <div className="px-6 py-4 font-display text-xl text-white">
              {selectedColleges.left?.name}
            </div>
            <div className="px-6 py-4 font-display text-xl text-white">
              {selectedColleges.right?.name}
            </div>
          </div>

          {comparisonRows.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-1 border-b border-white/10 last:border-b-0 md:grid-cols-3"
            >
              <div className="bg-black/10 px-6 py-4 text-sm text-slate-300">
                {row.label}
              </div>
              <div className="px-6 py-4 text-sm text-white">
                {selectedColleges.left?.[row.key]}
              </div>
              <div className="px-6 py-4 text-sm text-white">
                {selectedColleges.right?.[row.key]}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
