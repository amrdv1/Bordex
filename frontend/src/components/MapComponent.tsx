"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Car, Truck, Bus, Clock } from "lucide-react";

function getWaitDisplay(point: any) {
  const qd = point.queueData;
  if (!qd) return { label: '0хв', mins: 0 };

  // For Granica data, use per-vehicle-type hours
  if (qd.carsWaitHours !== undefined) {
    const maxHours = Math.max(qd.carsWaitHours || 0, qd.trucksWaitHours || 0, qd.busesWaitHours || 0);
    const totalMins = Math.round(maxHours * 60);
    if (totalMins >= 60) return { label: `${Math.floor(totalMins / 60)}г ${totalMins % 60}хв`, mins: totalMins };
    return { label: `${totalMins}хв`, mins: totalMins };
  }

  // For Nakordoni data, use waitTimeMins
  const mins = qd.waitTimeMins || 0;
  if (mins >= 60) return { label: `${Math.floor(mins / 60)}г ${mins % 60}хв`, mins };
  return { label: `${mins}хв`, mins };
}

function getPillValue(point: any) {
  const qd = point.queueData;
  if (!qd) return 0;

  // For Granica: show max wait hours as the pill value
  if (qd.carsWaitHours !== undefined) {
    const maxH = Math.max(qd.carsWaitHours || 0, qd.trucksWaitHours || 0, qd.busesWaitHours || 0);
    return maxH > 0 ? `${maxH}г` : '0';
  }

  // For Nakordoni: show queue count
  return qd.cars || 0;
}

const customIcon = (color: string, label: string | number) => L.divIcon({
  className: "custom-marker-pill-wrapper",
  html: `
    <div class="marker-pill" style="background-color: ${color};">
      ${label}
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
        [40.0, 15.0],
        [58.0, 45.0]
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
        const wait = getWaitDisplay(p);
        const pillVal = getPillValue(p);
        const isGranica = p.queueData?.carsWaitHours !== undefined;
        
        // Color based on wait time in minutes
        let color = "#10b981"; // green
        if (wait.mins > 180) color = "#ef4444"; // red (>3h)
        else if (wait.mins > 60) color = "#f59e0b"; // yellow (>1h)

        return (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={customIcon(color, pillVal)}>
            <Popup className="custom-popup" autoPanPaddingTopLeft={[0, 140]} autoPanPaddingBottomRight={[0, 20]}>
              <div className="p-1 min-w-[220px] font-sans text-neutral-900 dark:text-neutral-50">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg tracking-tight">{p.name}</h3>
                  {p.source && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider">
                      {p.source === 'granica.gov.pl' ? '🇵🇱 офіц.' : '🌐'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">{p.country?.name}</p>
                
                {isGranica ? (
                  /* Granica: show per-vehicle-type wait times */
                  <div className="flex flex-col gap-1.5 mb-3">
                    <div className="flex items-center gap-2 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-700/60 p-2.5 rounded-xl">
                      <Car className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-xs text-neutral-500 flex-1">Легкові</span>
                      <span className="font-bold text-sm">{p.queueData.carsWaitHours > 0 ? `${p.queueData.carsWaitHours} год` : '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-700/60 p-2.5 rounded-xl">
                      <Truck className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="text-xs text-neutral-500 flex-1">Вантажні</span>
                      <span className="font-bold text-sm">{p.queueData.trucksWaitHours > 0 ? `${p.queueData.trucksWaitHours} год` : '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-700/60 p-2.5 rounded-xl">
                      <Bus className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-xs text-neutral-500 flex-1">Автобуси</span>
                      <span className="font-bold text-sm">{p.queueData.busesWaitHours > 0 ? `${p.queueData.busesWaitHours} год` : '—'}</span>
                    </div>
                  </div>
                ) : (
                  /* Nakordoni: show queue count + wait time */
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
                        <div className="font-bold text-xl leading-none">{wait.label}</div>
                        <div className="text-[10px] text-neutral-400 font-semibold mt-0.5">очікування</div>
                      </div>
                    </div>
                  </div>
                )}

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
