"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Map as MapIcon, List, Car, Truck, Bus, Users, Activity, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PointsList from "../components/PointsList";

const MapComponent = dynamic(() => import("../components/MapComponent"), { ssr: false });

const MOCK_POINTS = [
  { id: '1', name: 'Ягодин', lat: 51.2185, lng: 23.8058, country: { name: 'Польща' }, isOpen: true, queueData: { cars: 120, trucks: 45, buses: 2, pedestrians: 0, waitTimeMins: 240 } },
  { id: '2', name: 'Устилуг', lat: 50.8587, lng: 24.1561, country: { name: 'Польща' }, isOpen: true, queueData: { cars: 30, trucks: 10, buses: 1, pedestrians: 0, waitTimeMins: 60 } },
  { id: '3', name: 'Угринів', lat: 50.5843, lng: 24.1039, country: { name: 'Польща' }, isOpen: true, queueData: { cars: 15, trucks: 0, buses: 0, pedestrians: 0, waitTimeMins: 30 } },
  { id: '4', name: 'Рава-Руська', lat: 50.2588, lng: 23.5936, country: { name: 'Польща' }, isOpen: true, queueData: { cars: 50, trucks: 20, buses: 3, pedestrians: 15, waitTimeMins: 120 } },
  { id: '5', name: 'Грушів', lat: 50.1215, lng: 23.3276, country: { name: 'Польща' }, isOpen: true, queueData: { cars: 40, trucks: 5, buses: 1, pedestrians: 0, waitTimeMins: 80 } },
  { id: '6', name: 'Краківець', lat: 49.9575, lng: 23.0232, country: { name: 'Польща' }, isOpen: true, queueData: { cars: 85, trucks: 20, buses: 5, pedestrians: 10, waitTimeMins: 150 } },
  { id: '7', name: 'Шегині', lat: 49.7981, lng: 22.9511, country: { name: 'Польща' }, isOpen: true, queueData: { cars: 30, trucks: 10, buses: 0, pedestrians: 50, waitTimeMins: 60 } },
  { id: '8', name: 'Смільниця', lat: 49.4673, lng: 22.7845, country: { name: 'Польща' }, isOpen: true, queueData: { cars: 0, trucks: 0, buses: 0, pedestrians: 0, waitTimeMins: 0 } },
  { id: '9', name: 'Ужгород', lat: 48.6083, lng: 22.2514, country: { name: 'Словаччина' }, isOpen: true, queueData: { cars: 15, trucks: 5, buses: 1, pedestrians: 0, waitTimeMins: 30 } },
  { id: '10', name: 'Малий Березний', lat: 48.8872, lng: 22.4283, country: { name: 'Словаччина' }, isOpen: true, queueData: { cars: 5, trucks: 0, buses: 0, pedestrians: 0, waitTimeMins: 10 } },
  { id: '11', name: 'Чоп (Тиса)', lat: 48.4239, lng: 22.1818, country: { name: 'Угорщина' }, isOpen: true, queueData: { cars: 110, trucks: 30, buses: 4, pedestrians: 0, waitTimeMins: 200 } },
  { id: '12', name: 'Лужанка', lat: 48.1678, lng: 22.6567, country: { name: 'Угорщина' }, isOpen: true, queueData: { cars: 20, trucks: 0, buses: 0, pedestrians: 5, waitTimeMins: 40 } },
  { id: '13', name: 'Дякове', lat: 48.0125, lng: 23.0456, country: { name: 'Румунія' }, isOpen: true, queueData: { cars: 45, trucks: 15, buses: 0, pedestrians: 0, waitTimeMins: 90 } },
  { id: '14', name: 'Порубне', lat: 48.0142, lng: 26.0628, country: { name: 'Румунія' }, isOpen: true, queueData: { cars: 70, trucks: 40, buses: 2, pedestrians: 20, waitTimeMins: 140 } },
  { id: '15', name: 'Паланка', lat: 46.4089, lng: 30.0921, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 55, trucks: 10, buses: 1, pedestrians: 0, waitTimeMins: 110 } },
  { id: '16', name: 'Маяки-Удобне', lat: 46.4161, lng: 30.2503, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 25, trucks: 5, buses: 0, pedestrians: 0, waitTimeMins: 50 } },
  { id: '17', name: 'Орлівка', lat: 45.2751, lng: 28.4526, country: { name: 'Румунія' }, isOpen: true, queueData: { cars: 10, trucks: 60, buses: 2, pedestrians: 0, waitTimeMins: 180 } },
  { id: '18', name: 'Рені', lat: 45.4262, lng: 28.2120, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 5, trucks: 30, buses: 0, pedestrians: 0, waitTimeMins: 90 } },
  { id: '19', name: 'Виноградівка', lat: 45.6961, lng: 28.5713, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 2, trucks: 0, buses: 0, pedestrians: 0, waitTimeMins: 5 } },
  { id: '20', name: 'Табаки', lat: 45.7483, lng: 28.6128, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 0, trucks: 0, buses: 0, pedestrians: 0, waitTimeMins: 0 } },
  { id: '21', name: 'Серпневе 1', lat: 46.3028, lng: 29.0205, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 8, trucks: 2, buses: 0, pedestrians: 0, waitTimeMins: 15 } },
  { id: '22', name: 'Старокозаче', lat: 46.4353, lng: 29.8327, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 35, trucks: 12, buses: 1, pedestrians: 0, waitTimeMins: 45 } },
  { id: '23', name: 'Кучурган', lat: 46.7328, lng: 29.9825, country: { name: 'Молдова' }, isOpen: false, queueData: { cars: 0, trucks: 0, buses: 0, pedestrians: 0, waitTimeMins: 0 } },
  { id: '24', name: 'Платонове', lat: 47.3821, lng: 29.3512, country: { name: 'Молдова' }, isOpen: false, queueData: { cars: 0, trucks: 0, buses: 0, pedestrians: 0, waitTimeMins: 0 } },
  { id: '25', name: 'Могилів-Подільський', lat: 48.4414, lng: 27.7954, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 20, trucks: 15, buses: 2, pedestrians: 10, waitTimeMins: 40 } },
  { id: '26', name: 'Бронниця', lat: 48.4239, lng: 27.9150, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 5, trucks: 0, buses: 0, pedestrians: 0, waitTimeMins: 10 } },
  { id: '27', name: 'Сокиряни', lat: 48.4356, lng: 27.4206, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 12, trucks: 5, buses: 0, pedestrians: 0, waitTimeMins: 20 } },
  { id: '28', name: 'Кельменці', lat: 48.4716, lng: 26.8378, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 15, trucks: 2, buses: 0, pedestrians: 0, waitTimeMins: 25 } },
  { id: '29', name: 'Росошани', lat: 48.3732, lng: 26.9692, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 8, trucks: 3, buses: 0, pedestrians: 0, waitTimeMins: 15 } },
  { id: '30', name: 'Мамалига', lat: 48.2612, lng: 26.6025, country: { name: 'Молдова' }, isOpen: true, queueData: { cars: 25, trucks: 10, buses: 1, pedestrians: 0, waitTimeMins: 45 } },
  { id: '31', name: 'Красноїльськ', lat: 47.9868, lng: 25.5686, country: { name: 'Румунія' }, isOpen: true, queueData: { cars: 10, trucks: 5, buses: 0, pedestrians: 0, waitTimeMins: 20 } },
  { id: '32', name: 'Вилок', lat: 48.1068, lng: 22.8251, country: { name: 'Угорщина' }, isOpen: true, queueData: { cars: 18, trucks: 0, buses: 0, pedestrians: 0, waitTimeMins: 35 } },
  { id: '33', name: 'Косино', lat: 48.2415, lng: 22.4729, country: { name: 'Угорщина' }, isOpen: true, queueData: { cars: 12, trucks: 0, buses: 0, pedestrians: 0, waitTimeMins: 20 } },
  { id: '34', name: 'Дзвінкове', lat: 48.2861, lng: 22.3168, country: { name: 'Угорщина' }, isOpen: true, queueData: { cars: 5, trucks: 0, buses: 0, pedestrians: 0, waitTimeMins: 10 } },
  { id: '35', name: 'Нижанковичі', lat: 49.6800, lng: 22.7800, country: { name: 'Польща' }, isOpen: true, queueData: { cars: 0, trucks: 20, buses: 0, pedestrians: 0, waitTimeMins: 60 } }
];

export default function Home() {
  const [view, setView] = useState<"map" | "list">("map");
  const [search, setSearch] = useState("");
  const [points, setPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterCountry, setFilterCountry] = useState("Всі");
  const [showSplash, setShowSplash] = useState(true);
  const [vehicleType, setVehicleType] = useState('cars');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const uniqueCountries = ["Всі", ...Array.from(new Set(points.map(p => p.country?.name || "Unknown")))];
  
  const totalInQueue = points.reduce((sum, p) => sum + (p.queueData?.[vehicleType] || 0), 0);
  const activePoints = points.filter(p => p.isOpen).length;

  const VEHICLE_TYPES = [
    { id: 'cars', label: 'Легкові', icon: Car, color: 'text-blue-500' },
    { id: 'trucks', label: 'Вантажні', icon: Truck, color: 'text-orange-500' },
    { id: 'buses', label: 'Автобуси', icon: Bus, color: 'text-green-500' },
    { id: 'pedestrians', label: 'Пішоходи', icon: Users, color: 'text-purple-500' },
  ];

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1800); // Wait 1.8 seconds before hiding splash screen
    return () => clearTimeout(splashTimer);
  }, []);

  const fetchPoints = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 
        (process.env.NODE_ENV === 'production' 
          ? 'https://appealing-emotion-production-62c6.up.railway.app' 
          : 'http://localhost:3000');
      const res = await fetch(`${API_URL}/api/border-points`);
      if (res.ok) {
        const data = await res.json();
        setPoints(data.length > 0 ? data : MOCK_POINTS);
      } else {
        setPoints(MOCK_POINTS);
      }
    } catch (err) {
      console.error("Failed to fetch points, using mock data:", err);
      setPoints(MOCK_POINTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
    const interval = setInterval(fetchPoints, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const filteredPoints = points.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.country?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterCountry === "Всі" || p.country?.name === filterCountry;
    return matchesSearch && matchesFilter;
  });

  const handleSelectPoint = (point: any) => {
    setSearch(point.name);
    setSelectedPoint(point);
    setShowDropdown(false);
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">
        
        {/* Splash Screen */}
        <AnimatePresence>
          {showSplash && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-neutral-950"
            >
              <motion.img 
                src="/ekran.png" 
                alt="Logo" 
                className="w-auto h-20 md:h-28 object-contain mix-blend-multiply dark:mix-blend-screen dark:invert pointer-events-none"
              initial={{ scale: 0.85, opacity: 0, filter: "blur(12px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 1.1, opacity: 0, filter: "blur(8px)" }}
              transition={{ 
                duration: 1.2, 
                ease: [0.16, 1, 0.3, 1] // Smooth cinematic ease out
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Search Bar */}
      <div className="absolute top-4 md:top-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-[400] flex flex-col gap-2">
        <div className="flex items-center gap-3 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl border border-black/5 dark:border-white/5 p-2 md:p-2.5 rounded-3xl shadow-xl relative">
          <div className="flex-1 flex items-center bg-neutral-100/50 dark:bg-neutral-800/50 rounded-2xl px-4 py-2.5 border border-black/5 dark:border-white/5">
            <Search className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <input
              type="text"
              placeholder="Пошук пункту пропуску, країни..."
              className="w-full bg-transparent border-none outline-none text-neutral-900 dark:text-white ml-3 placeholder:text-neutral-400 font-medium"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              onFocus={() => {
                if (search.length > 0) setShowDropdown(true);
              }}
            />
          </div>
          
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-3 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-2xl transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 border rounded-2xl transition-all shadow-md ${showFilters ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white text-white dark:text-neutral-900' : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          
          {/* Dropdown for search results */}
          {showDropdown && search.length > 0 && (
            <div className="absolute top-[110%] left-0 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-black/5 dark:border-white/5 shadow-2xl rounded-3xl p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {filteredPoints.length > 0 ? (
                filteredPoints.slice(0, 10).map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => handleSelectPoint(p)}
                    className="flex justify-between items-center p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-white">{p.name}</h4>
                      <p className="text-xs text-neutral-500 font-medium">{p.country?.name}</p>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-neutral-500 text-sm font-medium">Нічого не знайдено</div>
              )}
            </div>
          )}

          {/* Filter Modal */}
          {showFilters && (
            <div className="absolute top-[110%] right-0 w-[250px] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-black/5 dark:border-white/5 shadow-2xl rounded-3xl p-4">
              <h3 className="font-bold text-neutral-900 dark:text-white mb-3 text-sm">Фільтр по країні</h3>
              <div className="flex flex-col gap-2">
                {uniqueCountries.map(country => (
                  <label key={country} className="flex items-center gap-3 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl cursor-pointer transition-colors">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${filterCountry === country ? 'border-neutral-900 dark:border-white' : 'border-neutral-300 dark:border-neutral-600'}`}>
                      {filterCountry === country && <div className="w-2 h-2 bg-neutral-900 dark:bg-white rounded-full"></div>}
                    </div>
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{country}</span>
                    <input 
                      type="radio" 
                      name="country" 
                      value={country} 
                      checked={filterCountry === country}
                      onChange={() => setFilterCountry(country)}
                      className="hidden" 
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Filters (Vehicle Types) */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 px-1">
          {VEHICLE_TYPES.map(type => {
            const Icon = type.icon;
            const isActive = vehicleType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setVehicleType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold transition-all whitespace-nowrap shadow-sm backdrop-blur-xl ${
                  isActive 
                    ? `bg-white dark:bg-neutral-800 border-transparent ${type.color} ring-2 ring-black/5 dark:ring-white/5` 
                    : 'bg-white/50 dark:bg-neutral-800/50 border-black/5 dark:border-white/5 text-neutral-500 dark:text-neutral-400 hover:bg-white/80 dark:hover:bg-neutral-700/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full h-full z-0">
        {view === "map" ? (
          <MapComponent points={filteredPoints} selectedPoint={selectedPoint} vehicleType={vehicleType} theme={theme} />
        ) : (
          <PointsList points={filteredPoints} />
        )}
      </div>

      {/* Live Status Widget (Desktop) */}
      {view === "map" && (
        <div className="absolute bottom-8 left-6 z-[400] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-black/5 dark:border-white/5 p-4 rounded-3xl shadow-2xl flex-col gap-1 hidden lg:flex min-w-[200px]">
          <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-extrabold text-sm mb-1">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            Live Статус
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold flex justify-between">
            <span>Відкрито пунктів:</span>
            <span className="text-neutral-900 dark:text-white">{activePoints}</span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold flex justify-between">
            <span>Загальна черга:</span>
            <span className="text-neutral-900 dark:text-white">{totalInQueue}</span>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[400] flex items-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-black/5 dark:border-white/5 p-1.5 md:p-2 rounded-[2rem] shadow-2xl">
        <button
          onClick={() => setView("map")}
          className={`flex items-center gap-2 px-5 md:px-7 py-2.5 md:py-3 rounded-full transition-all duration-300 ${
            view === "map" 
              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg" 
              : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/50"
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span className="font-bold text-sm">Мапа</span>
        </button>
        <button
          onClick={() => setView("list")}
          className={`flex items-center gap-2 px-5 md:px-7 py-2.5 md:py-3 rounded-full transition-all duration-300 ${
            view === "list"  
              ? "bg-neutral-900 text-white shadow-lg" 
              : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50"
          }`}
        >
          <List className="w-4 h-4" />
          <span className="font-bold text-sm">Список</span>
        </button>
      </div>

    </div>
    </div>
  );
}
