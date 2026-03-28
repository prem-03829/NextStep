"use client";

import { useMemo, useState } from "react";

const colleges = [
  {
    name: "North Star Institute",
    course: "B.Tech CSE",
    scoreRange: [88, 99],
    category: "Open",
    city: "Bangalore",
    chance: "High",
  },
  {
    name: "Aurora State University",
    course: "B.Tech AI",
    scoreRange: [78, 92],
    category: "Open",
    city: "Pune",
    chance: "Medium",
  },
  {
    name: "Meridian Career College",
    course: "BCA",
    scoreRange: [65, 86],
    category: "Linguistic Minority",
    city: "Hyderabad",
    chance: "High",
  },
  {
    name: "Summit Tech Academy",
    course: "MBA",
    scoreRange: [72, 90],
    category: "Open",
    city: "Bangalore",
    chance: "Medium",
  },
];

export default function PredictorPage() {
  const [score, setScore] = useState(85);
  const [course, setCourse] = useState("all");
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("all");

  const predictedColleges = useMemo(() => {
    return colleges.filter((college) => {
      const matchesScore =
        score >= college.scoreRange[0] && score <= college.scoreRange[1];
      const matchesCourse = course === "all" || college.course === course;
      const matchesCategory =
        category === "all" || college.category === category;
      const matchesCity = city === "all" || college.city === city;

      return matchesScore && matchesCourse && matchesCategory && matchesCity;
    });
  }, [score, course, category, city]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
          Prediction Inputs
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Exam Score</span>
            <input
              type="range"
              min="50"
              max="99"
              value={score}
              onChange={(event) => setScore(Number(event.target.value))}
              className="w-full accent-sky-300"
            />
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
              {score} percentile
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Course</span>
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All</option>
              <option value="B.Tech CSE">B.Tech CSE</option>
              <option value="B.Tech AI">B.Tech AI</option>
              <option value="BCA">BCA</option>
              <option value="MBA">MBA</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All</option>
              <option value="Open">Open</option>
              <option value="Linguistic Minority">Linguistic Minority</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Preferred City</span>
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {predictedColleges.length ? (
          predictedColleges.map((college) => (
            <article
              key={college.name}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-white">
                    {college.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">{college.city}</p>
                </div>
                <span className="rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                  {college.chance}
                </span>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                  <span>Course</span>
                  <span>{college.course}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                  <span>Score Range</span>
                  <span>
                    {college.scoreRange[0]} - {college.scoreRange[1]}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                  <span>Category</span>
                  <span>{college.category}</span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            No colleges match this prediction yet. Try widening the score,
            city, or category filters.
          </div>
        )}
      </section>
    </div>
  );
}
