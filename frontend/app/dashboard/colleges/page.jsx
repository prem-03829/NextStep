"use client";

import { useMemo, useState } from "react";

const colleges = [
  {
    name: "North Star Institute",
    course: "B.Tech CSE",
    fees: "$24k / year",
    placement: "88%",
    location: "Bangalore",
    budget: "high",
    facilities: ["Hostel", "Labs", "Sports"],
    linguisticMinority: false,
  },
  {
    name: "Aurora State University",
    course: "B.Tech AI",
    fees: "$18k / year",
    placement: "81%",
    location: "Pune",
    budget: "mid",
    facilities: ["Labs", "Library", "Incubator"],
    linguisticMinority: false,
  },
  {
    name: "Meridian Career College",
    course: "BCA",
    fees: "$14k / year",
    placement: "74%",
    location: "Hyderabad",
    budget: "low",
    facilities: ["Hostel", "Library", "Language Cell"],
    linguisticMinority: true,
  },
  {
    name: "Summit Tech Academy",
    course: "MBA",
    fees: "$20k / year",
    placement: "83%",
    location: "Bangalore",
    budget: "mid",
    facilities: ["Labs", "Hostel", "Innovation Hub"],
    linguisticMinority: false,
  },
];

export default function CollegesPage() {
  const [fees, setFees] = useState("all");
  const [location, setLocation] = useState("all");
  const [course, setCourse] = useState("all");
  const [placement, setPlacement] = useState("all");
  const [facility, setFacility] = useState("all");
  const [linguisticMinority, setLinguisticMinority] = useState("all");

  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      const matchesFees = fees === "all" || college.budget === fees;
      const matchesLocation =
        location === "all" || college.location === location;
      const matchesCourse = course === "all" || college.course === course;
      const matchesPlacement =
        placement === "all" ||
        (placement === "high" && Number.parseInt(college.placement, 10) >= 85) ||
        (placement === "mid" &&
          Number.parseInt(college.placement, 10) >= 75 &&
          Number.parseInt(college.placement, 10) < 85) ||
        (placement === "entry" && Number.parseInt(college.placement, 10) < 75);
      const matchesFacility =
        facility === "all" || college.facilities.includes(facility);
      const matchesMinority =
        linguisticMinority === "all" ||
        (linguisticMinority === "yes" && college.linguisticMinority) ||
        (linguisticMinority === "no" && !college.linguisticMinority);

      return (
        matchesFees &&
        matchesLocation &&
        matchesCourse &&
        matchesPlacement &&
        matchesFacility &&
        matchesMinority
      );
    });
  }, [fees, location, course, placement, facility, linguisticMinority]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
          Smart College Search Filters
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Fees</span>
            <select
              value={fees}
              onChange={(event) => setFees(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="mid">Mid</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Location</span>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
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
            <span className="text-sm text-slate-300">Placement</span>
            <select
              value={placement}
              onChange={(event) => setPlacement(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All</option>
              <option value="high">85% and above</option>
              <option value="mid">75% to 84%</option>
              <option value="entry">Below 75%</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Facilities</span>
            <select
              value={facility}
              onChange={(event) => setFacility(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All</option>
              <option value="Hostel">Hostel</option>
              <option value="Labs">Labs</option>
              <option value="Library">Library</option>
              <option value="Sports">Sports</option>
              <option value="Incubator">Incubator</option>
              <option value="Language Cell">Language Cell</option>
              <option value="Innovation Hub">Innovation Hub</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Linguistic Minority</span>
            <select
              value={linguisticMinority}
              onChange={(event) => setLinguisticMinority(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredColleges.length ? (
          filteredColleges.map((college) => (
            <article
              key={college.name}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl"
            >
              <h2 className="font-display text-3xl text-white">{college.name}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {college.location} | {college.course}
              </p>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                  <span>Fees</span>
                  <span>{college.fees}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                  <span>Placement</span>
                  <span>{college.placement}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                  <span>Budget Tier</span>
                  <span className="capitalize">{college.budget}</span>
                </div>
                <div className="rounded-2xl bg-black/20 px-4 py-3">
                  <span className="block text-slate-400">Facilities</span>
                  <span className="mt-1 block text-white">
                    {college.facilities.join(", ")}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                  <span>Linguistic Minority</span>
                  <span>{college.linguisticMinority ? "Yes" : "No"}</span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            No colleges match these filters right now. Try broadening fees,
            course, or placement selections.
          </div>
        )}
      </section>
    </div>
  );
}
