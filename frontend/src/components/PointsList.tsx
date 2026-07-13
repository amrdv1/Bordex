"use client";

import { Car, Truck, Bus, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function PointsList({ points }: { points: any[] }) {
  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        Загрузка или нет данных...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 pt-24 pb-24 h-full overflow-y-auto custom-scrollbar">
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
              className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-5 rounded-2xl flex flex-col gap-4 hover:bg-neutral-800/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${statusColor}`}></span>
                    {p.name}
                  </h3>
                  <p className="text-neutral-400 text-sm mt-1">{p.country?.name || p.country}</p>
                </div>
                <div className="bg-neutral-800 px-3 py-1 rounded-full text-xs font-medium text-neutral-300">
                  {p.isOpen ? "Открыт" : "Закрыт"}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col items-center justify-center bg-neutral-950/50 p-2 rounded-xl border border-neutral-800">
                  <Car className="w-5 h-5 text-blue-400 mb-1" />
                  <span className="font-bold text-lg">{p.queueData?.cars ?? p.cars ?? 0}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-neutral-950/50 p-2 rounded-xl border border-neutral-800">
                  <Truck className="w-5 h-5 text-orange-400 mb-1" />
                  <span className="font-bold text-lg">{p.queueData?.trucks ?? p.trucks ?? 0}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-neutral-950/50 p-2 rounded-xl border border-neutral-800">
                  <Bus className="w-5 h-5 text-green-400 mb-1" />
                  <span className="font-bold text-lg">{p.queueData?.buses ?? p.buses ?? 0}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-neutral-950/50 p-2 rounded-xl border border-neutral-800">
                  <Users className="w-5 h-5 text-purple-400 mb-1" />
                  <span className="font-bold text-lg">{p.queueData?.pedestrians ?? p.pedestrians ?? 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-red-950/30 border border-red-900/50 text-red-400 p-3 rounded-xl font-medium text-sm">
                <Clock className="w-5 h-5" />
                Ожидание: ~{Math.floor((p.queueData?.waitTimeMins ?? p.waitTimeMins ?? 0) / 60)}ч {(p.queueData?.waitTimeMins ?? p.waitTimeMins ?? 0) % 60}м
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
