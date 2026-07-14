import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search, Ban, Clock, User, Mail, Phone, Trash2 } from 'lucide-react';
import { AdminToast, AdminConfirmModal, useAdminToast, useAdminConfirm } from '../../components/admin/AdminModal';
import { adminFetch } from '../../utils/apiClient';

interface OrderItem {
  product?: string;
  itemType?: 'product' | 'giftcard';
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  _id: string;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerPostalCode?: string;
  customerCity?: string;
  fulfillment?: 'retrait' | 'livraison';
  recipientName?: string;
  note?: string;
  total: number;
  status: 'en_attente' | 'confirmee' | 'annulee';
  paymentStatus: 'non_paye' | 'paye' | 'rembourse';
  paymentProvider?: 'aucun' | 'stripe';
  paymentRef?: string;
  createdAt: string;
}

const STATUS_LABEL: Record<OrderData['status'], { text: string; cls: string }> = {
  en_attente: { text: 'En attente', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  confirmee: { text: 'Confirmée', cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  annulee: { text: 'Annulée', cls: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
};

const PAYMENT_LABEL: Record<OrderData['paymentStatus'], { text: string; cls: string }> = {
  non_paye: { text: 'Non payé', cls: 'bg-white/10 text-white/60 border-white/15' },
  paye: { text: 'Payé', cls: 'bg-gold/20 text-gold border-gold/30' },
  rembourse: { text: 'Remboursé', cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
};

export default function AdminCommandes() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'tous' | OrderData['status']>('tous');
  const { toast, showToast, hideToast } = useAdminToast();
  const { confirm, showConfirm, hideConfirm } = useAdminConfirm();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes', error);
      showToast('error', 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const patchOrder = async (id: string, body: Partial<Pick<OrderData, 'status' | 'paymentStatus'>>, successMsg: string) => {
    try {
      const res = await adminFetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        // La réponse est maintenant { order, refund }
        const updated = data.order ?? data;
        setOrders(prev => prev.map(o => (o._id === updated._id ? updated : o)));
        if (data.refund) {
          showToast('success', `Commande annulée & remboursée automatiquement sur Stripe (ID: ${data.refund.id}) ✓`);
        } else {
          showToast('success', successMsg);
        }
      } else {
        showToast('error', 'Mise à jour impossible');
      }
    } catch (error) {
      console.error('Erreur mise à jour commande', error);
      showToast('error', 'Erreur lors de la mise à jour');
    }
  };

  const cancelOrder = (order: OrderData) => {
    const wasPaidByStripe = order.paymentStatus === 'paye' && order.paymentProvider === 'stripe';
    showConfirm({
      title: 'Annuler la commande',
      message: wasPaidByStripe
        ? `Annuler la commande de "${order.customerName}" ? Les quantités seront remises en stock et le paiement Stripe sera remboursé automatiquement.`
        : `Annuler la commande de "${order.customerName}" ? Les quantités seront automatiquement remises en stock.`,
      type: 'danger',
      onConfirm: () => patchOrder(order._id, { status: 'annulee' }, 'Commande annulée — stock réapprovisionné'),
    });
  };

  const deleteOrder = (order: OrderData) => {
    showConfirm({
      title: 'Supprimer la commande',
      message: `Supprimer définitivement la commande de "${order.customerName}" de l'historique ? Cette action est irréversible.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await adminFetch(`/api/admin/orders/${order._id}`, { method: 'DELETE' });
          if (res.ok) {
            setOrders(prev => prev.filter(o => o._id !== order._id));
            showToast('success', 'Commande supprimée de l\'historique');
          } else {
            showToast('error', 'Impossible de supprimer la commande');
          }
        } catch {
          showToast('error', 'Erreur lors de la suppression');
        }
      },
    });
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    // Vue « Tous » : on masque les commandes abandonnées (en attente = paiement non finalisé).
    // Elles restent accessibles via le filtre « En attente ».
    const matchesFilter = filter === 'tous' ? o.status !== 'en_attente' : o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-10">
      <AdminToast {...toast} onClose={hideToast} />
      <AdminConfirmModal
        show={confirm.show}
        title={confirm.title}
        message={confirm.message}
        type={confirm.type}
        confirmLabel={confirm.title.includes('Supprimer') ? 'Supprimer' : 'Annuler la commande'}
        cancelLabel="Retour"
        onConfirm={() => {
          confirm.onConfirm();
          hideConfirm();
        }}
        onCancel={hideConfirm}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif italic font-light text-white">Commandes</h2>
          <p className="text-white/60">Suivez les commandes passées en ligne et gérez leur statut.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Rechercher (client, produit...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold w-full sm:w-80"
          />
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        {([
          { key: 'tous', label: 'Toutes' },
          { key: 'en_attente', label: 'En attente' },
          { key: 'confirmee', label: 'Confirmées' },
          { key: 'annulee', label: 'Annulées' },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === f.key ? 'bg-gold text-noir' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-white">Chargement...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <ShoppingBag size={40} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/50">Aucune commande pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Infos client + date */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_LABEL[order.status].cls}`}>
                      {STATUS_LABEL[order.status].text}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${PAYMENT_LABEL[order.paymentStatus].cls}`}>
                      {PAYMENT_LABEL[order.paymentStatus].text}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/40 text-xs">
                      <Clock size={13} /> {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                    <span className="flex items-center gap-2 text-white font-semibold">
                      <User size={14} className="text-gold" /> {order.customerName}
                    </span>
                    <span className="flex items-center gap-2 text-white/60">
                      <Mail size={14} className="text-white/40" /> {order.customerEmail}
                    </span>
                    {order.customerPhone && (
                      <span className="flex items-center gap-2 text-white/60">
                        <Phone size={14} className="text-white/40" /> {order.customerPhone}
                      </span>
                    )}
                  </div>

                  {/* Récupération / livraison / destinataire */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-white/50 pt-1">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-widest font-bold ${order.fulfillment === 'livraison' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-white/5 text-white/50 border-white/10'}`}>
                      {order.fulfillment === 'livraison' ? 'Livraison' : 'Retrait sur place'}
                    </span>
                    {order.recipientName && <span>🎁 Pour : <span className="text-white/70">{order.recipientName}</span></span>}
                    {order.fulfillment === 'livraison' && (order.customerAddress || order.customerCity) && (
                      <span>📍 {[order.customerAddress, order.customerPostalCode, order.customerCity].filter(Boolean).join(', ')}</span>
                    )}
                  </div>

                  {/* Articles */}
                  <div className="space-y-1.5 pt-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm border-b border-white/5 pb-1.5">
                        <span className="text-white/70">{item.name} <span className="text-white/40">× {item.quantity}</span></span>
                        <span className="text-white/50">{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Total</span>
                      <span className="text-xl font-serif text-gold">{order.total.toFixed(2)} €</span>
                    </div>
                  </div>

                  {/* Message / dédicace du client */}
                  {order.note && (
                    <div className="mt-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold block mb-1">Message du client</span>
                      <p className="text-sm text-white/70 italic">{order.note}</p>
                    </div>
                  )}
                </div>

                {/* Actions — le paiement Stripe confirme automatiquement la commande.
                    L'admin ne peut donc que l'annuler (remboursement auto) ou la supprimer. */}
                <div className="flex flex-row lg:flex-col gap-3 lg:w-52 shrink-0">
                  {order.status !== 'annulee' && (
                    <button
                      onClick={() => cancelOrder(order)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/20 text-rose-300 rounded-lg hover:bg-rose-500/30 transition-all text-sm font-bold"
                    >
                      <Ban size={16} /> Annuler
                    </button>
                  )}
                  <button
                    onClick={() => deleteOrder(order)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 text-white/40 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 transition-all text-sm font-bold border border-white/10 hover:border-rose-500/20"
                    title="Supprimer de l'historique"
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
