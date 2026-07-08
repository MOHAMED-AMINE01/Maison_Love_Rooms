import mongoose, { Document, Schema } from 'mongoose';

// Une "Formule" est l'offre principale du tunnel de réservation.
// Décision produit : chaque formule est RATTACHÉE à une suite (la chambre reste le
// modèle Suite, la formule est un package : Nuit Essentielle / Nuit Complète / Après-midi…).
// Le client choisit d'abord sa formule, puis la date, puis les prestations.
export interface IFormule extends Document {
  name: string;
  suiteName: string; // référence la Suite par son nom (cohérent avec Reservation.suiteName)
  description: string;
  price: number;
  // 'nuit' = séjour à la nuitée, 'apres_midi' = parenthèse de quelques heures,
  // 'forfait' = prix fixe. Sert à savoir si le prix est multiplié par le nombre de nuits.
  billingType: 'nuit' | 'apres_midi' | 'forfait';
  features: string[];
  imageUrl: string;
  images: string[];
  isPopular: boolean;
  status: 'actif' | 'inactif';
  order: number; // ordre d'affichage dans le tunnel
  createdAt: Date;
  updatedAt: Date;
}

const formuleSchema = new Schema<IFormule>(
  {
    name: { type: String, required: true },
    suiteName: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    billingType: {
      type: String,
      enum: ['nuit', 'apres_midi', 'forfait'],
      default: 'nuit',
    },
    features: { type: [String], default: [] },
    imageUrl: { type: String, default: '' },
    images: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
    status: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IFormule>('Formule', formuleSchema);
