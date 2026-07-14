import React from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Mail, ShieldCheck, ArrowRight, Download } from 'lucide-react';
import { API_URL } from '../constants';

export default function Confirmation() {
   const { state } = useLocation();
   const [loading, setLoading] = React.useState(false);
   const [error, setError] = React.useState('');
   const [reservationData, setReservationData] = React.useState<any>(null);

   React.useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      const type = params.get('type');
      if (sessionId && type === 'reservation') {
         setLoading(true);
         fetch(`${API_URL}/api/payments/verify-reservation?session_id=${sessionId}`)
            .then(res => res.json())
            .then(resData => {
               if (resData.paid && resData.reservation) {
                  const r = resData.reservation;
                  const calculatedNights = Math.max(
                     1,
                     Math.round((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24))
                  );
                  setReservationData({
                     reference: r._id ? `ML-${String(r._id).slice(-6).toUpperCase()}` : 'ML-CONFIRME',
                     suiteName: r.suiteName,
                     clientName: r.clientName,
                     email: r.clientEmail,
                     phone: r.clientPhone,
                     checkIn: r.checkIn,
                     checkOut: r.checkOut,
                     arrivalTime: r.arrivalTime,
                     numberOfPersons: r.numberOfPersons,
                     formula: r.formuleName,
                     prestations: r.prestations || [],
                     services: r.services || [],
                     occasion: r.occasion,
                     total: r.totalPrice,
                     nights: calculatedNights,
                     isPaid: true
                  });
               } else {
                  setError("Le paiement n'a pas pu être vérifié.");
               }
            })
            .catch(() => setError("Erreur lors de la vérification du paiement."))
            .finally(() => setLoading(false));
      }
   }, []);

   if (loading) {
      return (
         <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center text-white font-sans">
            <div className="text-center space-y-4">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
               <p className="text-gold tracking-widest text-xs uppercase font-bold">Vérification de votre paiement...</p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center text-white font-sans">
            <div className="text-center space-y-6 max-w-md p-8 bg-[#121212] border border-white/10 rounded-3xl">
               <p className="text-red-500 font-bold">{error}</p>
               <Link to="/" className="inline-block bg-gold text-[#0A0A0A] font-bold px-6 py-3 rounded-full hover:bg-white transition-colors">
                  Retour à l'accueil
               </Link>
            </div>
         </div>
      );
   }

   const data = reservationData || (state as any) || {};
   const reference = data.reference || 'ML-EN-ATTENTE';
   const suiteName = data.suiteName || 'Votre suite';
   const email = data.email;

   const formatDate = (d?: string) =>
      d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

   const esc = (v: any) =>
      String(v ?? '').replace(/[&<>"']/g, c => (({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]));

   const buildReceiptHtml = () => {
      const services: string[] = Array.isArray(data.services) ? data.services : [];
      const prestations: any[] = Array.isArray(data.prestations) ? data.prestations : [];
      const row = (label: string, value: string) =>
         `<tr><td class="label">${esc(label)}</td><td class="value">${esc(value)}</td></tr>`;
      const optionsRows = prestations.length > 0
         ? prestations.map(p => row(`${p.name}${p.quantity > 1 ? ` × ${p.quantity}` : ''}`, `${p.lineTotal} €`)).join('')
         : services.map(s => row('Option', s)).join('');

      const noteText = data.isPaid
         ? "Réservation confirmée et réglée par carte bancaire. Un e-mail de confirmation contenant vos codes d'accès vous a été envoyé. Notre conciergerie reste à votre entière disposition pour préparer au mieux votre venue."
         : "Demande de réservation enregistrée — statut « en attente ». Aucun paiement en ligne n'a été effectué. Notre conciergerie vous recontacte rapidement pour confirmer la disponibilité et finaliser votre séjour. Le montant indiqué est une estimation (hébergement, hors options).";

      return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Reçu ${esc(reference)} — Maison Love Rooms</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; background: #f7f1e7; margin: 0; padding: 40px; }
  .receipt { max-width: 640px; margin: 0 auto; background: #fff; border: 1px solid #e6ddcb; border-radius: 16px; overflow: hidden; }
  .head { background: #0A0A0A; color: #D4C5A0; padding: 36px 40px; text-align: center; }
  .head .brand { font-size: 12px; letter-spacing: 6px; text-transform: uppercase; color: #BC9B5D; }
  .head h1 { margin: 8px 0 0; font-size: 30px; font-style: italic; color: #F7F1E7; }
  .head .ref { margin-top: 14px; font-size: 13px; letter-spacing: 3px; color: #BC9B5D; }
  .body { padding: 32px 40px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 12px 0; border-bottom: 1px solid #efe7d6; font-size: 15px; vertical-align: top; }
  td.label { color: #9a8c6e; width: 42%; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; font-family: Arial, sans-serif; }
  td.value { color: #1a1a1a; font-weight: 600; }
  .total { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 20px; border-top: 2px solid #0A0A0A; }
  .total .lbl { text-transform: uppercase; letter-spacing: 2px; font-size: 12px; color: #9a8c6e; }
  .total .amt { font-size: 28px; color: #BC9B5D; }
  .note { margin-top: 22px; font-size: 12px; color: #9a8c6e; font-style: italic; line-height: 1.6; }
  .foot { text-align: center; padding: 20px; font-size: 11px; color: #b3a785; border-top: 1px solid #efe7d6; }
  @media print { body { background: #fff; padding: 0; } .receipt { border: none; } }
</style></head>
<body>
  <div class="receipt">
    <div class="head">
      <div class="brand">Maison Love Rooms</div>
      <h1>Reçu de réservation</h1>
      <div class="ref">${esc(reference)}</div>
    </div>
    <div class="body">
      <table>
        ${row('Suite réservée', suiteName)}
        ${data.formula ? row('Formule', data.formula) : ''}
        ${data.clientName ? row('Client', data.clientName) : ''}
        ${email ? row('E-mail', email) : ''}
        ${data.phone ? row('Téléphone', data.phone) : ''}
        ${data.checkIn ? row("Date d'arrivée", formatDate(data.checkIn)) : ''}
        ${data.checkOut ? row('Date de départ', formatDate(data.checkOut)) : ''}
        ${data.arrivalTime ? row("Heure d'arrivée estimée", data.arrivalTime) : ''}
        ${data.numberOfPersons ? row('Nombre de personnes', String(data.numberOfPersons)) : ''}
        ${data.occasion ? row('Occasion', data.occasion) : ''}
        ${optionsRows}
      </table>
      <div class="total">
        <span class="lbl">${data.isPaid ? 'Total Payé' : 'Estimation'}${data.nights ? ` (${data.nights} nuit${data.nights > 1 ? 's' : ''})` : ''}</span>
        <span class="amt">${data.total != null ? esc(data.total) + ' €' : '—'}</span>
      </div>
      <p class="note">${esc(noteText)}</p>
    </div>
    <div class="foot">Maison Love Rooms · Reçu généré le ${new Date().toLocaleDateString('fr-FR')} · Document non contractuel</div>
  </div>
</body></html>`;
   };

   const downloadReceipt = () => {
      const html = buildReceiptHtml();
      const win = window.open('', '_blank');
      if (win) {
         win.document.open();
         win.document.write(html);
         win.document.close();
         win.focus();
         setTimeout(() => { try { win.print(); } catch { /* ignore */ } }, 400);
      } else {
         const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `recu-${reference}.html`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
      }
   };

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="bg-[#0A0A0A] min-h-screen flex items-center justify-center pt-40 pb-20 px-4 md:px-8 text-white font-sans selection:bg-gold/30"
      >
         <div className="container-wide max-w-4xl text-center">
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
               className="space-y-12 relative"
            >
               {/* Decorative Background Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

               <div className="flex flex-col items-center gap-8 relative z-10">
                  <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] bg-[#121212] border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(188,155,93,0.15)] relative">
                     <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="relative z-10 text-gold"
                     >
                        <CheckCircle2 size={50} strokeWidth={1} />
                     </motion.div>
                     <div className="absolute inset-0 bg-gold/10 blur-[40px] rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-4">
                     <h1 className="text-4xl sm:text-5xl md:text-8xl font-serif tracking-tight text-white">C'est <span className="italic font-light text-white/30">Confirmé.</span></h1>
                  </div>
               </div>

               <div className="bg-[#121212] border border-white/5 p-8 sm:p-12 md:p-20 rounded-3xl shadow-2xl space-y-12 text-left relative overflow-hidden z-10">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-white hidden sm:block">
                     <ShieldCheck size={160} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 relative z-10">
                     <div className="space-y-8">
                        <div className="space-y-2">
                           <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Référence de réservation</span>
                           <p className="text-xl sm:text-2xl font-serif tracking-widest text-white">{reference}</p>
                        </div>
                        <div className="space-y-2">
                           <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Suite réservée</span>
                           <p translate="no" className="notranslate text-xl sm:text-2xl font-serif italic text-gold">{suiteName}</p>
                        </div>
                     </div>
                     <div className="space-y-8">
                        <div className="flex items-start gap-4 sm:gap-6">
                           <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                              <Mail size={18} className="text-white/60" />
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-[10px] sm:text-sm font-bold uppercase tracking-widest font-sans text-white/60">Instructions par mail</h4>
                              <p className="text-xs sm:text-sm italic font-light text-white/40 leading-relaxed">
                                 Vous allez recevoir vos codes d'accès et le manuel de la suite par e-mail d'ici quelques minutes.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-end gap-8 text-center md:text-left">

                     <button
                        type="button"
                        onClick={downloadReceipt}
                        className="flex items-center justify-center md:justify-end gap-4 text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 hover:text-gold transition-colors cursor-pointer"
                     >
                        <Download size={16} />
                        <span>Télécharger Reçu</span>
                     </button>
                  </div>
               </div>

               <div className="pt-8 sm:pt-12 flex flex-col items-center gap-8 sm:gap-12 relative z-10">
                  <Link
                     to="/"
                     className="relative overflow-hidden px-8 sm:px-10 py-5 sm:py-6 w-full sm:w-auto bg-gold text-[#0A0A0A] text-[10px] sm:text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all duration-700 flex items-center justify-center gap-4 group rounded-full"
                  >
                     <span>Retour à l'accueil</span>
                     <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </Link>


               </div>
            </motion.div>
         </div>
      </motion.div>
   );
}
