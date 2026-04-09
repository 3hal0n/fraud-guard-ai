"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// Example interface - connect this to your actual API later
interface GeoData {
  id: string;
  lat: number;
  lng: number;
  status: "safe" | "risk";
  amount: number;
  city: string;
}

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      window.requestAnimationFrame(() => {
        map.invalidateSize();
      });
    };

    invalidate();
    window.addEventListener("resize", invalidate);

    return () => window.removeEventListener("resize", invalidate);
  }, [map]);

  return null;
}

export default function GlobalThreatMap({ data }: { data: GeoData[] }) {
  const [zoomLevel, setZoomLevel] = useState(2.5);

  // Auto-adjust initial zoom for mobile devices to prevent clipping
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setZoomLevel(1.5);
    }
  }, []);

  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={zoomLevel} 
      minZoom={1.5}
      scrollWheelZoom={true}
      className="w-full h-full min-h-[50vh] md:min-h-0 z-0"
    >
      <ResizeMap />
      {/* Dark Mode CartoDB Tile Layer - Critical for the "Sentinel" aesthetic */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {data.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          // Adjust radius slightly for mobile if needed, but 8/4 is usually fine
          radius={point.status === "risk" ? 8 : 4} 
          pathOptions={{
            color: point.status === "risk" ? "#ef4444" : "#06b6d4", // Red for risk, Cyan for safe
            fillColor: point.status === "risk" ? "#ef4444" : "#06b6d4",
            fillOpacity: point.status === "risk" ? 0.7 : 0.4,
            weight: 1,
          }}
        >
          <Popup className="bg-[#0A0A0A] border-white/10 text-white">
            <div className="text-sm min-w-[120px]">
              <strong className="block text-base mb-1">{point.city}</strong>
              <span className={point.status === "risk" ? "text-red-400 font-bold" : "text-cyan-400 font-bold"}>
                {point.status === "risk" ? "BLOCKED" : "CLEARED"}
              </span>
              <br />
              <span className="text-slate-400">Amount: </span> 
              ${point.amount.toLocaleString()}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}