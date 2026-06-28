import mongoose, { Schema, Document } from 'mongoose';

export interface IGiftCard extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  features: string[];
  badge?: string;
  cta?: string;
  status: 'actif' | 'inactif';
  createdAt: Date;
  updatedAt: Date;
}

const giftCardSchema = new Schema<IGiftCard>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    features: { type: [String], default: [] },
    badge: { type: String },
    cta: { type: String },
    status: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  },
  { timestamps: true }
);

export default mongoose.model<IGiftCard>('GiftCard', giftCardSchema);
