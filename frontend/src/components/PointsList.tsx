"use client";

import { Car, Clock, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function PointsList({ points }: { points: any[] }) {
  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        Завантаження або немає даних...
      </div>
    );
  }

  const getStatusInfo = (cars: number) => {
    if (cars > 100) return { color: 'bg-red-500', shadow: 'shadow-red-500/30', label: 'Високе', textColor: 'text-red-600 dark:text-red-400' };
    if (cars > 30) return { color: 'bg-amber-500', shadow: 'shadow-amber-500/30', label: 'Середнє', textColor: 'text-amber-600 dark:text-amber-400' };
    if (cars > 0) return { color: 'bg-green-500', shadow: 'shadow-green-500/30', label: 'Низьке', textColor: 'text-green-600 dark:text-green-400' };
    return { color: 'bg-emerald-500', shadow: 'shadow-emerald-500/30', label: 'Вільно', textColor: 'text-emerald-600 dark:text-emerald-400' };
  };

  // Sort by queue size (largest first)
  const sorted = [...points].sort((a, b) => (b.queueData?.cars || 0) - (a.queueData?.cars || 0));

  return (
    <div className="w-full max-w-4xl mx-auto p-4 pt-36 md:pt-44 pb-28 md:pb-32 h-full overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((p, i) => {
          const cars = p.queueData?.cars ?? 0;
          const waitMins = p.queueData?.waitTimeMins ?? 0;
          const status = getStatusInfo(cars);
          const hours = Math.floor(waitMins / 60);
          const mins = waitMins % 60;
          const waitText = hours > 0 ? `~${hours}год ${mins}хв` : `~${mins}хв`;

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl border border-black/5 dark:border-white/5 p-5 rounded-[2rem] flex flex-col gap-4 hover:bg-white/90 dark:hover:bg-neutral-800/90 hover:border-black/10 dark:hover:border-white/10 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${status.color} shadow-lg ${status.shadow}`}></span>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">{p.name}</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {p.country?.name || p.country}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${p.isOpen ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                  {p.isOpen ? "Відкрито" : "Закрито"}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3 bg-neutral-100/80 dark:bg-neutral-800/80 p-3 rounded-2xl border border-black/5 dark:border-white/5">
                  <Car className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-extrabold text-2xl text-neutral-900 dark:text-white leading-none">{cars}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5 uppercase tracking-wider">у черзі</div>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-3 bg-neutral-100/80 dark:bg-neutral-800/80 p-3 rounded-2xl border border-black/5 dark:border-white/5">
                  <Clock className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-extrabold text-2xl text-neutral-900 dark:text-white leading-none">{waitText}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5 uppercase tracking-wider">очікування</div>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className={`flex items-center gap-2 ${status.textColor} text-xs font-bold`}>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Навантаження: {status.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
