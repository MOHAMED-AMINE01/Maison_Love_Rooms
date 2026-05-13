import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CreditCard, ShieldCheck, Mail, User, Phone, CheckCircle2 } from 'lucide-react';
import CustomDatePicker from '../components/ui/CustomDatePicker';

export default function Checkout() {
   const [step, setStep] = useState(1);
   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
   const navigate = useNavigate();
   const location = useLocation();

   // Get state from navigation
   const bookingData = location.state || {
      suiteName: "Suite Love Room",
      suiteImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
      nights: 1,
      formula: "essentielle",
      price: 189
   };

   const optionsList = [
      { name: "Pack Romantique Plus", price: 45, desc: "Bouquet de fleurs fraîches et mot personnalisé." },
      { name: "Départ Tardif (13h)", price: 40, desc: "Prolongez votre grâce matinée." },
      { name: "Ambiance Musique Live", price: 80, desc: "Sélection musicale premium pré-configurée." }
   ];

   const toggleOption = (name: string) => {
      setSelectedOptions(prev => prev.includes(name) ? prev.filter(o => o !== name) : [...prev, name]);
   };

   const calculateTotal = () => {
      let total = bookingData.price * bookingData.nights;
      selectedOptions.forEach(optName => {
         const option = optionsList.find(o => o.name === optName);
         if (option) total += option.price;
      });
      return total;
   };

   const nextStep = () => setStep(s => s + 1);
   const prevStep = () => setStep(s => s - 1);

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
                  <div className="mb-12 flex items-center justify-between">
                     <div>
                        <h1 className="text-3xl md:text-5xl font-serif mb-2 md:mb-4 italic text-white">Réservez l'Exception.</h1>
                        <p className="text-white/40 italic font-light text-sm md:text-base">Étape {step} sur 3 — {step === 1 ? 'Vos Informations' : step === 2 ? 'Personnalisation' : 'Paiement Sécurisé'}</p>
                     </div>
                     {step > 1 && (
                        <button onClick={prevStep} className="flex items-center gap-2 text-gold hover:text-white transition-colors">
                           <ArrowLeft size={16} />
                           <span className="text-[10px] uppercase tracking-widest font-bold">Retour</span>
                        </button>
                     )}
                  </div>

                  {/* Stepper Indicator */}
                  <div className="flex gap-4 mb-16 px-1">
                     {[1, 2, 3].map((s) => (
                        <div
                           key={s}
                           className={`h-1 flex-1 transition-all duration-700 ${step >= s ? 'bg-gold' : 'bg-white/10'}`}
                        />
                     ))}
                  </div>

                  <div className="bg-[#121212] border border-white/5 p-6 sm:p-10 md:p-16 rounded-[2.5rem] shadow-2xl relative">
                     {/* Decorative Gradient Wrapper */}
                     <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full" />
                     </div>

                     <AnimatePresence mode="wait">
                        {step === 1 && (
                           <motion.div
                              key="step1"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-12 relative z-10"
                           >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                 <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Nom Complet</label>
                                    <div className="relative group">
                                       <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
                                       <input type="text" placeholder="John Doe" className="w-full bg-[#0A0A0A] text-white border border-white/10 rounded-2xl p-6 pl-16 italic focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20" />
                                    </div>
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Email Confidentiel</label>
                                    <div className="relative group">
                                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
                                       <input type="email" placeholder="john@example.com" className="w-full bg-[#0A0A0A] text-white border border-white/10 rounded-2xl p-6 pl-16 italic focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20" />
                                    </div>
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Téléphone</label>
                                    <div className="relative group">
                                       <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
                                       <input type="tel" placeholder="+33 6 00 00 00 00" className="w-full bg-[#0A0A0A] text-white border border-white/10 rounded-2xl p-6 pl-16 italic focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-white/20" />
                                    </div>
                                 </div>
                                 <div className="space-y-4 relative z-50">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Nuitée Souhaitée</label>
                                    <CustomDatePicker />
                                 </div>
                              </div>
                              <button onClick={nextStep} className="relative overflow-hidden px-10 py-6 w-full bg-gold text-[#0A0A0A] text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all duration-700 flex items-center justify-center gap-4 group rounded-full">
                                 <span>Continuer vers les options</span>
                                 <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                              </button>
                           </motion.div>
                        )}

                        {step === 2 && (
                           <motion.div
                              key="step2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-12 relative z-10"
                           >
                              <div className="space-y-6">
                                 {optionsList.map((opt) => {
                                    const isSelected = selectedOptions.includes(opt.name);
                                    return (
                                       <div 
                                          key={opt.name} 
                                          onClick={() => toggleOption(opt.name)}
                                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-all group gap-4 sm:gap-0 rounded-2xl border ${isSelected ? 'border-gold/50 shadow-[0_0_15px_rgba(188,155,93,0.1)]' : 'border-white/5 hover:border-gold/30'}`}
                                       >
                                          <div className="space-y-2">
                                             <h4 className="text-lg sm:text-xl font-serif text-white">{opt.name}</h4>
                                             <p className="text-xs italic text-white/40 leading-relaxed max-w-sm">{opt.desc}</p>
                                          </div>
                                          <div className="text-left sm:text-right flex sm:block items-center justify-between w-full sm:w-auto border-t sm:border-none border-white/5 pt-4 sm:pt-0">
                                             <div className="text-gold font-serif text-xl sm:mb-3">{opt.price}€</div>
                                             <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-gold' : 'border-white/20 group-hover:border-gold'}`}>
                                                <div className={`w-3 h-3 rounded-full bg-gold transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}`} />
                                             </div>
                                          </div>
                                       </div>
                                    )
                                 })}
                              </div>
                              <button onClick={nextStep} className="relative overflow-hidden px-10 py-6 w-full bg-gold text-[#0A0A0A] text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all duration-700 flex items-center justify-center gap-4 group rounded-full">
                                 <span>Étape de Paiement</span>
                                 <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                              </button>
                           </motion.div>
                        )}

                        {step === 3 && (
                           <motion.div
                              key="step3"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-10 relative z-10"
                           >
                              <div className="p-8 bg-[#0A0A0A] border border-white/10 text-white rounded-[2rem] flex items-center justify-between">
                                 <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                                       <CreditCard size={24} className="text-gold" />
                                    </div>
                                    <div>
                                       <span className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Total à payer</span>
                                       <span className="text-2xl sm:text-4xl font-serif text-white">{calculateTotal().toFixed(2)}€</span>
                                    </div>
                                 </div>
                                 <ShieldCheck size={48} className="text-white/5 hidden sm:block" />
                              </div>

                              <div className="space-y-6">
                                 <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">Informations de carte</label>
                                    <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl italic text-white/30 text-center">
                                       Interface de paiement sécurisée Stripe / 3D Secure
                                    </div>
                                 </div>
                              </div>

                              <div className="flex items-start gap-4 p-6 bg-gold/5 border border-gold/20 rounded-2xl">
                                 <CheckCircle2 size={20} className="text-gold shrink-0 mt-0.5" />
                                 <p className="text-sm italic text-white/60 leading-relaxed">
                                    En confirmant, vous acceptez nos CGV et notre protocole de discrétion. Une pré-autorisation sera effectuée sur votre compte.
                                 </p>
                              </div>

                              <button
                                 onClick={() => navigate('/confirmation')}
                                 className="relative overflow-hidden px-10 py-6 w-full bg-white text-[#0A0A0A] text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-gold transition-all duration-700 flex items-center justify-center rounded-full"
                              >
                                 Confirmer la réservation
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
                        {/* Decorative Gradient */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />

                        <h3 className="text-xl sm:text-2xl font-serif mb-6 sm:mb-10 pb-4 border-b border-white/5 text-white relative z-10">Votre Évasion</h3>
                        <div className="space-y-8 relative z-10">
                           <div className="flex gap-6">
                              <div className="w-24 h-24 bg-[#0A0A0A] relative overflow-hidden rounded-2xl border border-white/10">
                                 <img src={bookingData.suiteImage} alt="Suite" className="w-full h-full object-cover" />
                              </div>
                              <div className="space-y-2">
                                 <span className="text-[10px] uppercase tracking-widest font-black text-gold">{bookingData.suiteName}</span>
                                 <span className="block italic text-white/40 text-[10px] uppercase tracking-widest font-bold">Formule {bookingData.formula}</span>
                                 <span className="block font-serif text-lg text-white">{bookingData.price}€ <span className="text-[10px] italic text-white/30">/ nuit</span></span>
                              </div>
                           </div>

                           <div className="space-y-4 pt-10 border-t border-white/5">
                              <div className="flex justify-between text-xs italic text-white/40">
                                 <span>Nuitée x {bookingData.nights}</span>
                                 <span className="font-serif text-white/80">{bookingData.price * bookingData.nights}€</span>
                              </div>
                              
                              {selectedOptions.map(optName => {
                                 const option = optionsList.find(o => o.name === optName);
                                 if (!option) return null;
                                 return (
                                    <div key={optName} className="flex justify-between text-xs italic text-white/40">
                                       <span>{option.name}</span>
                                       <span className="font-serif text-white/80">{option.price}€</span>
                                    </div>
                                 );
                              })}
                              
                              <div className="flex justify-between items-center pt-8 border-t border-white/10 text-3xl font-serif">
                                 <span className="text-white">Total</span>
                                 <span className="text-gold">{calculateTotal()}€</span>
                              </div>
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
