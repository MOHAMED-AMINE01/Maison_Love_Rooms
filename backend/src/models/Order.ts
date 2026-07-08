import mongoose, { Schema, Document } from 'mongoose';

interface IOrderItem {
  // 'product' = article boutique (avec stock) ; 'giftcard' = carte cadeau (sans stock).
  itemType?: 'product' | 'giftcard';
  product?: mongoose.Types.ObjectId; // renseigné uniquement pour les produits
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  items: IOrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  // Adresse (renseignée si livraison)
  customerAddress?: string;
  customerPostalCode?: string;
  customerCity?: string;
  // Mode de récupération de la commande
  fulfillment?: 'retrait' | 'livraison';
  // Destinataire du cadeau (cartes cadeaux uniquement)
  recipientName?: string;
  total: number;
  // Statut de traitement de la commande côté boutique.
  status: 'en_attente' | 'confirmee' | 'annulee';
  // Statut de paiement. Aujourd'hui « non_paye » (encaissement hors ligne).
  // Prêt à passer à « paye » lorsque Stripe sera branché.
  paymentStatus: 'non_paye' | 'paye' | 'rembourse';
  // Fournisseur de paiement. « aucun » pour l'instant, « stripe » plus tard.
  paymentProvider: 'aucun' | 'stripe';
  // Référence externe du paiement (ex: id de session Stripe). Vide pour l'instant.
  paymentRef?: string;
  // Message / demande particulière (ex: dédicace d'une carte cadeau).
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    itemType: { type: String, enum: ['product', 'giftcard'], default: 'product' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    items: { type: [orderItemSchema], required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    customerAddress: { type: String },
    customerPostalCode: { type: String },
    customerCity: { type: String },
    fulfillment: { type: String, enum: ['retrait', 'livraison'], default: 'retrait' },
    recipientName: { type: String },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['en_attente', 'confirmee', 'annulee'],
      default: 'en_attente',
    },
    paymentStatus: {
      type: String,
      enum: ['non_paye', 'paye', 'rembourse'],
      default: 'non_paye',
    },
    paymentProvider: {
      type: String,
      enum: ['aucun', 'stripe'],
      default: 'aucun',
    },
    paymentRef: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);
