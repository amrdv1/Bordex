"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Map as MapIcon, List } from "lucide-react";
import PointsList from "../components/PointsList";

const MapComponent = dynamic(() => import("../components/MapComponent"), { ssr: false });

export default function Home() {
  const [view, setView] = useState<"map" | "list">("map");
  const [search, setSearch] = useState("");
  const [points, setPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPoints = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/border-points');
      if (res.ok) {
        const data = await res.json();
        setPoints(data);
      }
    } catch (err) {
      console.error("Failed to fetch points:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
    const interval = setInterval(fetchPoints, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const filteredPoints = points.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.country?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full h-screen bg-neutral-950 text-white overflow-hidden font-sans">
      
      {/* Header / Search Bar */}
      <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-[400] flex items-center gap-3 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 p-2 rounded-2xl shadow-2xl">
        <div className="flex-1 flex items-center bg-neutral-800/50 rounded-xl px-3 py-2">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Поиск пункта пропуска, страны..."
            className="w-full bg-transparent border-none outline-none text-white ml-2 placeholder:text-neutral-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="p-2.5 bg-neutral-800/50 hover:bg-neutral-700 rounded-xl transition-colors">
          <SlidersHorizontal className="w-5 h-5 text-neutral-300" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full h-full z-0">
        {view === "map" ? (
          <MapComponent points={filteredPoints} />
        ) : (
          <PointsList points={filteredPoints} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] flex items-center bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 p-1.5 rounded-full shadow-2xl">
        <button
          onClick={() => setView("map")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all ${
            view === "map" ? "bg-white text-black" : "text-neutral-400 hover:text-white"
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span className="font-medium text-sm">Карта</span>
        </button>
        <button
          onClick={() => setView("list")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all ${
            view === "list" ? "bg-white text-black" : "text-neutral-400 hover:text-white"
          }`}
        >
          <List className="w-4 h-4" />
          <span className="font-medium text-sm">Список</span>
        </button>
      </div>

    </div>
  );
}
