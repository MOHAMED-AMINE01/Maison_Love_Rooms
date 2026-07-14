import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
   ArrowLeft, ArrowRight, ShieldCheck, Mail, User, Phone, MapPin,
   Users, Clock, Heart, Sparkles, Check, CheckCircle2, Loader, Star,
   Plus, Minus, CalendarDays, Package, XCircle
} from 'lucide-react';
import CustomDatePicker from '../components/ui/CustomDatePicker';
import { API_URL } from '../constants';

// ---- Types (alignés sur les modèles backend) ----
interface Formule {
   _id: string;
   name: string;
   suiteName: string;
   description: string;
   price: number;
   billingType: 'nuit' | 'apres_midi' | 'forfait';
   features: string[];
   imageUrl: string;
   isPopular: boolean;
}
interface Variant { label: string; price: number; }
interface Prestation {
   _id: string;
   name: string;
   description: string;
   price: number;
   imageUrl?: string;
   category: string;
   allowQuantity: boolean;
   maxQuantity: number;
   pricingUnit: 'par_unite' | 'forfait' | 'par_nuit';
   variants: Variant[];
   status: string;
}
interface SelState { quantity: number; variantLabel?: string; }

const ARRIVAL_TIMES = ["18 h - 19 h", "19 h - 20 h", "Après 20 h"];
const OCCASIONS = ["Anniversaire", "Demande en mariage", "Saint-Valentin", "Nuit romantique"];

const CONDITIONS = [
   { key: 'major', label: "Je certifie être majeur(e)." },
   { key: 'reglement', label: "J'accepte le règlement intérieur de l'établissement." },
   { key: 'cgv', label: "J'accepte les conditions de réservation et d'annulation." },
   { key: 'rgpd', label: "J'autorise l'utilisation de mes données pour le traitement de ma réservation." },
] as const;

const STEP_LABELS = ['Chambre & formule', 'Vos dates', 'Vos prestations', 'Vos coordonnées', 'Récapitulatif & envoi'];

const addDays = (dateStr: string, days: number) => {
   const d = new Date(dateStr);
   d.setDate(d.getDate() + days);
   return d.toISOString().split('T')[0];
};
const fmtDate = (d?: string) =>
   d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
const unitLabel = (u: Prestation['pricingUnit']) =>
   u === 'par_unite' ? '/ unité' : u === 'par_nuit' ? '/ nuit' : '/ séjour';

export default function Checkout() {
   const navigate = useNavigate();
   const location = useLocation();
   const preselect = (location.state as any) || {};
   const today = new Date().toISOString().split('T')[0];

   const [step, setStep] = useState(1);
   const [formules, setFormules] = useState<Formule[]>([]);
   const [prestations, setPrestations] = useState<Prestation[]>([]);
   const [selectedFormuleId, setSelectedFormuleId] = useState<string>('');
   const [suites, setSuites] = useState<{ _id: string; name: string; status: string; imageUrl: string }[]>([]);
   const [selectedSuiteName, setSelectedSuiteName] = useState<string>(preselect.suiteName || '');
   const [selected, setSelected] = useState<Record<string, SelState>>({});
   const [conditions, setConditions] = useState({ major: false, reglement: false, cgv: false, rgpd: false });
   const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState('');

   // Disponibilité
   const [avail, setAvail] = useState<{ loading: boolean; checked: boolean; available: boolean; reason?: string }>(
      { loading: false, checked: false, available: false }
   );

   const [form, setForm] = useState({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      clientAddress: '',
      checkIn: '',
      checkOut: '',
      arrivalTime: '',
      numberOfPersons: 2,
      occasion: '',
      occasionOther: '',
      comments: '',
   });

   // ---- Détecter annulation Stripe ----
   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('canceled') === '1') {
         setError("Le paiement a été annulé. Vous pouvez réessayer de soumettre votre réservation.");
      }
   }, []);

   // ---- Chargement des formules + prestations ----
   useEffect(() => {
      fetch(`${API_URL}/api/formules`)
         .then(res => res.json())
         .then((data: Formule[]) => {
            if (Array.isArray(data)) {
               setFormules(data);
               // Présélection depuis la page suite / la page formules
               const byId = preselect.formuleId && data.find(f => f._id === preselect.formuleId);
               const byName = preselect.formuleName && data.find(f => f.name === preselect.formuleName && (!preselect.suiteName || f.suiteName === preselect.suiteName));
               const chosen = byId || byName;
               if (chosen) {
                  setSelectedFormuleId(chosen._id);
                  setSelectedSuiteName(prev => prev || chosen.suiteName);
               }
            }
         })
         .catch(() => console.log('Impossible de récupérer les formules'));

      fetch(`${API_URL}/api/suites`)
         .then(res => res.json())
         .then((data: any[]) => {
            if (Array.isArray(data)) {
               setSuites(data.map(s => ({ _id: s._id, name: s.name, status: s.status, imageUrl: s.imageUrl })));
            }
         })
         .catch(() => console.log('Impossible de récupérer les chambres'));

      fetch(`${API_URL}/api/services`)
         .then(res => res.json())
         .then((data: Prestation[]) => {
            if (Array.isArray(data)) {
               setPrestations(data.filter(p => p.status === 'actif'));
            }
         })
         .catch(() => console.log('Impossible de récupérer les prestations'));
   }, []);

   const selectedFormule = formules.find(f => f._id === selectedFormuleId) || null;
   const suiteName = selectedSuiteName;
   const suiteFormules = formules.filter(f => f.suiteName === selectedSuiteName);
   const isNightly = selectedFormule?.billingType === 'nuit';

   // Sélectionne une chambre et réinitialise la formule si elle n'appartient pas à cette chambre.
   const selectSuite = (name: string) => {
      setSelectedSuiteName(name);
      setSelectedFormuleId(prev => {
         const f = formules.find(x => x._id === prev);
         return f && f.suiteName === name ? prev : '';
      });
   };

   const nights = useMemo(() => {
      if (!form.checkIn || !form.checkOut) return 1;
      const diff = new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime();
      const d = Math.round(diff / (1000 * 60 * 60 * 24));
      return d > 0 ? d : 1;
   }, [form.checkIn, form.checkOut]);

   const billedNights = isNightly ? nights : 1;
   const formuleTotal = selectedFormule ? selectedFormule.price * billedNights : 0;

   // ---- Calcul d'une ligne de prestation ----
   const lineOf = (p: Prestation, sel: SelState) => {
      const variant = p.variants.find(v => v.label === sel.variantLabel);
      const unit = variant ? variant.price : p.price;
      const qty = p.allowQuantity ? sel.quantity : 1;
      const mult = p.pricingUnit === 'par_nuit' ? billedNights : 1;
      return { unit, qty, mult, variantLabel: variant?.label, total: unit * qty * mult };
   };

   const prestationLines = useMemo(() => {
      return (Object.entries(selected) as [string, SelState][])
         .map(([id, sel]) => {
            const p = prestations.find(x => x._id === id);
            if (!p) return null;
            const l = lineOf(p, sel);
            return { p, sel, ...l };
         })
         .filter(Boolean) as Array<{ p: Prestation; sel: SelState; unit: number; qty: number; mult: number; variantLabel?: string; total: number }>;
   }, [selected, prestations, billedNights]);

   const prestationsTotal = prestationLines.reduce((acc, l) => acc + l.total, 0);
   const grandTotal = formuleTotal + prestationsTotal;

   // ---- Disponibilité : vérifiée dès que suite + dates sont valides ----
   useEffect(() => {
      if (!suiteName || !form.checkIn || !form.checkOut) {
         setAvail({ loading: false, checked: false, available: false });
         return;
      }
      let cancelled = false;
      setAvail(a => ({ ...a, loading: true }));
      const url = `${API_URL}/api/availability?suiteName=${encodeURIComponent(suiteName)}&checkIn=${form.checkIn}&checkOut=${form.checkOut}`;
      fetch(url)
         .then(res => res.json())
         .then(data => {
            if (cancelled) return;
            setAvail({ loading: false, checked: true, available: !!data.available, reason: data.reason });
         })
         .catch(() => {
            if (cancelled) return;
            setAvail({ loading: false, checked: true, available: false, reason: 'Impossible de vérifier la disponibilité.' });
         });
      return () => { cancelled = true; };
   }, [suiteName, form.checkIn, form.checkOut]);

   // ---- Sélection prestations ----
   const togglePrestation = (p: Prestation) => {
      setSelected(prev => {
         const next = { ...prev };
         if (next[p._id]) {
            delete next[p._id];
         } else {
            next[p._id] = { quantity: 1, variantLabel: p.variants[0]?.label };
         }
         return next;
      });
   };
   const setQty = (id: string, q: number) =>
      setSelected(prev => ({ ...prev, [id]: { ...prev[id], quantity: Math.max(1, q) } }));
   const setVariant = (id: string, label: string) =>
      setSelected(prev => ({ ...prev, [id]: { ...prev[id], variantLabel: label } }));

   // ---- Dates ----
   const setNightlyDate = (field: 'checkIn' | 'checkOut', val: string) => {
      setForm(f => ({ ...f, [field]: val }));
   };
   const setSingleDate = (val: string) => {
      setForm(f => ({ ...f, checkIn: val, checkOut: val ? addDays(val, 1) : '' }));
   };

   // ---- Navigation entre étapes ----
   const nextStep = () => {
      setError('');
      if (step === 1) {
         if (!selectedSuiteName) { setError('Merci de choisir une chambre.'); return; }
         if (!selectedFormule) { setError('Merci de choisir une formule pour continuer.'); return; }
      }
      if (step === 2) {
         if (!form.checkIn || !form.checkOut) {
            setError("Merci d'indiquer votre date.");
            return;
         }
         if (new Date(form.checkOut).getTime() <= new Date(form.checkIn).getTime()) {
            setError("La date de départ doit être postérieure à la date d'arrivée.");
            return;
         }
         if (!avail.checked || !avail.available) {
            setError(avail.reason || "Ces dates ne sont pas disponibles pour cette suite.");
            return;
         }
      }
      if (step === 4) {
         if (!form.clientName.trim() || !form.clientEmail.trim()) {
            setError('Merci de renseigner votre nom et votre adresse e-mail.');
            return;
         }
      }
      setStep(s => Math.min(5, s + 1));
   };
   const prevStep = () => { setError(''); setStep(s => Math.max(1, s - 1)); };

   const allConditionsAccepted = conditions.major && conditions.reglement && conditions.cgv && conditions.rgpd;

   const handleSubmit = async () => {
      setError('');
      if (!allConditionsAccepted) {
         setError("Merci d'accepter les conditions pour valider votre demande.");
         return;
      }
      let occasion = form.occasion;
      if (form.occasion === 'Autre') occasion = form.occasionOther.trim() ? `Autre : ${form.occasionOther.trim()}` : 'Autre';

      const prestationsPayload = prestationLines.map(l => ({
         prestationId: l.p._id,
         name: l.variantLabel ? `${l.p.name} (${l.variantLabel})` : l.p.name,
         unitPrice: l.unit,
         quantity: l.qty,
         variant: l.variantLabel,
         lineTotal: l.total,
      }));
      // Champ legacy conservé pour l'affichage dans les anciennes vues admin
      const legacyServices = prestationsPayload.map(pl => `${pl.name} × ${pl.quantity}`);

      setSubmitting(true);
      try {
         const res = await fetch(`${API_URL}/api/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               clientName: form.clientName,
               clientEmail: form.clientEmail,
               clientPhone: form.clientPhone,
               clientAddress: form.clientAddress,
               suiteName,
               formuleName: selectedFormule?.name,
               formulePrice: selectedFormule?.price,
               checkIn: form.checkIn,
               checkOut: form.checkOut,
               arrivalTime: form.arrivalTime,
               numberOfPersons: form.numberOfPersons,
               prestations: prestationsPayload,
               services: legacyServices,
               occasion,
               specialRequest: form.comments.trim(),
               totalPrice: grandTotal,
               consentGiven: true,
               status: 'en_attente',
            }),
         });
         if (res.ok) {
            const data = await res.json().catch(() => ({}));
            // Crée la session Stripe et redirige vers le paiement
            try {
               const sres = await fetch(`${API_URL}/api/payments/reservation-session`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reservationId: data._id }),
               });
               const sdata = await sres.json().catch(() => ({}));
               if (sres.ok && sdata.url) {
                  window.location.href = sdata.url;
                  return;
               } else {
                  setError(sdata.message || "Le service de paiement Stripe est indisponible pour le moment.");
                  setSubmitting(false);
               }
            } catch {
               setError("Impossible d'initialiser le paiement Stripe. Veuillez réessayer.");
               setSubmitting(false);
            }
         } else {
            const err = await res.json().catch(() => ({}));
            setError(err.message || "Votre demande n'a pas pu être envoyée. Veuillez réessayer.");
            setSubmitting(false);
         }
      } catch {
         setError('Erreur de connexion au serveur. Veuillez réessayer.');
         setSubmitting(false);
      }
   };

   const inputClass = "w-full bg-[#0A0A0A] text-white border border-white/10 rounded-2xl p-5 pl-14 italic focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20";

   // Chambres présentées à l'étape 1 : réservable si disponible ET a au moins une formule active.
   const suiteCards = useMemo(() => {
      return suites.map(s => {
         const count = formules.filter(f => f.suiteName === s.name).length;
         return { ...s, hasFormules: count > 0, bookable: s.status === 'disponible' && count > 0 };
      });
   }, [suites, formules]);

   // Prestations regroupées par catégorie pour l'étape 3
   const prestationsByCategory = useMemo(() => {
      const map: Record<string, Prestation[]> = {};
      prestations.forEach(p => {
         const key = p.category || 'Autres prestations';
         (map[key] = map[key] || []).push(p);
      });
      return map;
   }, [prestations]);

   return (
      <motion.div
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         className="bg-[#0A0A0A] min-h-screen pt-48 pb-16 px-4 md:px-8 text-white font-sans selection:bg-gold/30"
      >
         <div className="container-wide max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

               {/* Zone principale */}
               <div className="lg:col-span-8 relative z-20">
                  <div className="mb-12 flex items-center justify-between gap-6">
                     <div>
                        <h1 className="text-2xl md:text-4xl font-serif mb-2 md:mb-4 italic text-white leading-tight">Composez votre parenthèse chez <span translate="no" className="notranslate">Maison Love Rooms</span></h1>
                        <p className="text-white/40 italic font-light text-sm md:text-base">Étape {step} sur 5 — {STEP_LABELS[step - 1]}</p>
                     </div>
                     {step > 1 && (
                        <button onClick={prevStep} className="flex items-center gap-2 text-gold hover:text-white transition-colors shrink-0">
                           <ArrowLeft size={16} />
                           <span className="text-[10px] uppercase tracking-widest font-bold">Retour</span>
                        </button>
                     )}
                  </div>

                  {/* Stepper */}
                  <div className="flex gap-2 md:gap-4 mb-16 px-1">
                     {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className={`h-1 flex-1 transition-all duration-700 ${step >= s ? 'bg-gold' : 'bg-white/10'}`} />
                     ))}
                  </div>

                  <div className="bg-[#121212] border border-white/5 p-6 sm:p-10 md:p-14 rounded-[2.5rem] shadow-2xl relative">
                     <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full" />
                     </div>

                     <AnimatePresence mode="wait">

                        {/* ÉTAPE 1 — Formule */}
                        {step === 1 && (
                           <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 relative z-10">
                              {/* Choix de la chambre */}
                              <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold flex items-center gap-3"><Sparkles size={14} /> Votre chambre</h2>
                              {suites.length === 0 && <p className="text-white/40 italic text-sm">Chargement des chambres…</p>}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 {suiteCards.map(s => {
                                    const active = selectedSuiteName === s.name;
                                    return (
                                       <button type="button" key={s._id} disabled={!s.bookable} onClick={() => selectSuite(s.name)}
                                          className={`relative p-5 rounded-2xl border text-left transition-all ${!s.bookable ? 'border-white/5 bg-white/[0.01] opacity-50 cursor-not-allowed' : active ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(188,155,93,0.1)]' : 'border-white/10 bg-white/[0.02] hover:border-gold/30'}`}>
                                          <div className="flex items-center gap-4">
                                             <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/10 shrink-0">
                                                {s.imageUrl && <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />}
                                             </div>
                                             <div className="space-y-1">
                                                <span translate="no" className="notranslate block font-serif text-lg text-white">{s.name}</span>
                                                {s.status !== 'disponible'
                                                   ? <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">En maintenance</span>
                                                   : !s.hasFormules
                                                      ? <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Bientôt disponible</span>
                                                      : <span className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-bold">Disponible</span>}
                                             </div>
                                          </div>
                                       </button>
                                    );
                                 })}
                              </div>

                              {/* Choix de la formule (de la chambre sélectionnée) */}
                              {selectedSuiteName && (
                                 <div className="pt-4 space-y-4">
                                    <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold flex items-center gap-3"><Star size={14} /> Choisissez votre formule</h2>
                                    {suiteFormules.length === 0 && <p className="text-white/40 italic text-sm">Aucune formule disponible pour cette chambre.</p>}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                       {suiteFormules.map(f => {
                                          const active = selectedFormuleId === f._id;
                                          return (
                                             <button type="button" key={f._id} onClick={() => setSelectedFormuleId(f._id)}
                                                className={`relative p-6 rounded-2xl border text-left transition-all ${active ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(188,155,93,0.1)]' : 'border-white/10 bg-white/[0.02] hover:border-gold/30'}`}>
                                                {f.isPopular && (
                                                   <span className="absolute -top-2.5 left-6 bg-gold text-[#0A0A0A] text-[8px] px-3 py-1 rounded-full uppercase tracking-widest font-black flex items-center gap-1"><Star size={9} fill="currentColor" /> Recommandé</span>
                                                )}
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                   <span className="font-serif text-xl text-white">{f.name}</span>
                                                   <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${active ? 'border-gold' : 'border-white/20'}`}>
                                                      <span className={`w-2.5 h-2.5 rounded-full bg-gold transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
                                                   </span>
                                                </div>
                                                <p className="text-white/50 text-xs leading-relaxed mb-4 line-clamp-2">{f.description}</p>
                                                <div className="flex items-baseline gap-2">
                                                   <span className="text-3xl font-serif text-gold">{f.price} €</span>
                                                   <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">{f.billingType === 'nuit' ? '/ nuit' : f.billingType === 'apres_midi' ? '/ après-midi' : 'forfait'}</span>
                                                </div>
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </div>
                              )}
                              {error && <p className="text-rose-400 text-sm bg-rose-500/5 border border-rose-500/20 rounded-2xl py-3 px-5">{error}</p>}
                              <button onClick={nextStep} className="px-10 py-6 w-full bg-gold text-[#0A0A0A] text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all duration-700 flex items-center justify-center gap-4 group rounded-full">
                                 <span>Choisir mes dates</span><ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                              </button>
                           </motion.div>
                        )}

                        {/* ÉTAPE 2 — Dates & séjour */}
                        {step === 2 && (
                           <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 relative z-10">
                              <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold flex items-center gap-3"><CalendarDays size={14} /> Vos dates {suiteName && <span translate="no" className="notranslate text-white/30 normal-case tracking-normal">· {suiteName}</span>}</h2>

                              {isNightly ? (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3 relative z-30">
                                       <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 block">Date d'arrivée *</label>
                                       <CustomDatePicker value={form.checkIn} onChange={val => setNightlyDate('checkIn', val)} minDate={today} />
                                    </div>
                                    <div className="space-y-3 relative z-20">
                                       <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 block">Date de départ *</label>
                                       <CustomDatePicker value={form.checkOut} onChange={val => setNightlyDate('checkOut', val)} minDate={form.checkIn || today} />
                                    </div>
                                 </div>
                              ) : (
                                 <div className="space-y-3 relative z-30 max-w-xs">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 block">Date souhaitée *</label>
                                    <CustomDatePicker value={form.checkIn} onChange={setSingleDate} minDate={today} />
                                 </div>
                              )}

                              {/* Bandeau disponibilité */}
                              {form.checkIn && form.checkOut && (
                                 <div className={`flex items-center gap-3 p-4 rounded-2xl border text-sm ${avail.loading ? 'border-white/10 bg-white/[0.02] text-white/50' : avail.available ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-400'}`}>
                                    {avail.loading ? <Loader className="animate-spin" size={16} /> : avail.available ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                    <span>{avail.loading ? 'Vérification de la disponibilité…' : avail.available ? 'Ces dates sont disponibles !' : (avail.reason || 'Indisponible sur cette période.')}</span>
                                 </div>
                              )}

                              <div className="space-y-3">
                                 <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 flex items-center gap-2"><Clock size={12} /> Heure d'arrivée estimée</label>
                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {ARRIVAL_TIMES.map(time => {
                                       const active = form.arrivalTime === time;
                                       return (
                                          <button type="button" key={time} onClick={() => setForm({ ...form, arrivalTime: active ? '' : time })}
                                             className={`py-4 rounded-2xl border text-sm font-serif transition-all ${active ? 'border-gold bg-gold/5 text-gold' : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-gold/30'}`}>
                                             {time}
                                          </button>
                                       );
                                    })}
                                 </div>
                              </div>

                              <div className="space-y-3">
                                 <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 flex items-center gap-2"><Users size={12} /> Nombre de personnes</label>
                                 <div className="grid grid-cols-2 gap-3 max-w-xs">
                                    {[1, 2].map(n => {
                                       const active = form.numberOfPersons === n;
                                       return (
                                          <button type="button" key={n} onClick={() => setForm({ ...form, numberOfPersons: n })}
                                             className={`py-4 rounded-2xl border text-sm font-serif transition-all ${active ? 'border-gold bg-gold/5 text-gold' : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-gold/30'}`}>
                                             {n} personne{n > 1 ? 's' : ''}
                                          </button>
                                       );
                                    })}
                                 </div>
                              </div>

                              {error && <p className="text-rose-400 text-sm bg-rose-500/5 border border-rose-500/20 rounded-2xl py-3 px-5">{error}</p>}
                              <button onClick={nextStep} className="px-10 py-6 w-full bg-gold text-[#0A0A0A] text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all duration-700 flex items-center justify-center gap-4 group rounded-full">
                                 <span>Ajouter des prestations</span><ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                              </button>
                           </motion.div>
                        )}

                        {/* ÉTAPE 3 — Prestations */}
                        {step === 3 && (
                           <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 relative z-10">
                              <div>
                                 <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold flex items-center gap-3 mb-2"><Package size={14} /> Vos prestations</h2>
                                 <p className="text-sm italic text-white/40">Ajoutez des attentions à votre séjour (optionnel).</p>
                              </div>
                              {prestations.length === 0 && <p className="text-white/40 italic text-sm">Aucune prestation disponible pour le moment.</p>}
                              {(Object.entries(prestationsByCategory) as [string, Prestation[]][]).map(([cat, list]) => (
                                 <div key={cat} className="space-y-4">
                                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/40">{cat}</h3>
                                    <div className="space-y-3">
                                       {list.map(p => {
                                          const isSel = !!selected[p._id];
                                          const sel = selected[p._id];
                                          const line = isSel ? lineOf(p, sel) : null;
                                          return (
                                             <div key={p._id} className={`p-5 rounded-2xl border transition-all ${isSel ? 'border-gold bg-gold/5' : 'border-white/10 bg-white/[0.02]'}`}>
                                                <div className="flex items-start justify-between gap-4">
                                                   <div className="space-y-1">
                                                      <span className="block font-serif text-lg text-white">{p.name}</span>
                                                      <span className="block text-white/50 text-xs leading-relaxed">{p.description}</span>
                                                      <span className="block text-gold text-sm font-serif pt-1">
                                                         {p.variants.length > 0
                                                            ? `${Math.min(...p.variants.map(v => v.price))} € – ${Math.max(...p.variants.map(v => v.price))} €`
                                                            : `${p.price} €`} <span className="text-white/30 text-[10px] uppercase tracking-widest">{unitLabel(p.pricingUnit)}</span>
                                                      </span>
                                                   </div>
                                                   <button type="button" onClick={() => togglePrestation(p)}
                                                      className={`shrink-0 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${isSel ? 'bg-gold text-[#0A0A0A]' : 'border border-white/20 text-white/70 hover:border-gold hover:text-gold'}`}>
                                                      {isSel ? 'Retirer' : 'Ajouter'}
                                                   </button>
                                                </div>

                                                {isSel && (
                                                   <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4">
                                                      {/* Choix de variante */}
                                                      {p.variants.length > 0 && (
                                                         <div className="flex flex-wrap gap-2">
                                                            {p.variants.map(v => (
                                                               <button type="button" key={v.label} onClick={() => setVariant(p._id, v.label)}
                                                                  className={`px-4 py-2 rounded-xl border text-xs transition-all ${sel.variantLabel === v.label ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-white/60 hover:border-gold/30'}`}>
                                                                  {v.label} · {v.price} €
                                                               </button>
                                                            ))}
                                                         </div>
                                                      )}
                                                      {/* Quantité */}
                                                      {p.allowQuantity && (
                                                         <div className="flex items-center gap-3">
                                                            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Quantité</span>
                                                            <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                                                               <button type="button" onClick={() => setQty(p._id, sel.quantity - 1)} className="px-3 py-2 text-white/50 hover:text-gold"><Minus size={14} /></button>
                                                               <span className="px-3 text-sm font-serif">{sel.quantity}</span>
                                                               <button type="button" onClick={() => setQty(p._id, Math.min(p.maxQuantity, sel.quantity + 1))} className="px-3 py-2 text-white/50 hover:text-gold"><Plus size={14} /></button>
                                                            </div>
                                                         </div>
                                                      )}
                                                      <span className="ml-auto font-serif text-lg text-gold">{line?.total} €</span>
                                                   </div>
                                                )}
                                             </div>
                                          );
                                       })}
                                    </div>
                                 </div>
                              ))}
                              <button onClick={nextStep} className="px-10 py-6 w-full bg-gold text-[#0A0A0A] text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all duration-700 flex items-center justify-center gap-4 group rounded-full">
                                 <span>Continuer</span><ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                              </button>
                           </motion.div>
                        )}

                        {/* ÉTAPE 4 — Coordonnées */}
                        {step === 4 && (
                           <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 relative z-10">
                              <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold flex items-center gap-3"><User size={14} /> Vos coordonnées</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                 <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
                                    <input type="text" required value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="Nom et prénom *" className={inputClass} />
                                 </div>
                                 <div className="relative group">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
                                    <input type="tel" value={form.clientPhone} onChange={e => setForm({ ...form, clientPhone: e.target.value })} placeholder="Téléphone" className={inputClass} />
                                 </div>
                                 <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
                                    <input type="email" required value={form.clientEmail} onChange={e => setForm({ ...form, clientEmail: e.target.value })} placeholder="Adresse e-mail *" className={inputClass} />
                                 </div>
                                 <div className="relative group">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
                                    <input type="text" value={form.clientAddress} onChange={e => setForm({ ...form, clientAddress: e.target.value })} placeholder="Adresse postale" className={inputClass} />
                                 </div>
                              </div>

                              <div className="pt-6 border-t border-white/5">
                                 <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold mb-6 flex items-center gap-3"><Heart size={14} /> Occasion particulière</h2>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[...OCCASIONS, 'Autre'].map(occ => {
                                       const active = form.occasion === occ;
                                       return (
                                          <button type="button" key={occ} onClick={() => setForm({ ...form, occasion: active ? '' : occ })}
                                             className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${active ? 'border-gold bg-gold/5' : 'border-white/10 bg-white/[0.02] hover:border-gold/30'}`}>
                                             <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${active ? 'border-gold' : 'border-white/20'}`}>
                                                <span className={`w-2.5 h-2.5 rounded-full bg-gold transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
                                             </span>
                                             <span className="text-sm text-white/80">{occ}</span>
                                          </button>
                                       );
                                    })}
                                 </div>
                                 {form.occasion === 'Autre' && (
                                    <input type="text" value={form.occasionOther} onChange={e => setForm({ ...form, occasionOther: e.target.value })} placeholder="Précisez l'occasion…" className="mt-4 w-full bg-[#0A0A0A] text-white border border-white/10 rounded-2xl p-4 px-5 italic focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20" />
                                 )}
                                 <div className="space-y-3 mt-8">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 block">Commentaires ou demandes particulières</label>
                                    <textarea rows={4} value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} placeholder="Une surprise à préparer, une attention particulière…" className="w-full bg-[#0A0A0A] text-white border border-white/10 rounded-2xl p-5 italic focus:ring-1 focus:ring-gold outline-none transition-all resize-none placeholder:text-white/20" />
                                 </div>
                              </div>

                              {error && <p className="text-rose-400 text-sm bg-rose-500/5 border border-rose-500/20 rounded-2xl py-3 px-5">{error}</p>}
                              <button onClick={nextStep} className="px-10 py-6 w-full bg-gold text-[#0A0A0A] text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all duration-700 flex items-center justify-center gap-4 group rounded-full">
                                 <span>Voir le récapitulatif</span><ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                              </button>
                           </motion.div>
                        )}

                        {/* ÉTAPE 5 — Récapitulatif & conditions */}
                        {step === 5 && (
                           <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 relative z-10">
                              <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold flex items-center gap-3"><Sparkles size={14} /> Récapitulatif</h2>

                              <div className="space-y-3 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                                 <div className="flex justify-between text-sm"><span className="text-white/50">Formule</span><span className="text-white font-serif">{selectedFormule?.name}</span></div>
                                 <div className="flex justify-between text-sm"><span className="text-white/50">Suite</span><span translate="no" className="notranslate text-white font-serif">{suiteName}</span></div>
                                 <div className="flex justify-between text-sm"><span className="text-white/50">Séjour</span><span className="text-white font-serif">{fmtDate(form.checkIn)}{isNightly ? ` → ${fmtDate(form.checkOut)}` : ''}</span></div>
                                 {form.arrivalTime && <div className="flex justify-between text-sm"><span className="text-white/50">Arrivée estimée</span><span className="text-white font-serif">{form.arrivalTime}</span></div>}
                                 <div className="flex justify-between text-sm"><span className="text-white/50">Personnes</span><span className="text-white font-serif">{form.numberOfPersons}</span></div>
                                 {form.occasion && <div className="flex justify-between text-sm"><span className="text-white/50">Occasion</span><span className="text-white font-serif">{form.occasion === 'Autre' ? (form.occasionOther || 'Autre') : form.occasion}</span></div>}
                              </div>

                              {/* Détail chiffré */}
                              <div className="space-y-3 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                                 <div className="flex justify-between text-sm">
                                    <span className="text-white/70">{selectedFormule?.name} {isNightly && billedNights > 1 ? `× ${billedNights} nuits` : ''}</span>
                                    <span className="text-white font-serif">{formuleTotal} €</span>
                                 </div>
                                 {prestationLines.map(l => (
                                    <div key={l.p._id} className="flex justify-between text-sm">
                                       <span className="text-white/70">{l.p.name}{l.variantLabel ? ` (${l.variantLabel})` : ''}{l.qty > 1 ? ` × ${l.qty}` : ''}{l.mult > 1 ? ` × ${l.mult} nuits` : ''}</span>
                                       <span className="text-white font-serif">{l.total} €</span>
                                    </div>
                                 ))}
                                 <div className="flex justify-between items-center pt-4 border-t border-white/10 text-2xl font-serif">
                                    <span className="text-white">Total</span><span className="text-gold">{grandTotal} €</span>
                                 </div>
                              </div>

                              {/* Conditions */}
                              <div className="space-y-3">
                                 {CONDITIONS.map(c => {
                                    const checked = conditions[c.key];
                                    return (
                                       <button type="button" key={c.key} onClick={() => setConditions({ ...conditions, [c.key]: !checked })} className="flex items-start gap-4 w-full text-left group">
                                          <span className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-gold bg-gold text-[#0A0A0A]' : 'border-white/20 group-hover:border-gold/50'}`}>
                                             {checked && <Check size={12} strokeWidth={3} />}
                                          </span>
                                          <span className="text-sm text-white/60 leading-relaxed">{c.label} <span className="text-gold">*</span></span>
                                       </button>
                                    );
                                 })}
                              </div>

                              <div className="flex items-start gap-4 p-6 bg-gold/5 border border-gold/20 rounded-2xl">
                                 <CheckCircle2 size={20} className="text-gold shrink-0 mt-0.5" />
                                 <p className="text-sm italic text-white/60 leading-relaxed">Vous allez être redirigé vers le paiement sécurisé (Stripe). Une fois le paiement effectué, votre réservation est <span className="text-gold">confirmée immédiatement</span> et vos dates sont bloquées.</p>
                              </div>

                              {error && <p className="text-rose-400 text-sm bg-rose-500/5 border border-rose-500/20 rounded-2xl py-3 px-5">{error}</p>}
                              <button onClick={handleSubmit} disabled={submitting} className="px-10 py-6 w-full bg-white text-[#0A0A0A] text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-gold transition-all duration-700 flex items-center justify-center gap-4 rounded-full disabled:opacity-50">
                                 {submitting ? <Loader className="animate-spin" size={18} /> : <span>Procéder au paiement</span>}
                              </button>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>

               {/* Sidebar récapitulatif permanent */}
               <div className="lg:col-span-4 flex flex-col">
                  <div className="space-y-8 w-full sticky top-32">
                     <div className="bg-[#121212] border border-white/5 p-8 sm:p-10 rounded-[2.5rem] relative shadow-2xl overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />
                        <h3 className="text-xl sm:text-2xl font-serif mb-6 pb-4 border-b border-white/5 text-white relative z-10">Votre séjour</h3>
                        <div className="space-y-6 relative z-10">
                           <div className="flex gap-5">
                              <div className="w-20 h-20 bg-[#0A0A0A] relative overflow-hidden rounded-2xl border border-white/10 shrink-0">
                                 {selectedFormule?.imageUrl && <img src={selectedFormule.imageUrl} alt="" className="w-full h-full object-cover" />}
                              </div>
                              <div className="space-y-1">
                                 <span translate="no" className="notranslate text-[10px] uppercase tracking-widest font-black text-gold">{suiteName || 'Suite à choisir'}</span>
                                 <span className="block italic text-white/60 text-sm font-serif">{selectedFormule?.name || 'Formule à choisir'}</span>
                                 {form.checkIn && <span className="block text-white/40 text-[11px]">{fmtDate(form.checkIn)}{isNightly ? ` → ${fmtDate(form.checkOut)}` : ''}</span>}
                              </div>
                           </div>

                           <div className="space-y-3 pt-6 border-t border-white/5">
                              {selectedFormule && (
                                 <div className="flex justify-between text-xs italic text-white/40">
                                    <span>{selectedFormule.name}{isNightly && billedNights > 1 ? ` × ${billedNights} nuits` : ''}</span>
                                    <span className="font-serif text-white/80">{formuleTotal} €</span>
                                 </div>
                              )}
                              {prestationLines.map(l => (
                                 <div key={l.p._id} className="flex justify-between text-xs italic text-white/40">
                                    <span>{l.p.name}{l.variantLabel ? ` (${l.variantLabel})` : ''}{l.qty > 1 ? ` ×${l.qty}` : ''}</span>
                                    <span className="font-serif text-white/80">{l.total} €</span>
                                 </div>
                              ))}
                              <div className="flex justify-between items-center pt-4 border-t border-white/10 text-2xl font-serif">
                                 <span className="text-white">Total</span><span className="text-gold">{grandTotal} €</span>
                              </div>
                              <p className="text-[10px] italic text-white/30 leading-relaxed">Le montant définitif vous sera confirmé par notre équipe.</p>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-center gap-4 text-white/20">
                        <ShieldCheck size={16} />
                        <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Réservation 100% Confidentielle</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </motion.div>
   );
}
