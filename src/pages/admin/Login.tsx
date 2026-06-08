import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifie silencieusement si une session cookie est encore valide
    fetch(`${API_URL}/api/admin/stats`, { credentials: 'include' })
      .then(res => { if (res.ok) navigate('/admin', { replace: true }); })
      .catch(() => { /* pas de session active, on reste sur login */ });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // reçoit et stocke le cookie httpOnly
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // On stocke uniquement les infos non-sensibles (pas le token)
        localStorage.setItem('adminUser', JSON.stringify(data));
        navigate('/admin', { replace: true });
      } else {
        setError(data.message || 'Identifiants invalides');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur API. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@maisonloverooms.com');
    setPassword('admin123');
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleLogin(fakeEvent);
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center p-6 selection:bg-gold/20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#131824]/90 backdrop-blur-2xl border border-white/[0.05] rounded-3xl p-10 shadow-2xl shadow-black/50 relative z-10 space-y-8"
      >
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-gold to-gold-light rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-gold/20 mb-4">
            <ShieldCheck size={32} className="text-black" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide uppercase">
            Maison Love Room
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-bold">
            Espace d'Administration
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">
                Adresse Email
              </label>
              <div className="relative flex items-center bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 focus-within:border-gold/50 focus-within:bg-white/[0.04] transition-all">
                <Mail size={18} className="text-white/40" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maisonloverooms.com"
                  className="bg-transparent border-none text-sm text-white ml-3 w-full focus:outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">
                Mot de Passe
              </label>
              <div className="relative flex items-center bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 focus-within:border-gold/50 focus-within:bg-white/[0.04] transition-all">
                <Lock size={18} className="text-white/40" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent border-none text-sm text-white ml-3 w-full focus:outline-none placeholder:text-white/20"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden group bg-gradient-to-r from-gold via-amber-600 to-gold-light text-black py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-gold/20 hover:shadow-gold/40 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Connexion sécurisée</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Login */}
        <div className="pt-4 border-t border-white/[0.05] text-center">
          <button 
            onClick={handleDemoLogin}
            type="button"
            className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-gold transition-colors font-medium group"
          >
            <Sparkles size={14} className="text-gold group-hover:rotate-12 transition-transform" />
            <span>Remplir avec les identifiants de démo (Super Admin)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

