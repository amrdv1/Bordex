"use client";

import { Car, Truck, Bus, Clock, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function PointsList({ points }: { points: any[] }) {
  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        Завантаження або немає даних...
      </div>
    );
  }

  const getWaitMins = (p: any): number => {
    const qd = p.queueData;
    if (!qd) return 0;
    if (qd.carsWaitHours !== undefined) {
      return Math.round(Math.max(qd.carsWaitHours || 0, qd.trucksWaitHours || 0, qd.busesWaitHours || 0) * 60);
    }
    return qd.waitTimeMins || 0;
  };

  const getStatusInfo = (mins: number) => {
    if (mins > 180) return { color: 'bg-red-500', shadow: 'shadow-red-500/30', label: 'Високе', textColor: 'text-red-600 dark:text-red-400' };
    if (mins > 60) return { color: 'bg-amber-500', shadow: 'shadow-amber-500/30', label: 'Середнє', textColor: 'text-amber-600 dark:text-amber-400' };
    if (mins > 0) return { color: 'bg-green-500', shadow: 'shadow-green-500/30', label: 'Низьке', textColor: 'text-green-600 dark:text-green-400' };
    return { color: 'bg-emerald-500', shadow: 'shadow-emerald-500/30', label: 'Вільно', textColor: 'text-emerald-600 dark:text-emerald-400' };
  };

  // Sort by wait time (longest first)
  const sorted = [...points].sort((a, b) => getWaitMins(b) - getWaitMins(a));

  return (
    <div className="w-full max-w-4xl mx-auto p-4 pt-36 md:pt-44 pb-28 md:pb-32 h-full overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((p, i) => {
          const qd = p.queueData;
          const isGranica = qd?.carsWaitHours !== undefined;
          const waitMins = getWaitMins(p);
          const status = getStatusInfo(waitMins);

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
                <div className="flex items-center gap-1.5">
                  {p.source === 'granica.gov.pl' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold">🇵🇱</span>
                  )}
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${p.isOpen ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                    {p.isOpen ? "Відкрито" : "Закрито"}
                  </div>
                </div>
              </div>

              {/* Stats */}
              {isGranica ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 bg-neutral-100/80 dark:bg-neutral-800/80 p-3 rounded-2xl border border-black/5 dark:border-white/5">
                    <Car className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-neutral-500 flex-1">Легкові</span>
                    <span className="font-extrabold text-lg text-neutral-900 dark:text-white">{qd.carsWaitHours > 0 ? `${qd.carsWaitHours} год` : '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-neutral-100/80 dark:bg-neutral-800/80 p-3 rounded-2xl border border-black/5 dark:border-white/5">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-neutral-500 flex-1">Вантажні</span>
                    <span className="font-extrabold text-lg text-neutral-900 dark:text-white">{qd.trucksWaitHours > 0 ? `${qd.trucksWaitHours} год` : '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-neutral-100/80 dark:bg-neutral-800/80 p-3 rounded-2xl border border-black/5 dark:border-white/5">
                    <Bus className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-neutral-500 flex-1">Автобуси</span>
                    <span className="font-extrabold text-lg text-neutral-900 dark:text-white">{qd.busesWaitHours > 0 ? `${qd.busesWaitHours} год` : '—'}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 bg-neutral-100/80 dark:bg-neutral-800/80 p-3 rounded-2xl border border-black/5 dark:border-white/5">
                    <Car className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-extrabold text-2xl text-neutral-900 dark:text-white leading-none">{qd?.cars ?? 0}</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5 uppercase tracking-wider">у черзі</div>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-3 bg-neutral-100/80 dark:bg-neutral-800/80 p-3 rounded-2xl border border-black/5 dark:border-white/5">
                    <Clock className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-extrabold text-2xl text-neutral-900 dark:text-white leading-none">
                        {waitMins >= 60 ? `${Math.floor(waitMins / 60)}г ${waitMins % 60}хв` : `${waitMins}хв`}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5 uppercase tracking-wider">очікування</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status bar */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${status.textColor} text-xs font-bold`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Навантаження: {status.label}</span>
                </div>
                {qd?.lastUpdated && (
                  <span className="text-[10px] text-neutral-400">
                    {qd.lastUpdated}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
