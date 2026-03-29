"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchColleges, getApiBaseUrl } from "@/lib/api";
import { normalizeCollege } from "@/lib/college-utils";

export default function CollegesPage() {
  const [allColleges, setAllColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [location, setLocation] = useState("all");
  const [degree, setDegree] = useState("all");
  const [facility, setFacility] = useState("all");
  const [linguisticMinority, setLinguisticMinority] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const response = await fetchColleges();

        if (!cancelled) {
          setAllColleges(response.colleges.map(normalizeCollege));
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

  const locationOptions = useMemo(
    () => Array.from(new Set(allColleges.map((college) => college.city))).sort(),
    [allColleges],
  );

  const degreeOptions = useMemo(
    () =>
      Array.from(
        new Set(allColleges.flatMap((college) => college.degrees || [])),
      ).sort(),
    [allColleges],
  );

  const facilityOptions = useMemo(
    () =>
      Array.from(
        new Set(allColleges.flatMap((college) => college.facilities || [])),
      ).sort(),
    [allColleges],
  );

  const filteredColleges = useMemo(() => {
    return allColleges.filter((college) => {
      const matchesLocation = location === "all" || college.city === location;
      const matchesDegree =
        degree === "all" || college.degrees.includes(degree);
      const matchesFacility =
        facility === "all" || college.facilities.includes(facility);
      const matchesMinority =
        linguisticMinority === "all" ||
        (linguisticMinority === "yes" && college.linguisticMinority) ||
        (linguisticMinority === "no" && !college.linguisticMinority);

      return (
        matchesLocation &&
        matchesDegree &&
        matchesFacility &&
        matchesMinority
      );
    });
  }, [allColleges, location, degree, facility, linguisticMinority]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.26em] text-sky-200/80">
              Smart College Search Filters
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Live data from your FastAPI backend.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
            Source: {getApiBaseUrl()}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Location</span>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All</option>
              {locationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Degree</span>
            <select
              value={degree}
              onChange={(event) => setDegree(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All</option>
              {degreeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Facility</span>
            <select
              value={facility}
              onChange={(event) => setFacility(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All</option>
              {facilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
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

      {loading ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          Loading colleges from the backend...
        </div>
      ) : error ? (
        <div className="rounded-[1.75rem] border border-amber-200/20 bg-amber-200/10 p-6 text-sm text-amber-50">
          {error}
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredColleges.length ? (
            filteredColleges.map((college) => (
              <article
                key={college.id}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl"
              >
                <h2 className="font-display text-3xl text-white">{college.name}</h2>
                <p className="mt-2 text-sm text-slate-400">
                  {college.city}, {college.state} | {college.featuredCourse}
                </p>

                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                    <span>Total Fees</span>
                    <span>{college.feesLabel}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                    <span>Placement</span>
                    <span>{college.placementLabel}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                    <span>Average Package</span>
                    <span>{college.avgPackageLabel}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                    <span>ROI Score</span>
                    <span>{college.roiLabel}</span>
                  </div>
                  <div className="rounded-2xl bg-black/20 px-4 py-3">
                    <span className="block text-slate-400">Facilities</span>
                    <span className="mt-1 block text-white">
                      {college.facilities.join(", ") || "Not available"}
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
              No colleges match these filters right now.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
