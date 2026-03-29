"use client";

import { useEffect, useState } from "react";
import JsonViewer from "@/components/JsonViewer";
import { Database, Search, Filter, ShieldCheck, Loader2 } from "lucide-react";

export default function DatabaseExplorerPage() {
  const [collegeData, setCollegeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the Next.js server route that reads from backend/data
    fetch("/api/database")
      .then((res) => {
        if (!res.ok) throw new Error("Database sync error");
        return res.json();
      })
      .then((data) => {
        setCollegeData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to stream master database. Ensure the backend file exists at 'backend/data/college_data_final.json'.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl p-8 shadow-soft group relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-indigo-500/10 text-sky-200">
              <Database className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">
                Core Assets
              </p>
              <h1 className="text-3xl md:text-4xl font-display text-white tracking-tight">
                Master College Database
              </h1>
            </div>
          </div>
          
          <p className="max-w-2xl text-slate-300 leading-relaxed text-lg">
            Explore the complete dataset powering NextStep. Use the interactive inspector 
            to browse through institutional data, placement records, and cutoff statistics.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
              <Search className="h-4 w-4 text-sky-400" />
              <span className="text-sm text-slate-300">Live Search</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
              <Filter className="h-4 w-4 text-orange-300" />
              <span className="text-sm text-slate-300">Filtered Views</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-slate-300">Verified Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature: JSON Viewer */}
      <section className="h-[700px] relative">
        {loading ? (
          <div className="h-full w-full flex flex-col items-center justify-center bg-black/40 rounded-3xl border border-white/5">
            <Loader2 className="h-10 w-10 text-sky-400 animate-spin mb-4" />
            <p className="text-slate-400 text-sm animate-pulse">Initializing Data Stream...</p>
          </div>
        ) : error ? (
          <div className="h-full w-full flex flex-col items-center justify-center bg-red-500/10 rounded-3xl border border-red-500/20 p-8 text-center">
            <Database className="h-12 w-12 text-red-400 mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-red-200 mb-2">Sync Error</h3>
            <p className="text-red-300/70 max-w-md">{error}</p>
          </div>
        ) : (
          <JsonViewer data={collegeData} title="Structured College Dataset" />
        )}
      </section>
      
      <div className="flex justify-center pb-10">
        <p className="text-xs text-slate-500 uppercase tracking-widest bg-white/5 px-6 py-2 rounded-full border border-white/5">
          End of Data stream • NextStep v1.0
        </p>
      </div>
    </div>
  );
}
