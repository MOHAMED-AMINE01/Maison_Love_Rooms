import mongoose, { Document, Schema } from 'mongoose';

// Ligne de prestation ajoutée à une réservation (nouveau format structuré Phase 0).
export interface IReservationPrestation {
  prestationId?: mongoose.Types.ObjectId;
  name: string;
  unitPrice: number;
  quantity: number;
  variant?: string; // libellé du choix spécifique retenu (ex: "Duo")
  lineTotal: number;
}

export interface IReservation extends Document {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  suiteName: string;
  // Formule principale choisie (nouveau tunnel).
  formuleName?: string;
  formulePrice?: number;
  checkIn: Date;
  checkOut: Date;
  arrivalTime?: string;
  numberOfPersons: number;
  // Ancien champ : simples libellés d'options. Conservé pour compatibilité lecture.
  services: string[];
  // Nouveau champ : lignes de prestations chiffrées (nom, prix, quantité…).
  prestations: IReservationPrestation[];
  occasion?: string;
  specialRequest?: string;
  internalNote?: string;
  totalPrice: number;
  consentGiven?: boolean;
  status: 'en_attente' | 'confirmee' | 'validee' | 'annulee' | 'terminee';
  paymentStatus: 'non_paye' | 'paye' | 'rembourse';
  paymentProvider: 'aucun' | 'stripe';
  paymentRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reservationPrestationSchema = new Schema<IReservationPrestation>(
  {
    prestationId: { type: Schema.Types.ObjectId, ref: 'Service' },
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    variant: { type: String },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const reservationSchema = new Schema<IReservation>(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String },
    clientAddress: { type: String },
    suiteName: { type: String, required: true },
    formuleName: { type: String },
    formulePrice: { type: Number },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    arrivalTime: { type: String },
    numberOfPersons: { type: Number, default: 2 },
    services: [{ type: String }],
    prestations: { type: [reservationPrestationSchema], default: [] },
    occasion: { type: String },
    specialRequest: { type: String },
    internalNote: { type: String },
    totalPrice: { type: Number, required: true },
    consentGiven: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['en_attente', 'confirmee', 'validee', 'annulee', 'terminee'],
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
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);

export default Reservation;
