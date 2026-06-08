import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Type, Check, Loader, Save, Eye } from 'lucide-react';
import { AdminToast, useAdminToast } from '../../components/admin/AdminModal';
import { adminFetch } from '../../utils/apiClient';
import {
  FONT_THEMES,
  FONT_CATEGORIES,
  DEFAULT_FONT_THEME,
  getFontTheme,
  preloadAllThemeFonts,
} from '../../fontThemes';

export default function AdminTypographie() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(DEFAULT_FONT_THEME);
  const [active, setActive] = useState(DEFAULT_FONT_THEME);
  const { toast, showToast, hideToast } = useAdminToast();

  useEffect(() => {
    // Charge toutes les polices pour que chaque aperçu s'affiche correctement.
    preloadAllThemeFonts();

    const fetchSettings = async () => {
      try {
        const res = await adminFetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          const t = data.fontTheme || DEFAULT_FONT_THEME;
          setSelected(t);
          setActive(t);
        }
      } catch {
        showToast('error', 'Erreur réseau lors de la récupération du style');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ fontTheme: selected }),
      });

      if (res.ok) {
        setActive(selected);
        showToast('success', 'Style typographique appliqué à tout le site');
      } else {
        const errData = await res.json();
        showToast('error', errData.message || 'Erreur de mise à jour');
      }
    } catch {
      showToast('error', 'Impossible de se connecter au serveur');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const selectedTheme = getFontTheme(selected);
  const hasChanges = selected !== active;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-32">
      {/* En-tête */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Apparence</span>
        <h2 className="text-4xl font-serif italic font-light">Typographie du site</h2>
        <p className="text-sm text-white/40 max-w-2xl pt-2 leading-relaxed">
          Choisissez le style d'écriture de l'ensemble du site client. Le style sélectionné
          s'applique instantanément à toutes les pages (titres, textes, boutons) dès l'enregistrement.
        </p>
      </div>

      {/* Styles regroupés par catégorie */}
      <div className="space-y-14">
        {FONT_CATEGORIES.map((category) => {
          const themes = FONT_THEMES.filter((t) => t.category === category);
          if (themes.length === 0) return null;
          return (
            <section key={category} className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xs uppercase tracking-[0.25em] text-white/50 font-bold whitespace-nowrap">
                  {category}
                </h3>
                <div className="h-px flex-1 bg-white/[0.06]" />
                <span className="text-[10px] text-white/25 font-mono">{themes.length}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {themes.map((theme) => {
                  const isSelected = selected === theme.id;
                  const isActive = active === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelected(theme.id)}
                      className={`group relative text-left rounded-2xl border p-8 transition-all duration-300 overflow-hidden ${
                        isSelected
                          ? 'border-gold bg-gradient-to-br from-gold/10 to-transparent shadow-xl shadow-gold/5'
                          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]'
                      }`}
                    >
                      {/* Badge sélection / actif */}
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h4
                              className="text-2xl text-white"
                              style={{ fontFamily: theme.serif }}
                            >
                              {theme.name}
                            </h4>
                            {isActive && (
                              <span className="text-[9px] uppercase tracking-widest text-gold font-bold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20">
                                Actif
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/40" style={{ fontFamily: theme.sans }}>
                            {theme.mood}
                          </p>
                        </div>
                        <div
                          className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-gold border-gold text-black'
                              : 'border-white/20 text-transparent group-hover:border-white/40'
                          }`}
                        >
                          <Check size={16} strokeWidth={3} />
                        </div>
                      </div>

                      {/* Aperçu live du style */}
                      <div className="rounded-xl bg-black/30 border border-white/[0.04] p-6 space-y-3">
                        <p
                          className="text-3xl leading-tight text-white"
                          style={{ fontFamily: theme.serif }}
                        >
                          Érotisme <span className="italic text-white/40">et plaisir.</span>
                        </p>
                        <p
                          className="text-sm text-white/50 leading-relaxed"
                          style={{ fontFamily: theme.sans }}
                        >
                          Maison Love Rooms vous propose deux love room imaginées pour les amoureux qui
                          veulent s'évader le temps d'une soirée dans un cocon de douceur et d'exotisme.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <span
                            className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold border border-gold/30 rounded-full px-4 py-2"
                            style={{ fontFamily: theme.sans }}
                          >
                            Réserver
                          </span>
                          <span
                            className="text-[10px] text-white/30 font-mono"
                            style={{ fontFamily: theme.sans }}
                          >
                            Aa · 0123
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Barre d'action flottante */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-72 z-30 px-6 lg:px-12 py-5 bg-[#0A0E17]/90 backdrop-blur-2xl border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white/50 text-sm min-w-0">
            <Eye size={18} className="text-gold flex-shrink-0" />
            <span className="truncate">
              Style sélectionné :{' '}
              <span className="text-white font-semibold" style={{ fontFamily: selectedTheme.serif }}>
                {selectedTheme.name}
              </span>
              {hasChanges && (
                <span className="ml-2 text-[10px] uppercase tracking-widest text-gold/80">
                  · non enregistré
                </span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-3 px-8 lg:px-10 py-4 bg-gold text-black rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold-light transition-all shadow-xl shadow-gold/10 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
            {hasChanges ? 'Appliquer au site' : 'Style appliqué'}
          </button>
        </div>
      </div>

      <AdminToast {...toast} onClose={hideToast} />
    </div>
  );
}
