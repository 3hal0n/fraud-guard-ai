"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Example interface - connect this to your actual API later
interface GeoData {
  id: string;
  lat: number;
  lng: number;
  status: "safe" | "risk";
  amount: number;
  city: string;
}

export default function GlobalThreatMap({ data }: { data: GeoData[] }) {
  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={2.5} 
      className="w-full h-full rounded-2xl border border-white/10 z-0"
    >
      {/* Dark Mode CartoDB Tile Layer - Critical for the "Sentinel" aesthetic */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {data.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          radius={point.status === "risk" ? 8 : 4} // Make risk points larger
          pathOptions={{
            color: point.status === "risk" ? "#ef4444" : "#06b6d4", // Red for risk, Cyan for safe
            fillColor: point.status === "risk" ? "#ef4444" : "#06b6d4",
            fillOpacity: point.status === "risk" ? 0.7 : 0.4,
            weight: 1,
          }}
        >
          <Popup className="bg-[#0A0A0A] border-white/10 text-white">
            <div className="text-sm">
              <strong className="block text-base mb-1">{point.city}</strong>
              <span className={point.status === "risk" ? "text-red-400" : "text-cyan-400"}>
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