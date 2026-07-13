"use client";

import { Car, Truck, Bus, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function PointsList({ points }: { points: any[] }) {
  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        Завантаження або немає даних...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 pt-36 md:pt-44 pb-28 md:pb-32 h-full overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((p, i) => {
          let statusColor = "bg-green-500";
          if (p.queueData?.cars > 100) statusColor = "bg-red-500";
          else if (p.queueData?.cars > 50) statusColor = "bg-yellow-500";

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl border border-black/5 dark:border-white/5 p-6 rounded-[2rem] flex flex-col gap-5 hover:bg-white/90 dark:hover:bg-neutral-800/90 hover:border-black/10 dark:hover:border-white/10 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3 tracking-tight">
                    <span className={`w-3.5 h-3.5 rounded-full ${statusColor} shadow-[0_0_10px_${statusColor}]`}></span>
                    {p.name}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1.5 font-medium">{p.country?.name || p.country}</p>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/5 px-4 py-1.5 rounded-full text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                  {p.isOpen ? "Відкрито" : "Закрито"}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col items-center justify-center bg-white/60 dark:bg-neutral-800/60 p-3 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                  <Car className="w-6 h-6 text-blue-500 mb-1.5" />
                  <span className="font-bold text-xl text-neutral-900 dark:text-white">{p.queueData?.cars ?? p.cars ?? 0}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white/60 dark:bg-neutral-800/60 p-3 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                  <Truck className="w-6 h-6 text-orange-500 mb-1.5" />
                  <span className="font-bold text-xl text-neutral-900 dark:text-white">{p.queueData?.trucks ?? p.trucks ?? 0}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white/60 dark:bg-neutral-800/60 p-3 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                  <Bus className="w-6 h-6 text-green-500 mb-1.5" />
                  <span className="font-bold text-xl text-neutral-900 dark:text-white">{p.queueData?.buses ?? p.buses ?? 0}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white/60 dark:bg-neutral-800/60 p-3 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                  <Users className="w-6 h-6 text-purple-500 mb-1.5" />
                  <span className="font-bold text-xl text-neutral-900 dark:text-white">{p.queueData?.pedestrians ?? p.pedestrians ?? 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 dark:from-red-900/30 to-transparent border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-2xl font-semibold text-sm">
                <Clock className="w-5 h-5" />
                Очікування: ~{Math.floor((p.queueData?.waitTimeMins ?? p.waitTimeMins ?? 0) / 60)}год {(p.queueData?.waitTimeMins ?? p.waitTimeMins ?? 0) % 60}хв
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
