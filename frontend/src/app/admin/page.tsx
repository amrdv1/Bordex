"use client";

import { Activity, Users, Database, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Дашборд</h2>
        <div className="flex items-center gap-4">
          <button className="bg-neutral-800 p-2 rounded-full hover:bg-neutral-700 transition">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-neutral-800"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Користувачі" value="1,248" icon={<Users className="w-6 h-6 text-blue-500" />} trend="+12% за тиждень" />
        <StatCard title="Активні підписки" value="459" icon={<Activity className="w-6 h-6 text-purple-500" />} trend="+5% за тиждень" />
        <StatCard title="Запитів парсера" value="14.2k" icon={<Database className="w-6 h-6 text-green-500" />} trend="Успішність 99.8%" />
        <StatCard title="Пунктів пропуску" value="16" icon={<Activity className="w-6 h-6 text-orange-500" />} trend="Усі активні" />
      </div>

      {/* Tables and Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Логи Source Engine</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <div>
                  <p className="font-medium">Оновлення dpsu.gov.ua</p>
                  <p className="text-sm text-neutral-500">Cron Job execution successful</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">Success</p>
                  <p className="text-xs text-neutral-500">2 хв тому</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Останні користувачі</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 hover:bg-neutral-800 rounded-xl transition">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                  <Users className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">tg_user_{Math.floor(Math.random() * 10000)}</p>
                  <p className="text-xs text-neutral-500">Підписався на Ягодин</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: any, trend: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">{icon}</div>
      </div>
      <div>
        <p className="text-neutral-400 text-sm font-medium">{title}</p>
        <h4 className="text-3xl font-bold text-white mt-1">{value}</h4>
      </div>
      <div className="text-sm text-neutral-500 font-medium">{trend}</div>
    </motion.div>
  );
}
