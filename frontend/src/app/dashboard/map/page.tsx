"use client";

import AppLayout from "@/components/AppLayout";
import dynamic from "next/dynamic";
import { getTransactions, TransactionRecord } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";

type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  status: "risk" | "safe";
  amount: number;
  city: string;
};

type Coordinates = {
  lat: number;
  lng: number;
};

// Dynamically import the map so it only loads on the client side
const DynamicMap = dynamic<{ data: MapPoint[] }>(() => import("@/components/GlobalThreatMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-cyan-400">Initializing Satellite Uplink...</div>,
});

const LOCATION_PRESETS: Record<string, Coordinates> = {
  "colombo": { lat: 6.9271, lng: 79.8612 },
  "negombo": { lat: 7.2084, lng: 79.8358 },
  "sri lanka": { lat: 7.8731, lng: 80.7718 },
  "lk": { lat: 7.8731, lng: 80.7718 },
  "united states": { lat: 39.8283, lng: -98.5795 },
  "usa": { lat: 39.8283, lng: -98.5795 },
  "uk": { lat: 55.3781, lng: -3.436 },
  "united kingdom": { lat: 55.3781, lng: -3.436 },
};

function normalizeLocation(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getPresetCoordinates(location: string): Coordinates | null {
  const normalized = normalizeLocation(location);
  if (LOCATION_PRESETS[normalized]) return LOCATION_PRESETS[normalized];

  const segments = normalized
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  for (const segment of segments) {
    if (LOCATION_PRESETS[segment]) return LOCATION_PRESETS[segment];
  }

  return null;
}

async function geocodeLocation(location: string): Promise<Coordinates | null> {
  const preset = getPresetCoordinates(location);
  if (preset) return preset;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`
    );

    if (!response.ok) return null;

    const results = (await response.json()) as Array<{ lat: string; lon: string }>;
    if (!results.length) return null;

    return {
      lat: Number(results[0].lat),
      lng: Number(results[0].lon),
    };
  } catch {
    return null;
  }
}

function toMapPoint(txn: TransactionRecord, coords: Coordinates): MapPoint {
  return {
    id: txn.id,
    lat: coords.lat,
    lng: coords.lng,
    status: txn.status,
    amount: Number(txn.amount ?? 0),
    city: (txn.location || "Unknown").trim() || "Unknown",
  };
}

export default function ThreatMapPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  let user: { id?: string } | null = null;
  if (clerkEnabled) {
    const u = useUser();
    user = u?.user ?? null;
  }

  const [filter, setFilter] = useState<"all" | "risk" | "safe">("all");
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadMapData() {
      if (!user?.id) {
        setPoints([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const txns = await getTransactions(user.id, 200);
        const withLocation = txns.filter((txn) => (txn.location || "").trim().length > 0);
        const uniqueLocations = Array.from(new Set(withLocation.map((txn) => (txn.location || "").trim())));

        const coordCache = new Map<string, Coordinates | null>();
        for (const location of uniqueLocations) {
          const coords = await geocodeLocation(location);
          coordCache.set(location, coords);
        }

        const mappedPoints = withLocation
          .map((txn) => {
            const key = (txn.location || "").trim();
            const coords = coordCache.get(key);
            if (!coords) return null;
            return toMapPoint(txn, coords);
          })
          .filter((point): point is MapPoint => point !== null);

        if (!isCancelled) {
          setPoints(mappedPoints);
        }
      } catch {
        if (!isCancelled) {
          setError("Failed to load map data from transaction history.");
          setPoints([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadMapData();

    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  const filteredData = useMemo(() => {
    if (filter === "all") return points;
    return points.filter((d) => d.status === filter);
  }, [filter, points]);

  return (
    <AppLayout>
      {/* Added responsive padding, min-heights, and spacing */}
      <div className="min-h-[calc(100vh-100px)] md:h-[calc(100vh-100px)] flex flex-col space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-0">
        
        {/* Header & Controls: Stacks on mobile, row on desktop */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">Global Threat Map</h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1">Geographic distribution of your saved transaction locations.</p>
          </div>
          
          {/* Floating Filter Controls: Wraps on small screens */}
          <div className="flex flex-wrap w-full md:w-auto bg-[#0A0A0A] border border-white/10 rounded-xl p-1 gap-1">
            <button 
              onClick={() => setFilter("all")}
              className={`flex-1 md:flex-none justify-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all ${filter === "all" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Global
            </button>
            <button 
              onClick={() => setFilter("risk")}
              className={`flex-1 md:flex-none justify-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all flex items-center gap-2 ${filter === "risk" ? "bg-red-500/20 text-red-400" : "text-slate-400 hover:text-red-400"}`}
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500" /> High Risk
            </button>
            <button 
              onClick={() => setFilter("safe")}
              className={`flex-1 md:flex-none justify-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all flex items-center gap-2 ${filter === "safe" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-cyan-400"}`}
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-500" /> Cleared
            </button>
          </div>
        </div>

        {/* The Map Container: Fixed mobile height, hidden overflow for clean borders */}
        <div className="flex-1 w-full min-h-[50vh] md:min-h-0 bg-[#0A0A0A] rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden z-0">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Loading transaction locations...</div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center text-red-400 text-sm">{error}</div>
          ) : filteredData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm text-center px-6">
              No mapped locations found yet. Submit scans with city/country values such as Colombo, Sri Lanka or Negombo.
            </div>
          ) : (
            <DynamicMap data={filteredData} />
          )}
        </div>

      </div>
    </AppLayout>
  );
}