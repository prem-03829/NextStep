"use client";

import React, { useState, useMemo } from "react";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import { 
  Search, 
  Copy, 
  X, 
  Expand, 
  Shrink,
  Check,
  FileCode,
  ListTree
} from "lucide-react";

export default function JsonViewer({ data, title = "Master Data Inspector" }) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false); // Default to FALSE for full expansion
  const [viewMode, setViewMode] = useState("interactive"); // 'interactive' or 'raw'
  const [copied, setCopied] = useState(false);

  const filteredData = useMemo(() => {
    if (!search) return data;
    if (Array.isArray(data)) {
      return data.filter(item => 
        JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
      );
    }
    return data;
  }, [data, search]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl flex flex-col h-full min-h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          <h3 className="text-sm font-medium text-slate-200 uppercase tracking-widest">{title}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-white/5 rounded-lg p-1 mr-2 border border-white/5">
            <button 
              onClick={() => setViewMode("interactive")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "interactive" ? "bg-sky-500/20 text-sky-400" : "text-slate-500 hover:text-slate-300"}`}
              title="Tree View"
            >
              <ListTree size={16} />
            </button>
            <button 
              onClick={() => setViewMode("raw")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "raw" ? "bg-sky-500/20 text-sky-400" : "text-slate-500 hover:text-slate-300"}`}
              title="Raw Text View"
            >
              <FileCode size={16} />
            </button>
          </div>

          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors border border-white/5"
            title={collapsed ? "Expand All" : "Collapse All"}
          >
            {collapsed ? <Expand size={16} /> : <Shrink size={16} />}
          </button>
          <button 
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors border border-white/5"
            title="Copy Full JSON"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-white/5 bg-black/20">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search all content..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-9 py-2 text-sm text-slate-300 focus:outline-none focus:border-sky-500/50 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-[#0a0a0a]">
        <style jsx global>{`
          .rv-container { background-color: transparent !important; color: #d1d5db !important; padding: 20px !important; }
          .rv-key { color: #93c5fd !important; }
          .rv-string { color: #fbbf24 !important; }
          .rv-number { color: #f472b6 !important; }
          .rv-boolean { color: #c084fc !important; }
          .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        `}</style>
        
        {viewMode === "interactive" ? (
          <JsonView 
            src={filteredData} 
            collapsed={collapsed}
            enableClipboard={false}
            displaySize={true}
            displayDataTypes={false}
            dark={true}
          />
        ) : (
          <pre className="p-6 text-[12px] leading-relaxed text-slate-300 whitespace-pre-wrap font-mono">
            {JSON.stringify(filteredData, null, 2)}
          </pre>
        )}
        
        {(!filteredData || filteredData.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Search size={32} className="opacity-20 mb-4" />
            <p>No matches found in the dataset</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/5 bg-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-500 font-medium">
        <span>Total Records: {Array.isArray(data) ? data.length : "1 Object"}</span>
        <span>Showing All Content</span>
      </div>
    </div>
  );
}
