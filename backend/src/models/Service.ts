import mongoose, { Document, Schema } from 'mongoose';

// NB: le modèle "Service" représente désormais une PRESTATION (option ajoutable au
// tunnel : massage solo/duo, petit-déjeuner, décoration, bouquet, planche…).
// Le nom de collection reste "Service" pour ne pas casser l'existant ; l'UI parle
// de "Prestation". Les formules principales vivent dans le modèle Formule.

// Variante = "choix spécifique" d'une prestation (ex: massage Solo / Duo),
// chacune avec son propre prix.
export interface IServiceVariant {
  label: string;
  price: number;
}

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  status: 'actif' | 'inactif';
  features?: string[];
  isPopular?: boolean;
  // Ancien champ conservé pour compatibilité (formules par nuit/forfait).
  billingType: 'par_nuit' | 'forfait';
  // --- Champs Prestation (ajoutés Phase 0) ---
  category: string; // regroupement dans l'étape Prestations (ex: Massage, Restauration…)
  allowQuantity: boolean; // le client peut choisir une quantité
  maxQuantity: number; // quantité max autorisée quand allowQuantity = true
  // Unité de tarification de la prestation.
  pricingUnit: 'par_unite' | 'forfait' | 'par_nuit';
  variants: IServiceVariant[]; // choix spécifiques (solo/duo…). Vide = pas de choix.
  order: number; // ordre d'affichage
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IServiceVariant>(
  {
    label: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    status: {
      type: String,
      enum: ['actif', 'inactif'],
      default: 'actif',
    },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
    billingType: {
      type: String,
      enum: ['par_nuit', 'forfait'],
      default: 'par_nuit',
    },
    // --- Prestation ---
    category: { type: String, default: '' },
    allowQuantity: { type: Boolean, default: false },
    maxQuantity: { type: Number, default: 1, min: 1 },
    pricingUnit: {
      type: String,
      enum: ['par_unite', 'forfait', 'par_nuit'],
      default: 'forfait',
    },
    variants: { type: [variantSchema], default: [] },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model<IService>('Service', serviceSchema);

export default Service;
