"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Car, Truck, Bus, Users, Clock } from "lucide-react";

const customIcon = (color: string) => L.divIcon({
  className: "custom-marker",
  html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function MapComponent({ points }: { points: any[] }) {
  return (
    <MapContainer
      center={[49.5, 27.5]}
      zoom={6}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
      />

      {points.map((p) => {
        let color = "#10b981"; // green
        if (p.queueData?.cars > 100) color = "#ef4444"; // red
        else if (p.queueData?.cars > 50) color = "#f59e0b"; // yellow

        return (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={customIcon(color)}>
            <Popup className="custom-popup">
              <div className="p-1 min-w-[200px] font-sans text-neutral-800">
                <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                <p className="text-sm text-neutral-500 mb-3">{p.country?.name}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-lg">
                    <Car className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-sm">{p.queueData?.cars ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-lg">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-sm">{p.queueData?.trucks ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-lg">
                    <Bus className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-sm">{p.queueData?.buses ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-lg">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-sm">{p.queueData?.pedestrians ?? 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-2 rounded-lg font-medium text-sm">
                  <Clock className="w-4 h-4" />
                  Ожидание: {Math.floor((p.queueData?.waitTimeMins ?? 0) / 60)}ч {(p.queueData?.waitTimeMins ?? 0) % 60}м
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
