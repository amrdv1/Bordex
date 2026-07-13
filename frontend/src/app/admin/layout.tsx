import { ReactNode } from "react";
import { LayoutDashboard, Users, Activity, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-tighter">
            Border<span className="text-blue-500">Flow</span> Admin
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Дашборд</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Пользователи</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <Activity className="w-5 h-5" />
            <span className="font-medium">Парсеры (Source)</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Настройки</span>
          </Link>
        </nav>
        <div className="p-4">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
}
