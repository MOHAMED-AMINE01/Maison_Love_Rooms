import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Sparkles,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Globe,
  ChevronRight,
  Menu,
  Gift,
  Package,
  ClipboardList,
  Type,
  HelpCircle,
  X
} from "lucide-react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { API_URL } from '../../constants';

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: CalendarDays, label: "Réservations", path: "/admin/reservations" },
  { icon: BedDouble, label: "Chambres", path: "/admin/chambres" },
  { icon: Sparkles, label: "Disponibilités", path: "/admin/disponibilites" },
  { icon: Sparkles, label: "Boutique & Options", path: "/admin/boutique" },
  { icon: Package, label: "Stock & Produits", path: "/admin/stock" },
  { icon: ClipboardList, label: "Commandes", path: "/admin/commandes" },
  { icon: Gift, label: "Cartes Cadeaux", path: "/admin/cartes-cadeaux" },
  { icon: HelpCircle, label: "FAQ", path: "/admin/faq" },
  { icon: Type, label: "Typographie", path: "/admin/typographie" },
  { icon: Settings, label: "Paramètres", path: "/admin/settings" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }
    // Vérifie la session via le token Bearer
    fetch(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include'
    })
      .then(res => { if (!res.ok) navigate('/admin/login', { replace: true }); })
      .catch(() => navigate('/admin/login', { replace: true }));
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      await fetch(`${API_URL}/api/admin/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
    }
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white font-sans flex selection:bg-gold/20 relative">
      {/* Overlay mobile quand la sidebar est ouverte */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Rétractable sur mobile/tablette */}
      <aside className={`w-72 border-r border-white/[0.05] flex flex-col fixed inset-y-0 left-0 bg-[#0D121E] z-50 shadow-2xl transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Logo / En-tête */}
        <div className="p-8 border-b border-white/[0.05] flex justify-between items-center">
          <Link to="/admin" className="flex flex-col group" onClick={() => setIsSidebarOpen(false)}>
            <span className="text-xl font-serif tracking-[0.15em] uppercase font-bold text-white group-hover:text-gold transition-colors">
              Maison Love Rooms
            </span>
            <span className="text-xs tracking-[0.4em] uppercase text-gold font-bold mt-1">
              ADMIN
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.05]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 px-6 space-y-2 py-8 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                  ? 'bg-gradient-to-r from-gold/20 to-gold-light/10 text-gold border-l-4 border-gold font-semibold shadow-lg shadow-gold/5'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                  }`}
              >
                <Icon size={20} className={isActive ? 'text-gold' : 'text-white/40 group-hover:text-white transition-colors'} />
                <span className="text-sm tracking-wide">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="active-indicator" className="ml-auto">
                    <ChevronRight size={16} className="text-gold" />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Section Bas de Sidebar */}
        <div className="p-6 border-t border-white/[0.05] space-y-6 bg-white/[0.01]">
          {/* Lien Accéder au site */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-300 group border border-white/[0.05]"
          >
            <Globe size={18} className="text-white/40 group-hover:text-gold transition-colors" />
            <span className="text-sm font-medium tracking-wide">Accéder au site</span>
          </Link>

          {/* Profil Utilisateur */}
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold to-gold-light p-[2px] shadow-lg shadow-gold/20 flex-shrink-0">
              <div className="w-full h-full rounded-[10px] bg-[#0D121E] flex items-center justify-center text-xs font-bold text-gold">
                SA
              </div>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white tracking-wide truncate">Super Admin</span>
              <span className="text-[10px] text-white/40 tracking-wider font-mono truncate">admin@maisonloverooms.com</span>
            </div>
          </div>

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300 group border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium tracking-wide">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 bg-[#0A0E17] min-h-screen flex flex-col w-full overflow-x-hidden">
        {/* Header Responsive */}
        <header className="h-20 lg:h-24 border-b border-white/[0.05] flex items-center justify-between px-6 lg:px-12 bg-[#0A0E17]/80 backdrop-blur-2xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.05]"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl lg:text-2xl font-serif tracking-wide capitalize text-white">
              {SIDEBAR_ITEMS.find(item => item.path === location.pathname)?.label || "Dashboard"}
            </h1>
            <div className="hidden sm:block h-4 w-px bg-white/10 mx-2" />

          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-12 flex-1 max-w-[1600px] w-full mx-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}



