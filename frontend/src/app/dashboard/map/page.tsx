"use client";

import AppLayout from "@/components/AppLayout";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";

// Dynamically import the map so it only loads on the client side
const DynamicMap = dynamic(() => import("@/components/GlobalThreatMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-cyan-400">Initializing Satellite Uplink...</div>,
});

export default function ThreatMapPage() {
  const [filter, setFilter] = useState<"all" | "risk" | "safe">("all");

  // TODO: Fetch this from your backend API
  const mockGeoData = [
    { id: "1", lat: 55.7558, lng: 37.6173, status: "risk", amount: 85000, city: "Moscow, RU" },
    { id: "2", lat: 40.7128, lng: -74.0060, status: "safe", amount: 120, city: "New York, USA" },
    { id: "3", lat: 9.0820, lng: 8.6753, status: "risk", amount: 4500, city: "Abuja, NG" },
    { id: "4", lat: 51.5074, lng: -0.1278, status: "safe", amount: 85, city: "London, UK" },
  ];

  const filteredData = useMemo(() => {
    if (filter === "all") return mockGeoData;
    return mockGeoData.filter((d) => d.status === filter);
  }, [filter]);

  return (
    <AppLayout>
      <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 max-w-7xl mx-auto">
        
        {/* Header & Controls */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-medium text-white tracking-tight">Global Threat Map</h1>
            <p className="text-slate-400 mt-1">Real-time geographic distribution of transaction origins.</p>
          </div>
          
          {/* Floating Filter Controls */}
          <div className="flex bg-[#0A0A0A] border border-white/10 rounded-xl p-1">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === "all" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Global View
            </button>
            <button 
              onClick={() => setFilter("risk")}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${filter === "risk" ? "bg-red-500/20 text-red-400" : "text-slate-400 hover:text-red-400"}`}
            >
              <div className="w-2 h-2 rounded-full bg-red-500" /> High Risk
            </button>
            <button 
              onClick={() => setFilter("safe")}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${filter === "safe" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-cyan-400"}`}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-500" /> Cleared
            </button>
          </div>
        </div>

        {/* The Map Container */}
        <div className="flex-1 w-full bg-[#0A0A0A] rounded-2xl border border-white/5 shadow-2xl relative">
            <DynamicMap data={filteredData as any} />
        </div>

      </div>
    </AppLayout>
  );
}