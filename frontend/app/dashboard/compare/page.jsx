"use client";

import { useMemo, useState } from "react";

const colleges = [
  {
    name: "North Star Institute",
    fees: "$24k / year",
    placement: "88%",
    facilities: "Hostel, Labs, Sports",
    minority: "No",
    location: "Bangalore",
  },
  {
    name: "Aurora State University",
    fees: "$18k / year",
    placement: "81%",
    facilities: "Labs, Library, Incubator",
    minority: "No",
    location: "Pune",
  },
  {
    name: "Meridian Career College",
    fees: "$14k / year",
    placement: "74%",
    facilities: "Hostel, Library, Language Cell",
    minority: "Yes",
    location: "Hyderabad",
  },
  {
    name: "Summit Tech Academy",
    fees: "$20k / year",
    placement: "83%",
    facilities: "Labs, Hostel, Innovation Hub",
    minority: "No",
    location: "Bangalore",
  },
];

const comparisonRows = [
  { key: "location", label: "Location" },
  { key: "fees", label: "Fees" },
  { key: "placement", label: "Placement" },
  { key: "facilities", label: "Facilities" },
  { key: "minority", label: "Linguistic Minority" },
];

export default function ComparePage() {
  const [leftCollege, setLeftCollege] = useState(colleges[0].name);
  const [rightCollege, setRightCollege] = useState(colleges[1].name);

  const selectedColleges = useMemo(() => {
    return {
      left: colleges.find((college) => college.name === leftCollege),
      right: colleges.find((college) => college.name === rightCollege),
    };
  }, [leftCollege, rightCollege]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
          Select Colleges
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">College 1</span>
            <select
              value={leftCollege}
              onChange={(event) => setLeftCollege(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              {colleges.map((college) => (
                <option key={college.name} value={college.name}>
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
                <option key={college.name} value={college.name}>
                  {college.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

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
    </div>
  );
}
