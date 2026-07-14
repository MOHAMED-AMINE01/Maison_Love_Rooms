import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SUITES } from '../constants';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <div className="min-h-screen bg-noir pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="md:w-64 space-y-8">
            <h1 className="text-2xl font-serif tracking-widest text-gradient-copper">Admin Portal</h1>
            <nav className="space-y-1">
              {[
                { id: 'bookings', label: 'Réservations' },
                { id: 'suites', label: 'Gestion des Suites' },
                { id: 'boutique', label: 'Boutique & Cadeaux' },
                { id: 'settings', label: 'Configurations' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 text-[11px] uppercase tracking-[0.2em] transition-all ${
                    activeTab === tab.id ? "bg-gold text-noir font-bold" : "text-white/40 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-12">
            {activeTab === 'bookings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex justify-between items-center bg-white/[0.02] p-8 border border-white/5">
                  <div>
                    <h2 className="text-3xl font-serif mb-2">Activités Récentes</h2>
                    <p className="text-xs text-white/30 uppercase tracking-widest">Aujourd'hui : 5 nouvelles arrivées</p>
                  </div>
                  <button className="px-6 py-2 border border-gold text-[10px] uppercase tracking-widest text-gold hover:bg-gold hover:text-noir transition-all">
                    Exporter CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40 text-left">
                        <th className="py-6 px-4">Client</th>
                        <th className="py-6 px-4">Suite</th>
                        <th className="py-6 px-4">Dates</th>
                        <th className="py-6 px-4">Total</th>
                        <th className="py-6 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { client: "Jean D.", suite: "Obsidienne", dates: "05/05 - 06/05", total: "280 €", status: "Confirmé" },
                        { client: "Mélanie L.", suite: "Éden Suspendu", dates: "07/05 - 08/05", total: "365 €", status: "En attente" },
                        { client: "Marc A.", suite: "Mosaïque d'Or", dates: "12/05 - 14/05", total: "700 €", status: "Confirmé" }
                      ].map((b, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                          <td className="py-6 px-4 font-medium">{b.client}</td>
                          <td className="py-6 px-4 text-white/60 italic">{b.suite}</td>
                          <td className="py-6 px-4 text-white/40">{b.dates}</td>
                          <td className="py-6 px-4 text-gold">{b.total}</td>
                          <td className="py-6 px-4">
                            <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border font-bold ${
                              b.status === "Confirmé" ? "border-green-500/30 text-green-500" : "border-gold/30 text-gold"
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'suites' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {SUITES.map((suite) => (
                  <div key={suite.id} className="p-8 border border-white/5 bg-white/[0.02] flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                        <img src={suite.image} alt={suite.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl">{suite.name}</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{suite.price} € / nuit</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                       <button className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">Éditer</button>
                    </div>
                  </div>
                ))}
                <button className="border-2 border-dashed border-white/10 p-8 text-[10px] uppercase tracking-[0.3em] text-white/20 hover:border-gold hover:text-gold transition-all">
                   + Ajouter une nouvelle suite
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
