import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Heart, X, Check } from 'lucide-react';
import { API_URL } from '../constants';

interface GiftCardData {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  features: string[];
  badge?: string;
  cta?: string;
  status: 'actif' | 'inactif';
}

export default function CartesCadeaux() {
  const [giftCards, setGiftCards] = useState<GiftCardData[]>([]);

  // Demande de carte cadeau (même système que la Boutique, sans paiement en ligne)
  const [orderCard, setOrderCard] = useState<GiftCardData | null>(null);
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '', message: '', recipient: '', fulfillment: 'retrait', address: '', postalCode: '', city: '' });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [paymentResult, setPaymentResult] = useState<'success' | 'canceled' | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/gift-cards`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => { if (Array.isArray(data)) setGiftCards(data.filter((c: GiftCardData) => c.status === 'actif')); })
      .catch(() => console.log('Aucune carte cadeau disponible'));
  }, []);

  // Retour depuis Stripe : vérifie le paiement et affiche le résultat.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session_id');
    if (sid) {
      fetch(`${API_URL}/api/payments/verify?session_id=${sid}`)
        .then(r => r.json())
        .then(d => setPaymentResult(d.paid ? 'success' : 'canceled'))
        .catch(() => setPaymentResult('canceled'));
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('canceled')) {
      setPaymentResult('canceled');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const openOrderModal = (card: GiftCardData) => {
    setOrderCard(card);
    setOrderForm({ name: '', email: '', phone: '', message: '', recipient: '', fulfillment: 'retrait', address: '', postalCode: '', city: '' });
    setOrderSuccess(false);
    setOrderError('');
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCard) return;
    if (!orderForm.name || !orderForm.email) {
      setOrderError('Merci de renseigner votre nom et votre email.');
      return;
    }
    if (orderForm.fulfillment === 'livraison' && (!orderForm.address || !orderForm.city)) {
      setOrderError('Merci de renseigner votre adresse de livraison.');
      return;
    }
    setOrderSubmitting(true);
    setOrderError('');
    try {
      const res = await fetch(`${API_URL}/api/gift-card-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftCardId: orderCard._id,
          customerName: orderForm.name,
          customerEmail: orderForm.email,
          customerPhone: orderForm.phone,
          recipientName: orderForm.recipient,
          note: orderForm.message,
          fulfillment: orderForm.fulfillment,
          customerAddress: orderForm.fulfillment === 'livraison' ? orderForm.address : '',
          customerPostalCode: orderForm.fulfillment === 'livraison' ? orderForm.postalCode : '',
          customerCity: orderForm.fulfillment === 'livraison' ? orderForm.city : '',
        }),
      });
      if (res.ok) {
        const order = await res.json();
        const sres = await fetch(`${API_URL}/api/payments/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order._id }),
        });
        const sdata = await sres.json().catch(() => ({}));
        if (sres.ok && sdata.url) {
          window.location.href = sdata.url;
          return;
        }
        setOrderError(sdata.message || "Le paiement est indisponible pour le moment.");
      } else {
        const err = await res.json().catch(() => ({}));
        setOrderError(err.message || "La demande n'a pas pu être enregistrée.");
      }
    } catch {
      setOrderError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-page min-h-screen font-sans selection:bg-gold/30">
      {/* Hero */}
      <section className="relative h-[45vh] md:h-[42vh] flex items-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover brightness-[0.35]" alt="Cartes cadeaux" />
        <div className="container-wide relative z-10 px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-7xl font-serif text-gold leading-tight tracking-tighter mb-4">Cartes cadeaux</h1>
          <p className="text-white/70 max-w-2xl mx-auto font-serif italic">Offrez du temps, pas un objet. La carte cadeau s'adapte à l'envie : accès love room, séjour, massage ou attention sur place.</p>
        </div>
      </section>

      <section className="relative bg-page py-20 md:py-28 overflow-hidden">
        <div className="container-wide px-6 md:px-12">
          <p className="text-center text-gold max-w-2xl mx-auto text-base italic font-serif mb-16">Contactez-nous pour préparer votre carte cadeau.</p>

          {giftCards.length === 0 ? (
            <div className="text-center text-noir/40 py-16">
              <Gift size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucune carte cadeau disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10 pt-8">
              {giftCards.map((card, idx) => (
                <motion.div key={card._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 * idx }} className="group relative">
                  <div className="bg-gold/15 border border-noir/[0.04] rounded-[2rem] pt-14 px-6 pb-10 flex flex-col items-center h-full relative z-10 group-hover:-translate-y-2 group-hover:border-gold/30 shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[6px] border-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] relative z-10 group-hover:scale-105 transition-transform duration-500">
                          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                        </div>
                        {card.badge && (
                          <div className="absolute -top-2 -right-2 bg-gold text-noir text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(188,155,93,0.4)] border-2 border-white z-20">{card.badge}</div>
                        )}
                      </div>
                    </div>
                    <div className="mt-14 w-full text-center space-y-3 mb-8 flex-1">
                      <h3 className="text-xl lg:text-2xl font-serif font-bold text-noir group-hover:text-gold transition-colors">{card.name}</h3>
                      <div className="text-3xl font-serif text-gold">{card.price}€</div>
                      <p className="text-noir/70 text-sm leading-relaxed px-2">{card.description}</p>
                    </div>
                    <div className="w-full space-y-3 mb-10">
                      {card.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                          <span className="text-sm text-noir/90">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => openOrderModal(card)} className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gold hover:bg-gold-light text-noir text-[10px] uppercase tracking-[0.2em] font-black shadow-[0_0_20px_rgba(188,155,93,0.3)] group-hover:shadow-[0_0_30px_rgba(188,155,93,0.5)] transition-all duration-300">
                      <Heart size={15} className="fill-current" />{card.cta || 'Offrir ce cadeau'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Résultat de paiement (retour Stripe) */}
      <AnimatePresence>
        {paymentResult && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-noir/70 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-page border border-noir/10 rounded-[2rem] p-8 md:p-10 max-w-md w-full relative shadow-2xl text-center space-y-5">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${paymentResult === 'success' ? 'bg-gold/15' : 'bg-red-100'}`}>
                {paymentResult === 'success' ? <Check size={30} className="text-gold" /> : <X size={30} className="text-red-500" />}
              </div>
              <h3 className="text-2xl font-serif text-noir">{paymentResult === 'success' ? 'Paiement confirmé' : 'Paiement annulé'}</h3>
              <p className="text-noir/50 text-sm leading-relaxed">
                {paymentResult === 'success'
                  ? 'Merci ! Votre carte cadeau est confirmée. Nous vous recontactons pour la préparer et l\'organiser.'
                  : "Votre paiement n'a pas été finalisé. Vous pouvez réessayer quand vous le souhaitez."}
              </p>
              <button onClick={() => setPaymentResult(null)} className="px-8 py-4 rounded-full bg-noir text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-noir transition-all duration-500">Fermer</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modale de demande de carte cadeau (sans paiement en ligne) */}
      <AnimatePresence>
        {orderCard && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-noir/70 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-page border border-noir/10 rounded-[2rem] p-8 md:p-10 max-w-md w-full relative shadow-2xl">
              <button onClick={() => setOrderCard(null)} className="absolute top-5 right-5 text-noir/40 hover:text-noir transition-colors" aria-label="Fermer"><X size={22} /></button>
              {orderSuccess ? (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 bg-gold/15 rounded-full mx-auto flex items-center justify-center"><Check size={30} className="text-gold" /></div>
                  <h3 className="text-2xl font-serif text-noir">Demande enregistrée</h3>
                  <p className="text-noir/50 text-sm leading-relaxed">Merci ! Nous avons bien reçu votre demande pour la carte <span className="font-semibold text-noir">{orderCard.name}</span>. Nous vous recontactons rapidement pour préparer votre carte cadeau et finaliser le paiement.</p>
                  <button onClick={() => setOrderCard(null)} className="px-8 py-4 rounded-full bg-noir text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-noir transition-all duration-500">Fermer</button>
                </div>
              ) : (
                <form onSubmit={submitOrder} className="space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b border-noir/10">
                    <img src={orderCard.imageUrl} alt={orderCard.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div><h3 className="text-lg font-serif text-noir leading-tight">{orderCard.name}</h3><span className="text-gold font-serif text-xl">{orderCard.price}€</span></div>
                  </div>
                  <p className="text-noir/50 text-xs leading-relaxed">Renseignez vos coordonnées, puis vous serez redirigé vers le paiement sécurisé (Stripe).</p>
                  <div className="space-y-3">
                    <input type="text" value={orderForm.name} onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })} placeholder="Votre nom" className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold" />
                    <input type="email" value={orderForm.email} onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })} placeholder="Votre email" className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold" />
                    <input type="tel" value={orderForm.phone} onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })} placeholder="Téléphone (optionnel)" className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold" />
                    <input type="text" value={orderForm.recipient} onChange={(e) => setOrderForm({ ...orderForm, recipient: e.target.value })} placeholder="À qui offrir ? (nom du destinataire)" className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold" />
                    <textarea rows={3} value={orderForm.message} onChange={(e) => setOrderForm({ ...orderForm, message: e.target.value })} placeholder="Message / dédicace (optionnel)" className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold resize-none" />
                  </div>

                  {/* Mode de récupération */}
                  <div className="space-y-2">
                    <span className="text-sm text-noir/60 block">Récupération</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ v: 'retrait', l: 'Retrait sur place' }, { v: 'livraison', l: 'Livraison à domicile' }].map(o => (
                        <button type="button" key={o.v} onClick={() => setOrderForm({ ...orderForm, fulfillment: o.v })}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${orderForm.fulfillment === o.v ? 'border-gold bg-gold/10 text-noir' : 'border-noir/10 text-noir/50 hover:border-gold/40'}`}>{o.l}</button>
                      ))}
                    </div>
                  </div>

                  {/* Adresse (si livraison) */}
                  {orderForm.fulfillment === 'livraison' && (
                    <div className="space-y-3">
                      <input type="text" value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} placeholder="Adresse" className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" value={orderForm.postalCode} onChange={(e) => setOrderForm({ ...orderForm, postalCode: e.target.value })} placeholder="Code postal" className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold" />
                        <input type="text" value={orderForm.city} onChange={(e) => setOrderForm({ ...orderForm, city: e.target.value })} placeholder="Ville" className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                  )}
                  {orderError && <p className="text-red-500 text-sm">{orderError}</p>}
                  <button type="submit" disabled={orderSubmitting} className="w-full py-4 rounded-full bg-noir text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-noir transition-all duration-500 disabled:opacity-50">
                    {orderSubmitting ? 'Redirection...' : 'Procéder au paiement'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
