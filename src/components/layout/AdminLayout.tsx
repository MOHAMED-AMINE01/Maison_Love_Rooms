import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BedDouble, 
  Sparkles, 
  ShoppingBag, 
  Settings, 
  LogOut,
  Bell,
  Search,
  ChevronRight
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: CalendarDays, label: "Réservations", path: "/admin/reservations" },
  { icon: BedDouble, label: "Chambres", path: "/admin/chambres" },
  { icon: Sparkles, label: "Disponibilités", path: "/admin/disponibilites" },
  { icon: Sparkles, label: "Prestations", path: "/admin/prestations" },
  { icon: ShoppingBag, label: "Boutique", path: "/admin/boutique" },
  { icon: Settings, label: "Paramètres", path: "/admin/settings" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-admin-bg text-white font-sans flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-admin-border flex flex-col fixed h-full bg-admin-bg z-50">
        <div className="p-8">
          <Link to="/" className="flex flex-col group">
            <span className="text-xl font-serif tracking-[0.2em] uppercase font-bold text-white">Maison</span>
            <span className="text-[10px] tracking-[0.6em] uppercase text-gold font-bold -mt-1">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto"
                  >
                    <ChevronRight size={14} className="text-gold" />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-admin-border">
          <button className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200">
            <LogOut size={18} />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        {/* Header */}
        <header className="h-20 border-b border-admin-border flex items-center justify-between px-10 bg-admin-bg/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif tracking-wide capitalize">
              {SIDEBAR_ITEMS.find(item => item.path === location.pathname)?.label || "Dashboard"}
            </h1>
            <div className="h-4 w-px bg-admin-border mx-2" />
            <span className="text-xs text-white/40 uppercase tracking-widest font-medium">
               Gestion de l'excellence
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group flex items-center bg-white/[0.03] border border-white/[0.05] rounded-lg px-4 py-2 hover:border-gold/30 transition-all">
              <Search size={16} className="text-white/40" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-40 text-white placeholder:text-white/20"
              />
            </div>
            <button className="relative text-white/40 hover:text-white transition-colors">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full border-2 border-admin-bg" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-admin-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold to-gold/20 p-px">
                <div className="w-full h-full rounded-full bg-admin-bg flex items-center justify-center text-[10px] font-bold">
                   JD
                </div>
              </div>
              <span className="text-xs font-semibold">Jean Dupont</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
