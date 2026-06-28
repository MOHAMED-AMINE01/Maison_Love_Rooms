import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
   ArrowLeft, ArrowRight, ShieldCheck, Mail, User, Phone, MapPin,
   Users, Clock, Heart, Sparkles, Check, CheckCircle2, Loader
} from 'lucide-react';
import CustomDatePicker from '../components/ui/CustomDatePicker';
import { API_URL } from '../constants';

const OPTIONS = [
   "Bouteille de champagne",
   "Bouquet de roses",
   "Décoration romantique",
   "Petit-déjeuner",
   "Plateau apéritif",
   "Départ tardif",
];

const ARRIVAL_TIMES = ["18h - 19h", "19h - 20h", "Après 20h"];

const OCCASIONS = ["Anniversaire", "Demande en mariage", "Saint-Valentin", "Nuit romantique"];

const FALLBACK_SUITES = [
   { name: "Love Story", price: 189, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2000&auto=format&fit=crop" },
   { name: "Baguerra", price: 189, image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2000&auto=format&fit=crop" },
];

const CONDITIONS = [
   { key: 'major', label: "Je certifie être majeur(e)." },
   { key: 'reglement', label: "J'accepte le règlement intérieur de l'établissement." },
   { key: 'cgv', label: "J'accepte les conditions de réservation et d'annulation." },
   { key: 'rgpd', label: "J'autorise l'utilisation de mes données pour le traitement de ma réservation." },
] as const;

export default function Checkout() {
   const [step, setStep] = useState(1);
   const navigate = useNavigate();
   const location = useLocation();
   const preselect = (location.state as any) || {};

   const today = new Date().toISOString().split('T')[0];

   const [suitesList, setSuitesList] = useState<{ name: string; price: number; image?: string }[]>(FALLBACK_SUITES);
   const [formulesList, setFormulesList] = useState<{ name: string; price: number; billingType: 'par_nuit' | 'forfait' }[]>([]);
   const [formula, setFormula] = useState<string>(preselect.formula || '');
   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
   const [conditions, setConditions] = useState({ major: false, reglement: false, cgv: false, rgpd: false });
   const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState('');

   const [form, setForm] = useState({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      clientAddress: '',
      suiteName: preselect.suiteName || '',
      checkIn: '',
      checkOut: '',
      arrivalTime: '',
      numberOfPersons: 2,
      occasion: '',
      occasionOther: '',
      optionOther: '',
      comments: '',
   });

   useEffect(() => {
      fetch(`${API_URL}/api/suites`)
         .then(res => res.json())
         .then(data => {
            if (Array.isArray(data) && data.length > 0) {
               setSuitesList(data.map((s: any) => ({
                  name: s.name,
                  price: s.pricePerNight,
                  image: s.imageUrl,
               })));
            }
         })
         .catch(() => console.log('Utilisation des suites statiques de secours'));

      // Formules récupérées depuis la base (Boutique & Options / Services actifs)
      fetch(`${API_URL}/api/services`)
         .then(res => res.json())
         .then(data => {
            if (Array.isArray(data)) {
               const actifs = data
                  .filter((s: any) => s.status === 'actif')
                  .map((s: any) => ({ name: s.name, price: Number(s.price) || 0, billingType: s.billingType || 'par_nuit' }));
               if (actifs.length > 0) setFormulesList(actifs);
            }
         })
         .catch(() => console.log('Impossible de récupérer les formules'));
   }, []);

   const toggleOption = (name: string) => {
      setSelectedOptions(prev => prev.includes(name) ? prev.filter(o => o !== name) : [...prev, name]);
   };

   const selectedSuite = suitesList.find(s => s.name === form.suiteName);
   const suiteImage = selectedSuite?.image || preselect.suiteImage || FALLBACK_SUITES[0].image;
   const suitePrice = selectedSuite?.price ?? preselect.price ?? 189;

   // Formule active : la formule sélectionnée, sinon la 1ère de la base par défaut
   const activeFormula = formulesList.find(f => f.name === formula) || formulesList[0];
   const unitPrice = activeFormula ? activeFormula.price : suitePrice;
   // Forfait fixe = prix unique (non multiplié par nuit) ; sinon facturé par nuit
   const isForfait = activeFormula?.billingType === 'forfait';

   const nights = (() => {
      if (!form.checkIn || !form.checkOut) return 1;
      const diff = new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime();
      const d = Math.round(diff / (1000 * 60 * 60 * 24));
      return d > 0 ? d : 1;
   })();

   const billedNights = isForfait ? 1 : nights;
   const estimatedTotal = form.suiteName ? unitPrice * billedNights : 0;
   const allConditionsAccepted = conditions.major && conditions.reglement && conditions.cgv && conditions.rgpd;

   const nextStep = () => {
      setError('');
      if (step === 1) {
         if (!form.clientName.trim() || !form.clientEmail.trim()) {
            setError('Merci de renseigner votre nom et votre adresse e-mail.');
            return;
         }
         if (!form.suiteName) {
            setError('Merci de choisir une chambre.');
            return;
         }
         if (!form.checkIn || !form.checkOut) {
            setError("Merci d'indiquer vos dates d'arrivée et de départ.");
            return;
         }
         if (new Date(form.checkOut).getTime() <= new Date(form.checkIn).getTime()) {
            setError("La date de départ doit être postérieure à la date d'arrivée.");
            return;
         }
      }
      setStep(s => s + 1);
   };

   const prevStep = () => { setError(''); setStep(s => s - 1); };

   const handleSubmit = async () => {
      setError('');
      if (!allConditionsAccepted) {
         setError("Merci d'accepter les conditions pour valider votre demande.");
         return;
      }

      const services = [...selectedOptions];
      if (form.optionOther.trim()) services.push(`Autre : ${form.optionOther.trim()}`);

      let occasion = form.occasion;
      if (form.occasion === 'Autre') {
         occasion = form.occasionOther.trim() ? `Autre : ${form.occasionOther.trim()}` : 'Autre';
      }

      const formulaName = activeFormula?.name || '';
      const specialRequest = [formulaName ? `Formule : ${formulaName}` : '', form.comments.trim()]
         .filter(Boolean)
         .join('\n');

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
               suiteName: form.suiteName,
               checkIn: form.checkIn,
               checkOut: form.checkOut,
               arrivalTime: form.arrivalTime,
               numberOfPersons: form.numberOfPersons,
               services,
               occasion,
               specialRequest,
               totalPrice: estimatedTotal,
               consentGiven: true,
               status: 'en_attente',
            }),
         });

         if (res.ok) {
            const data = await res.json().catch(() => ({}));
            const reference = data?._id ? `ML-${String(data._id).slice(-6).toUpperCase()}` : 'ML-EN-ATTENTE';
            navigate('/confirmation', {
               state: {
                  reference,
                  suiteName: form.suiteName,
                  clientName: form.clientName,
                  email: form.clientEmail,
                  phone: form.clientPhone,
                  checkIn: form.checkIn,
                  checkOut: form.checkOut,
                  arrivalTime: form.arrivalTime,
                  numberOfPersons: form.numberOfPersons,
                  services,
                  occasion,
                  formula: formulaName,
                  nights,
                  total: estimatedTotal,
               },
            });
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
   const stepLabel = step === 1 ? 'Vos informations & séjour' : step === 2 ? 'Options & attentions' : 'Conditions & envoi';

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="bg-[#0A0A0A] min-h-screen pt-48 pb-16 px-4 md:px-8 text-white font-sans selection:bg-gold/30"
      >
         <div className="container-wide max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

               {/* Main Area */}
               <div className="lg:col-span-8 relative z-20">
                  <div className="mb-12 flex items-center justify-between gap-6">
                     <div>
                        <h1 className="text-2xl md:text-4xl font-serif mb-2 md:mb-4 italic text-white leading-tight">Réservez dès maintenant votre nuit d'exception, et vivez une expérience intense chez <span translate="notranslate">Maison Love Rooms</span></h1>
                        <p className="text-white/40 italic font-light text-sm md:text-base">Étape {step} sur 3 — {stepLabel}</p>
                     </div>
                     {step > 1 && (
                        <button onClick={prevStep} className="flex items-center gap-2 text-gold hover:text-white transition-colors shrink-0">
                           <ArrowLeft size={16} />
                           <span className="text-[10px] uppercase tracking-widest font-bold">Retour</span>
                        </button>
                     )}
                  </div>

                  {/* Stepper Indicator */}
                  <div className="flex gap-4 mb-16 px-1">
                     {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1 flex-1 transition-all duration-700 ${step >= s ? 'bg-gold' : 'bg-white/10'}`} />
                     ))}
                  </div>

                  <div className="bg-[#121212] border border-white/5 p-6 sm:p-10 md:p-14 rounded-[2.5rem] shadow-2xl relative">
                     <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full" />
                     </div>

                     <AnimatePresence mode="wait">

                        {/* ÉTAPE 1 — Informations personnelles + Séjour */}
                        {step === 1 && (
                           <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 relative z-10">
                              <div>
                                 <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold mb-6 flex items-center gap-3"><User size={14} /> Informations personnelles</h2>
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
                              </div>

                              <div className="pt-8 border-t border-white/5">
                                 <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold mb-6 flex items-center gap-3"><Heart size={14} /> Votre séjour</h2>

                                 {formulesList.length > 0 && (
                                    <div className="mb-8">
                                       <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-4 block">Formule</label>
                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          {formulesList.map(f => {
                                             const active = activeFormula?.name === f.name;
                                             return (
                                                <button type="button" key={f.name} onClick={() => setFormula(f.name)}
                                                   className={`p-5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${active ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(188,155,93,0.1)]' : 'border-white/10 bg-white/[0.02] hover:border-gold/30'}`}>
                                                   <span className="space-y-1">
                                                      <span className="block font-serif text-lg text-white">{f.name}</span>
                                                      <span className="block text-[10px] uppercase tracking-widest text-white/30 font-bold">{f.price}€ {f.billingType === 'forfait' ? 'forfait' : '/ nuit'}</span>
                                                   </span>
                                                   <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${active ? 'border-gold' : 'border-white/20'}`}>
                                                      <span className={`w-2.5 h-2.5 rounded-full bg-gold transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
                                                   </span>
                                                </button>
                                             );
                                          })}
                                       </div>
                                    </div>
                                 )}

                                 <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-4 block">Suite souhaitée *</label>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    {suitesList.map(suite => {
                                       const active = form.suiteName === suite.name;
                                       return (
                                          <button type="button" key={suite.name} onClick={() => setForm({ ...form, suiteName: suite.name })}
                                             className={`p-5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${active ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(188,155,93,0.1)]' : 'border-white/10 bg-white/[0.02] hover:border-gold/30'}`}>
                                             <span className="space-y-1">
                                                <span translate="no" className="notranslate block font-serif text-lg text-white">{suite.name}</span>
                                                <span className="block text-[10px] uppercase tracking-widest text-white/30 font-bold">dès {suite.price}€ / nuit</span>
                                             </span>
                                             <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${active ? 'border-gold' : 'border-white/20'}`}>
                                                <span className={`w-2.5 h-2.5 rounded-full bg-gold transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
                                             </span>
                                          </button>
                                       );
                                    })}
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-3 relative z-30">
                                       <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 block">Date d'arrivée *</label>
                                       <CustomDatePicker value={form.checkIn} onChange={val => setForm({ ...form, checkIn: val })} minDate={today} />
                                    </div>
                                    <div className="space-y-3 relative z-20">
                                       <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 block">Date de départ *</label>
                                       <CustomDatePicker value={form.checkOut} onChange={val => setForm({ ...form, checkOut: val })} minDate={form.checkIn || today} />
                                    </div>
                                 </div>

                                 <div className="space-y-3 mb-8">
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
                              </div>

                              {error && <p className="text-rose-400 text-sm bg-rose-500/5 border border-rose-500/20 rounded-2xl py-3 px-5">{error}</p>}

                              <button onClick={nextStep} className="relative overflow-hidden px-10 py-6 w-full bg-gold text-[#0A0A0A] text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all duration-700 flex items-center justify-center gap-4 group rounded-full">
                                 <span>Continuer vers les options</span>
                                 <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                              </button>
                           </motion.div>
                        )}

                        {/* ÉTAPE 2 — Options & informations complémentaires */}
                        {step === 2 && (
                           <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 relative z-10">
                              <div>
                                 <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold mb-2 flex items-center gap-3"><Sparkles size={14} /> Options & Services</h2>
                                 <p className="text-sm italic text-white/40 mb-6">Souhaitez-vous ajouter une option ?</p>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {OPTIONS.map(opt => {
                                       const active = selectedOptions.includes(opt);
                                       return (
                                          <button type="button" key={opt} onClick={() => toggleOption(opt)}
                                             className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${active ? 'border-gold bg-gold/5' : 'border-white/10 bg-white/[0.02] hover:border-gold/30'}`}>
                                             <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${active ? 'border-gold bg-gold text-[#0A0A0A]' : 'border-white/20'}`}>
                                                {active && <Check size={12} strokeWidth={3} />}
                                             </span>
                                             <span className="text-sm text-white/80">{opt}</span>
                                          </button>
                                       );
                                    })}
                                 </div>
                                 <input type="text" value={form.optionOther} onChange={e => setForm({ ...form, optionOther: e.target.value })} placeholder="Autre option (précisez)…" className="mt-4 w-full bg-[#0A0A0A] text-white border border-white/10 rounded-2xl p-4 px-5 italic focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20" />
                              </div>

                              <div className="pt-8 border-t border-white/5">
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

                              <button onClick={nextStep} className="relative overflow-hidden px-10 py-6 w-full bg-gold text-[#0A0A0A] text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all duration-700 flex items-center justify-center gap-4 group rounded-full">
                                 <span>Dernière étape</span>
                                 <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                              </button>
                           </motion.div>
                        )}

                        {/* ÉTAPE 3 — Conditions & envoi */}
                        {step === 3 && (
                           <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 relative z-10">
                              <div>
                                 <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold mb-6 flex items-center gap-3"><ShieldCheck size={14} /> Conditions</h2>
                                 <div className="space-y-3">
                                    {CONDITIONS.map(c => {
                                       const checked = conditions[c.key];
                                       return (
                                          <button type="button" key={c.key} onClick={() => setConditions({ ...conditions, [c.key]: !checked })}
                                             className="flex items-start gap-4 w-full text-left group">
                                             <span className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-gold bg-gold text-[#0A0A0A]' : 'border-white/20 group-hover:border-gold/50'}`}>
                                                {checked && <Check size={12} strokeWidth={3} />}
                                             </span>
                                             <span className="text-sm text-white/60 leading-relaxed">{c.label} <span className="text-gold">*</span></span>
                                          </button>
                                       );
                                    })}
                                 </div>
                              </div>

                              <div className="flex items-start gap-4 p-6 bg-gold/5 border border-gold/20 rounded-2xl">
                                 <CheckCircle2 size={20} className="text-gold shrink-0 mt-0.5" />
                                 <p className="text-sm italic text-white/60 leading-relaxed">
                                    Aucun paiement en ligne : votre demande est envoyée à notre conciergerie, qui vous recontacte rapidement pour confirmer la disponibilité et finaliser votre réservation.
                                 </p>
                              </div>

                              {error && <p className="text-rose-400 text-sm bg-rose-500/5 border border-rose-500/20 rounded-2xl py-3 px-5">{error}</p>}

                              <button onClick={handleSubmit} disabled={submitting} className="relative overflow-hidden px-10 py-6 w-full bg-white text-[#0A0A0A] text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-gold transition-all duration-700 flex items-center justify-center gap-4 rounded-full disabled:opacity-50">
                                 {submitting ? <Loader className="animate-spin" size={18} /> : <span>Envoyer ma demande de réservation</span>}
                              </button>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>

               {/* Sidebar Resume */}
               <div className="lg:col-span-4 flex flex-col">
                  <div className="space-y-8 w-full sticky top-32">
                     <div className="bg-[#121212] border border-white/5 p-8 sm:p-10 rounded-[2.5rem] relative shadow-2xl overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />

                        <h3 className="text-xl sm:text-2xl font-serif mb-6 sm:mb-10 pb-4 border-b border-white/5 text-white relative z-10">Votre séjour</h3>
                        <div className="space-y-8 relative z-10">
                           <div className="flex gap-6">
                              <div className="w-24 h-24 bg-[#0A0A0A] relative overflow-hidden rounded-2xl border border-white/10">
                                 <img src={suiteImage} alt="Suite" className="w-full h-full object-cover" />
                              </div>
                              <div className="space-y-2">
                                 <span translate="no" className="notranslate text-[10px] uppercase tracking-widest font-black text-gold">{form.suiteName || 'À choisir'}</span>
                                 <span className="block italic text-white/40 text-[10px] uppercase tracking-widest font-bold">{activeFormula ? activeFormula.name : `${form.numberOfPersons} personne${form.numberOfPersons > 1 ? 's' : ''}`}</span>
                                 <span className="block font-serif text-lg text-white">{unitPrice}€ <span className="text-[10px] italic text-white/30">{isForfait ? 'forfait' : '/ nuit'}</span></span>
                              </div>
                           </div>

                           <div className="space-y-4 pt-8 border-t border-white/5">
                              <div className="flex justify-between text-xs italic text-white/40">
                                 <span>{isForfait ? 'Forfait' : `Nuitée x ${nights}`}</span>
                                 <span className="font-serif text-white/80">{form.suiteName ? unitPrice * billedNights : 0}€</span>
                              </div>

                              {selectedOptions.map(optName => (
                                 <div key={optName} className="flex justify-between text-xs italic text-white/40">
                                    <span>{optName}</span>
                                    <span className="font-serif text-white/80">à définir</span>
                                 </div>
                              ))}

                              <div className="flex justify-between items-center pt-6 border-t border-white/10 text-2xl font-serif">
                                 <span className="text-white">Estimation</span>
                                 <span className="text-gold">{estimatedTotal}€</span>
                              </div>
                              <p className="text-[10px] italic text-white/30 leading-relaxed">Tarif hébergement indicatif (hors options). Le total définitif vous est confirmé par notre équipe.</p>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-center gap-4 text-white/20">
                        <ShieldCheck size={16} />
                        <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Réservation 100% Confidentielle</span>
                     </div>

                     <div className="bg-[#121212] border border-white/5 p-8 sm:p-10 rounded-[2.5rem] relative shadow-xl overflow-hidden space-y-4">
                        <h4 className="text-lg font-serif text-gold italic">Demande particulière ?</h4>
                        <p className="text-sm text-white/50 font-light leading-relaxed">
                           Vous préparez une surprise, un cadeau ou une attention spéciale ? Écrivez-nous avant votre réservation : nous vous dirons simplement ce qui est possible et comment l’organiser.
                        </p>
                        <h4 className="text-lg font-serif text-gold italic">Besoin d'un conseil ?</h4>
                        <p className="text-sm text-white/50 font-light leading-relaxed">
                           Nous sommes joignables par email ou téléphone.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </motion.div>
   );
}
