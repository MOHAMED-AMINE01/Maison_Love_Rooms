import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Check, X, Plus, Minus } from 'lucide-react';
import { API_URL } from '../constants';

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  status: 'actif' | 'inactif';
}

export default function Boutique() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [orderProduct, setOrderProduct] = useState<ProductData | null>(null);
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '', quantity: 1, fulfillment: 'retrait', address: '', postalCode: '', city: '' });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [paymentResult, setPaymentResult] = useState<'success' | 'canceled' | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => console.log('Aucun produit disponible'));
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

  const openOrderModal = (product: ProductData) => {
    setOrderProduct(product);
    setOrderForm({ name: '', email: '', phone: '', quantity: 1, fulfillment: 'retrait', address: '', postalCode: '', city: '' });
    setOrderSuccess(false);
    setOrderError('');
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderProduct) return;
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
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ productId: orderProduct._id, quantity: orderForm.quantity }],
          customerName: orderForm.name,
          customerEmail: orderForm.email,
          customerPhone: orderForm.phone,
          fulfillment: orderForm.fulfillment,
          customerAddress: orderForm.fulfillment === 'livraison' ? orderForm.address : '',
          customerPostalCode: orderForm.fulfillment === 'livraison' ? orderForm.postalCode : '',
          customerCity: orderForm.fulfillment === 'livraison' ? orderForm.city : '',
        }),
      });
      if (res.ok) {
        const order = await res.json();
        // Crée la session Stripe et redirige vers le paiement
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
        setOrderError(err.message || "La commande n'a pas pu être enregistrée.");
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
        <img src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover brightness-[0.35]" alt="Boutique" />
        <div className="container-wide relative z-10 px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-7xl font-serif text-gold leading-tight tracking-tighter mb-4">Notre boutique</h1>
          <p className="text-white/70 max-w-2xl mx-auto font-serif italic">Des attentions choisies pour prolonger le moment chez vous ou offrir une touche personnelle à votre parenthèse à deux.</p>
        </div>
      </section>

      {/* Produits */}
      <section className="relative bg-page py-20 md:py-28 overflow-hidden">
        <div className="container-wide px-6 md:px-12">
          {products.length === 0 ? (
            <div className="text-center text-noir/40 py-20">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucun produit disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {products.map((product, idx) => {
                const soldOut = product.stock <= 0;
                return (
                  <motion.div key={product._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 * idx }}
                    className="group bg-gold/15 border border-noir/[0.04] rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                    <div className="relative h-56 overflow-hidden">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      {soldOut ? (
                        <div className="absolute top-4 right-4 bg-noir/80 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">Rupture de stock</div>
                      ) : product.stock <= 3 ? (
                        <div className="absolute top-4 right-4 bg-gold text-noir text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">Plus que {product.stock}</div>
                      ) : null}
                    </div>
                    <div className="p-7 flex flex-col flex-1">
                      <h3 className="text-xl font-serif font-bold text-noir mb-2">{product.name}</h3>
                      <p className="text-noir/50 text-sm leading-relaxed mb-6 flex-1">{product.description}</p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-2xl font-serif text-gold">{product.price}€</span>
                        <button onClick={() => openOrderModal(product)} disabled={soldOut}
                          className={`px-6 py-3 rounded-full text-[11px] tracking-[0.3em] font-bold transition-all duration-500 ${soldOut ? 'bg-noir/5 text-noir/30 cursor-not-allowed' : 'bg-noir text-white hover:bg-gold hover:text-noir'}`}>
                          {soldOut ? 'Indisponible' : 'Commander'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
                  ? 'Merci ! Votre paiement a bien été reçu. Nous vous recontactons pour la remise ou la livraison de votre commande.'
                  : "Votre paiement n'a pas été finalisé. Vous pouvez réessayer quand vous le souhaitez."}
              </p>
              <button onClick={() => setPaymentResult(null)} className="px-8 py-4 rounded-full bg-noir text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-noir transition-all duration-500">Fermer</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modale de commande */}
      <AnimatePresence>
        {orderProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-noir/70 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-page border border-noir/10 rounded-[2rem] p-8 md:p-10 max-w-md w-full relative shadow-2xl">
              <button onClick={() => setOrderProduct(null)} className="absolute top-5 right-5 text-noir/40 hover:text-noir transition-colors" aria-label="Fermer"><X size={22} /></button>
              {orderSuccess ? (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 bg-gold/15 rounded-full mx-auto flex items-center justify-center"><Check size={30} className="text-gold" /></div>
                  <h3 className="text-2xl font-serif text-noir">Commande enregistrée</h3>
                  <p className="text-noir/50 text-sm leading-relaxed">Merci ! Nous avons bien reçu votre commande pour <span className="font-semibold text-noir">{orderProduct.name}</span>. Nous vous recontactons rapidement pour finaliser le paiement et la remise du produit.</p>
                  <button onClick={() => setOrderProduct(null)} className="px-8 py-4 rounded-full bg-noir text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gold hover:text-noir transition-all duration-500">Fermer</button>
                </div>
              ) : (
                <form onSubmit={submitOrder} className="space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b border-noir/10">
                    <img src={orderProduct.imageUrl} alt={orderProduct.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div><h3 className="text-lg font-serif text-noir leading-tight">{orderProduct.name}</h3><span className="text-gold font-serif text-xl">{orderProduct.price}€</span></div>
                  </div>
                  <p className="text-noir/50 text-xs leading-relaxed">Renseignez vos coordonnées, puis vous serez redirigé vers le paiement sécurisé (Stripe).</p>
                  <div className="space-y-3">
                    <input type="text" value={orderForm.name} onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })} placeholder="Votre nom" className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold" />
                    <input type="email" value={orderForm.email} onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })} placeholder="Votre email" className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold" />
                    <input type="tel" value={orderForm.phone} onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })} placeholder="Téléphone (optionnel)" className="w-full px-4 py-3 bg-white border border-noir/10 rounded-xl text-noir placeholder-noir/30 focus:outline-none focus:border-gold" />
                  </div>

                  {/* Quantité */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-noir/60">Quantité</span>
                    <div className="flex items-center border border-noir/10 rounded-xl overflow-hidden bg-white">
                      <button type="button" onClick={() => setOrderForm({ ...orderForm, quantity: Math.max(1, orderForm.quantity - 1) })} className="px-3 py-2 text-noir/50 hover:text-gold"><Minus size={16} /></button>
                      <span className="px-4 font-serif text-noir">{orderForm.quantity}</span>
                      <button type="button" onClick={() => setOrderForm({ ...orderForm, quantity: Math.min(orderProduct.stock, orderForm.quantity + 1) })} className="px-3 py-2 text-noir/50 hover:text-gold"><Plus size={16} /></button>
                    </div>
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
