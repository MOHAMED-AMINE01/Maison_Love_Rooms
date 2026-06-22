import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  images: string[];
  stock: number;
  status: 'actif' | 'inactif';
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    images: { type: [String], default: [] },
    // Quantité disponible. Décrémentée automatiquement à chaque vente en ligne,
    // ou manuellement par l'admin pour les ventes physiques.
    stock: { type: Number, required: true, min: 0, default: 0 },
    status: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
