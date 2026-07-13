"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Car, Clock } from "lucide-react";

const customIcon = (color: string, cars: number) => L.divIcon({
  className: "custom-marker-pill-wrapper",
  html: `
    <div class="marker-pill" style="background-color: ${color};">
      ${cars}
    </div>
  `,
  iconSize: [28, 20],
  iconAnchor: [14, 10],
});

function MapUpdater({ selectedPoint }: { selectedPoint: any }) {
  const map = useMap();
  if (selectedPoint) {
    map.flyTo([selectedPoint.lat, selectedPoint.lng], 11, {
      animate: true,
      duration: 1.5
    });
  }
  return null;
}

export default function MapComponent({ points, selectedPoint, vehicleType = 'cars', theme = 'light' }: { points: any[], selectedPoint?: any, vehicleType?: string, theme?: 'light' | 'dark' }) {
  return (
    <MapContainer
      center={[49.5, 31.0]}
      zoom={6}
      minZoom={6}
      maxZoom={12}
      maxBounds={[
        [40.0, 15.0], // South-West 
        [58.0, 45.0]  // North-East (Expanded to allow auto-pan for top popups)
      ]}
      maxBoundsViscosity={1.0}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        url={theme === 'dark' ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
      />
      
      <MapUpdater selectedPoint={selectedPoint} />

      {points.map((p) => {
        const count = vehicleType === 'all' 
          ? (p.queueData?.cars || 0) 
          : (p.queueData?.[vehicleType] ?? p[vehicleType] ?? 0);
        let color = "#10b981"; // solid green
        if (count > 100) color = "#ef4444"; // solid red
        else if (count > 30) color = "#f59e0b"; // solid yellow

        return (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={customIcon(color, count)}>
            <Popup className="custom-popup" autoPanPaddingTopLeft={[0, 140]} autoPanPaddingBottomRight={[0, 20]}>
              <div className="p-1 min-w-[200px] font-sans text-neutral-900 dark:text-neutral-50">
                <h3 className="font-bold text-lg mb-1 tracking-tight">{p.name}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">{p.country?.name}</p>
                
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 flex items-center gap-2 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-700/60 p-3 rounded-xl">
                    <Car className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-bold text-xl leading-none">{p.queueData?.cars ?? 0}</div>
                      <div className="text-[10px] text-neutral-400 font-semibold mt-0.5">у черзі</div>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-2 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-700/60 p-3 rounded-xl">
                    <Clock className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-bold text-xl leading-none">{Math.floor((p.queueData?.waitTimeMins ?? 0) / 60) > 0 ? `${Math.floor((p.queueData?.waitTimeMins ?? 0) / 60)}г` : ''} {(p.queueData?.waitTimeMins ?? 0) % 60}хв</div>
                      <div className="text-[10px] text-neutral-400 font-semibold mt-0.5">очікування</div>
                    </div>
                  </div>
                </div>

                {p.queueData?.lastUpdated && (
                  <div className="text-[10px] text-neutral-400 font-medium text-center">
                    Оновлено: {p.queueData.lastUpdated}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
